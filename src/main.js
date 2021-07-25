// main js file (yes main.js)
// executes all codes to make the garden alive 

// =====================
// sim environment setup
// =====================

import "./style/main.css";
// not sure why modulle.exports and require() doesn't work / 'TypeError: coordX is not a function'
import {coordY, coordX, coordToIndex} from './index-coord-helper.js';

let soilActivities = require('./soil-activities.js');
let {
   soil, 
   soilInfo,
   mycorInfo,
   createSoil, 
   loadSoilInfo, 
   createMycor, 
   toggleHRoot, 
   toggleVRoot, 
   growMycor, 
   growVRoot, 
   growHRoot, 
   growHVRoot,
   reduceNutrient
} = soilActivities;

let skyActivies = require('./sky-activities.js');
let {
   sky, 
   plantInfo,
   createSky, 
   loadPlantInfo, 
   // toggleHPlant, 
   // toggleVPlant, 
   growBud, 
   growPlants,
   wiltFlower,
   wiltPlant,
   plantGone
} = skyActivies;

let worldParams = require('./world-params.js');
let {WIDTH, 
   SKY_HEIGHT, 
   SOIL_HEIGHT, 
   HEIGHT, 
   LOWEST_STARTING_NUTRI,
    MAX_NUTRI} = worldParams;

let nutriGrid = require('./nutri-grid.js');
let {
   soilNutri,
   soilNutriRec,
   createSoilNutri,
   updateNutriRec,
   showNutri,
   waterNutriFlow
} = nutriGrid;

let hoseActivities = require('./hose.js');
let {
   getSpigots,
   nextHoseCell,
   isHose,
   waterFlow,
   waterOn,
   waterBtn1
} = hoseActivities;


// offset step time
let totalStep = 0;
let mycorGrowthRate = 3;
let hRootGrowthRate = 2;




//const waterBtn1 = document.getElementById('activate_water');
//const waterBtn2 = document.getElementById('water_btn2');

let timer;
const playBtn = document.getElementById('play');
const pauseBtn = document.getElementById('pause');
const nextBtn = document.getElementById('next');
const reBtn = document.getElementById('restart');
const nutriBtn = document.getElementById('nutri');




// ========
// stepping
// ========

// make roots constantly reduce nutrients in soil 

function step() {
   // iterate through all soil cells and grow roots
   for (let i = 0; i < soil.length; i++) {
      if (soil[i].className.includes('h_root') && 
      totalStep % hRootGrowthRate == 0 ) { growHRoot(i); }

      else if (soil[i].className.includes('v_root')) growVRoot(i);

      else if (soil[i].className.includes('mycor')
      /* && totalStep % mycorGrowthRate == 0 */) { growMycor(i); }
      // else { continue }
      reduceNutrient(i);
   }

   // iterate through sky cells and grow buds and plants   
   // and drop water if hose is turned on 
   for (let k = sky.length - WIDTH - 1; k > 0; k--) {
      growPlants(k);
      waterFlow(k);
   } 
   for (let j = sky.length - WIDTH; j < sky.length; j++) {
      growBud(j);
      waterFlow(j);
   }
   for (let l = 0; l < sky.length - WIDTH; l++) {
      wiltFlower(l);
      wiltPlant(l);
      plantGone(l);
   }

   // water in nutri grid
   if (waterBtn1.checked) { waterOn(); }  // the hose takes a while to turn off
   waterNutriFlow();
   updateNutriRec();

   // update soil grid and nutri grid, make changes visible
   for (let i = 0; i < soil.length; i++) {
      soil[i].className = soilInfo[i].state;
      soilNutri[i].className = soilNutriRec[i];
      if (mycorInfo.includes(soilInfo[i].organism)) {
         soil[i].className = soil[i].className.concat(' mycor');
      }
   }
   // cleanMycorInfo();

   // update sky
   for (let i = 0; i < sky.length; i++) {
      //wiltFlower(i);
      let x = coordX(sky[i]);
      let y = coordY(sky[i]);
      sky[i].className = plantInfo[x].state[y];
   }
   totalStep += 1;
}


// added more elements, need to restart more lists 
function restart() {
   for (let i = 0; i < WIDTH; i++) {
      soil[i].className = 'soil organic';
      soilInfo[i].state = 'soil organic';
      soilInfo[i].nutri = Math.floor(Math.random() * (MAX_NUTRI-LOWEST_STARTING_NUTRI) + LOWEST_STARTING_NUTRI);
   }
   for (let i = WIDTH; i < soil.length / 2 - WIDTH; i++) {
      soil[i].className = 'soil topsoil';
      soilInfo[i].state = 'soil topsoil';
      soilInfo[i].nutri = Math.floor(Math.random() * (MAX_NUTRI-LOWEST_STARTING_NUTRI) + LOWEST_STARTING_NUTRI);
   }
   for (let i = soil.length / 2 - WIDTH; i < soil.length; i++) {
      soil[i].className = 'soil subsoil';
      soilInfo[i].state = 'soil subsoil';
      soilInfo[i].nutri = Math.floor(Math.random() * (MAX_NUTRI-LOWEST_STARTING_NUTRI) + LOWEST_STARTING_NUTRI);
   }
   for (let i = 0; i < sky.length; i++) {
      let x = coordX(sky[i]);
      let y = coordY(sky[i]);
      sky[i].className = 'sky';
      plantInfo[x].state[y] = 'sky';
   }
   createMycor();
   totalStep = 0;
   mycorInfo = [];
   
   // reset nutri grid 
   // reset mycor 
}




// =============
// initiate sim
// =============

createSky();
createSoil();
loadSoilInfo();
loadPlantInfo();

createMycor();

createSoilNutri();
updateNutriRec();

// update soilNutri
for (let i = 0; i < soil.length; i++) {
   soilNutri[i].className = soilNutriRec[i];
}

soil.forEach((cell) => { toggleHRoot(cell) });
soil.forEach((cell) => { toggleVRoot(cell) });

/* sky.forEach((cell) => { toggleHose(cell) }); */

/*
sky.forEach((cell) => { toggleHPlant(cell)});
sky.forEach((cell) => { toggleVPlant(cell) });
*/


// delete later 
getSpigots();
nextHoseCell(sky[1], sky[91]);
isHose(sky[90]);




// ===========================
// assign functions to buttons
// ===========================


playBtn.addEventListener('click', function() {
   timer = setInterval(step, 400); });
   // need to prevent player from executing 'play' more than once 

pauseBtn.addEventListener('click', function() {clearInterval(timer);});

nextBtn.addEventListener('click', step);

reBtn.addEventListener('click', function() {
   clearInterval(timer);
   restart();
});

//reBtn.addEventListener('click', restart);

nutriBtn.addEventListener('click', showNutri);

//waterBtn2.addEventListener('click', getSpigots);

//waterBtn1.addEventListener('change', getSpigots); 
//getSpigots()



// would be nice if game automatically starts after the first seed is planted 