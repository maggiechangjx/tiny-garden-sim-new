/* 
Code for:
- building hoses
- checking for spigots
- checking if complete hoses are built at the end of existing spigots
- turning on water for built hoses
*/

// ======
// set up
// ======

import "./style/hose.css";
import "./style/nutri-grid.css"
import {coordY, coordX, coordToIndex} from './index-coord-helper.js'; 

let worldParams = require('./world-params.js');
let {WIDTH, SKY_HEIGHT, SOIL_HEIGHT, HEIGHT, frame} = worldParams;

let skyActivies = require('./sky-activities.js');
let sky = skyActivies.sky;
let plantInfo = skyActivies.plantInfo;

let soilActivities = require('./soil-activities.js');
let soil = soilActivities.soil;
let soilInfo = soilActivities.soilInfo;

let nutriActivities = require('./nutri-grid.js');
let soilNutri = nutriActivities.soilNutri;
let soilNutriRec = nutriActivities.soilNutriRec;

const waterBtn1 = document.getElementById('activate_water');
//const waterBtn2 = document.getElementById('water_btn2');
const hoseBtn1 = document.getElementById('activate_hose'); 




function buildHose(cell) {
   // click on sky cells to make hose
   let x = coordX(cell);
   let y = coordY(cell);

   cell.addEventListener('click', () => {
      cell.classList.toggle('hose');
      plantInfo[x].state[y] = cell.className;
      console.log(cell);
   })
}


function getSpigots() {
   // returns array of built spigots (hose attachment to sides of sky)
   // helper for waterOn()
   let hoses = [];
   for (let x = 0; x < WIDTH; x++) {
      let id = coordToIndex([x,0]);

      if (sky[id].className.includes('hose')) {
         hoses.push(sky[id]);
      }
   }
   for (let y = 0; y < SKY_HEIGHT; y++) {
      let id = coordToIndex([0,y]);
      let id2 = coordToIndex([WIDTH-1, y]);

      if (sky[id].className.includes('hose')) {
         hoses.push(sky[id]);
      }
      else if (sky[id2].className.includes('hose')) {
         hoses.push(sky[id2]);
      }
   }
   // console.log(hoses);
   return hoses
}


function nextHoseCell(currentCell, prevCell = currentCell) {
   // returns the next hose cell in an array
   // returns an array of nozzle cells if it exists
   let next = [];
   let x = coordX(currentCell);
   let y = coordY(currentCell);

   // hose currently only extends from left and right borders and pointing 
   // downwards, so no need to check for neighbours above
   // let topID = coordToIndex([x, y-1]);
   let botID = coordToIndex([x, y+1]);
   let leftID = coordToIndex([x-1, y]);
   let rightID = coordToIndex([x+1, y]);

   // check for next hose cell
   let checklist = [ /* sky[topID], */ sky[botID], sky[leftID], sky[rightID]];

   for (let i = 0; i < checklist.length; i++) {
      if (checklist[i].className.includes('hose') && checklist[i] != prevCell) {
         next.push(checklist[i]);
         // console.log(`next hose cell: ${checklist[i].id}`)

         // check whether there's a nozzle
         // there must be a hose cell on top in addition to other code 
         if (sky[botID] == checklist[i]) {
            let nx = coordX(checklist[i]);
            let ny = coordY(checklist[i]);
            // let nTopID = coordToIndex([nx, ny - 1]);
            // let nBotID = coordToIndex([nx, ny + 1]);
            let nLeftID = coordToIndex([nx - 1, ny]);
            let nRightID = coordToIndex([nx + 1, ny]);

            if (sky[nLeftID].className.includes('hose') &&
            sky[nRightID].className.includes('hose') &&
            sky[nLeftID] != checklist[i] &&
            sky[nRightID] != checklist[i]) {
               next.push(sky[nLeftID]);
               next.push(sky[nRightID]);
            }
         }
      }
   }
   return next;
}


function isHose(currentCell, prevCell = currentCell) {
   // checks if a hose exists from a certain spigot
   // if hose exists, also return center of spigot
   let prev = prevCell;
   let current = currentCell;
   newHoseCell = nextHoseCell(current, prev);
   // if (newHoseCell.length == 1) console.log(`next hose cell: ${newHoseCell[0].id}`);

   if (newHoseCell.length == 1) {
      prev = currentCell;
      current = newHoseCell[0];
      // console.log(`new previous: ${prev.id}`);
      // console.log(`new current: ${current.id}`);
      isHose(current, prev);
   }

   if (newHoseCell.length == 0) return false;
   else if (newHoseCell.length == 3) return [true, newHoseCell[0]];
   else { console.error('isHose error') }
}


function waterFlow(i) {
   // used to step through water movemnets -- connect with step() 
   let ogX = coordX(sky[i]);
   let ogY = coordY(sky[i]);

   if (sky[i].className.includes('water') && 
   i < sky.length - WIDTH) {
      let belowID = i + WIDTH; 

      if (!sky[belowID].className.includes('water')) {
         let belowX = coordX(sky[belowID]);
         let belowY = coordY(sky[belowID]);

         plantInfo[ogX].state[ogY] = plantInfo[ogX].state[ogY].replace('water', '');
         plantInfo[belowX].state[belowY] = plantInfo[belowX].state[belowY].concat(' water');
      }
   }
   // when water reaches the top of soil
   else if (sky[i].className.includes('water') && 
   i > sky.length - WIDTH && i < sky.length) {
      // find soil ID and set as belowID 
      let diff = WIDTH * (SKY_HEIGHT - 1);
       // diff = difference between first row of soil cell and last row of sky cell
      let belowID = i - diff;
      // console.log(`soil cell to water: ${belowID}`)
      soilNutriRec[belowID] = soilNutriRec[belowID].concat(' soil-water');
      // soilInfo[belowID].nutri += 1;
      plantInfo[ogX].state[ogY] = plantInfo[ogX].state[ogY].replace('water', '');
      // the way water moves through the rest of the nutri grid is coded in nutri-grid.js 
   }
}


function waterOn() {
   // check perimeter of sky cells 
   // if there's a hose cell, follow the hose cell and check if there's a nozzle 
   // if a nozzel is built, turn cell below nozzle into water cell
   let spigots = getSpigots()

   if (spigots.length > 0) {
      for (let i = 0; i < spigots.length; i++) {
         if (isHose(spigots[i])[0]) {
            // produce drop of water below nozzle
            
            let center = isHose(spigots[i])[1];
            let waterID = Number(center.id) + WIDTH;
            let waterX = coordX(sky[waterID]);
            let waterY = coordY(sky[waterID]);

            plantInfo[waterX].state[waterY] = plantInfo[waterX].state[waterY].concat(' water');
            sky[waterID].className = sky[waterID].className.concat(' water');
            // console.log(`current spigot ${spigots[i].id} is a built hose`);
         }
      }
   }
   // console.log('waterOn is working');
}



// =======
// buttons
// =======

hoseBtn1.addEventListener('change', function() { 
   sky.forEach((cell) => { buildHose(cell) });});

 
waterBtn1.addEventListener('change', waterOn); 

//waterBtn2.addEventListener('click', getSpigots);




// probably won't need this eventually
module.exports = {
   getSpigots,
   nextHoseCell,
   isHose,
   waterFlow,
   waterOn,
   waterBtn1 
}






