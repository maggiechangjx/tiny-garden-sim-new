// visualizes nutrition distribution in soil when button is clicked 
// and where water travels after it seeps into the soil


/*
To Do's
- allow nutrients to distribute, not just to immediate neighbours 
   - ex. if nutri level is maxed, distribute 1 to nearest neighbour(s) 
*/

import './style/nutri-grid.css';
import {coordY, coordX, coordToIndex} from './index-coord-helper.js';

let worldParams = require('./world-params.js');
let {
   WIDTH, 
   SOIL_HEIGHT, 
   LOWEST_STARTING_NUTRI, 
   LOW_NUTRI, 
   MAX_NUTRI, 
   FLOOD_THRESHOLD,
   WATER_NUTRI_VAL} = worldParams;

let soilActivities = require('./soil-activities.js');
let soilInfo = soilActivities.soilInfo;

const nutriFrame = document.querySelector('.nutri_frame');
let soilNutri = [];  // node list of nutri cells
let soilNutriRec = []; // record of soilNutri class names for doing updates



function createSoilNutri() {
   // creates grid that will be used to show soil nutri value
   // hidden from main grid unless clicked on 
   let stotal = WIDTH * SOIL_HEIGHT;
   for(let i=0; i < stotal; i++) {
      const cell = document.createElement('div');
      cell.classList.add("soil-nutri");
      cell.setAttribute('id',i);
      nutriFrame.appendChild(cell);
      soilNutri.push(cell);
   }
   for (let i = 0; i < WIDTH*SOIL_HEIGHT; i++) {
      soilNutri[i].classList.add("nutri_soil");
      soilNutriRec.push(soilNutri[i].className);
   }
}

function updateNutriRec() {
   for (let i = 0; i < soilNutriRec.length; i++) {
      if (soilInfo[i].nutri < LOW_NUTRI &&
         !soilNutriRec[i].includes('low-nutri')) {
         // soilNutri[0].className = soilNutri[0].className.concat(' low-nutri');
         soilNutriRec[i]= soilNutriRec[i].concat(' low-nutri');
         // console.log(`cell ${i} is dying!!`);
      }
      if (soilInfo[i].nutri >= LOW_NUTRI && 
         soilInfo[i].nutri < LOWEST_STARTING_NUTRI + 2 &&
         !soilNutriRec[i].includes('med-nutri')) {
         soilNutriRec[i] = soilNutriRec[i].concat(' med-nutri');
      }
      if (soilInfo[i].nutri > MAX_NUTRI) {
         soilNutriRec[i] = soilNutriRec[i].replace('low-nutri', '');
         soilNutriRec[i] = soilNutriRec[i].replace('med-nutri', '');
      }
      if (soilInfo[i].nutri <= 0 &&
         !soilNutriRec[i].includes('dead-nutri')) {
            soilNutriRec[i] = soilNutriRec[i].concat(' dead-nutri');

      }
   }
}

function showNutri() {
   // overlays nutrient distribution grid on screen
   let hiddenNutri = document.getElementsByClassName("hidden-nutri")[0];
   hiddenNutri.classList.toggle('show-nutri');

   //console.log('showNutri() should be working')
   //console.log(hiddenNutri.classList);
}


function nutriNeighbours(cell) {
   let x = coordX(cell);
   let y = coordY(cell);
   let neighbours = [];

   for (let dx = -1; dx < 2; dx++) {
      for (let dy = 0; dy < 2; dy++) {
         let nx = (x + dx + WIDTH) % WIDTH;
         let ny = (y + dy + SOIL_HEIGHT) % SOIL_HEIGHT;
         let nID = coordToIndex([nx, ny]);

         neighbours.push(soilNutri[nID].id);
      }
   }
   return neighbours;
}


function waterNutriFlow() {
   // directs how water flows within nutri grid 
   // water flows downwards and also hydrates nearest neighbours
   // right now it's impossible to over water .. 
   for (let i = 0; i < soilNutri.length; i++) {

      if (soilInfo[i].nutri > FLOOD_THRESHOLD &&
         !soilNutriRec[i].includes('soil-flood')) {
         soilNutriRec[i] = soilNutriRec[i].concat(' soil-flood');
      }
      if (soilNutri[i].className.includes('soil-water')) {
         let n = nutriNeighbours(soilNutri[i]); 
         
         if (soilInfo[i].nutri <= MAX_NUTRI) {
            soilInfo[i].nutri += WATER_NUTRI_VAL;
            soilNutriRec[i] = soilNutriRec[i].replace(' soil-water', '');
            // console.log(`nutri lvl at soil cell ${i}: ${soilInfo[i].nutri}`);
            // console.log(`cell ${i} class name: ${soilNutriRec[i]}`);
         }
         else if (soilNutri[i].className.includes('soil-water') &&
         soilInfo[i].nutri > MAX_NUTRI &&
         i < soilNutri.length - WIDTH) {
            let below = i + WIDTH; 
            if (soilInfo[below].nutri <= MAX_NUTRI) soilInfo[below].nutri += WATER_NUTRI_VAL;
            soilNutriRec[below] = soilNutriRec[below].concat(' soil-water');
            soilNutriRec[i] = soilNutriRec[i].replace(' soil-water', '');
            // console.log(`next cell (${below}) class name: ${soilNutriRec[below]}`);
         }
         // hydrate neighbours too! 
         for (let j = 0; j < n.length; j++) {
            if (soilInfo[n[j]].nutri <= MAX_NUTRI) soilInfo[n[j]].nutri += WATER_NUTRI_VAL;
         }
      }
   }
}



module.exports = {
   nutriFrame,
   soilNutri,
   soilNutriRec,
   createSoilNutri,
   updateNutriRec,
   showNutri,
   waterNutriFlow
}