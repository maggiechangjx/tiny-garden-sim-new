// this allows plants to grow above soil

// ========
// set up
// ========

import "./style/main.css";
import {coordY, coordX, coordToIndex} from './index-coord-helper.js';

let worldParams = require('./world-params.js');
let {WIDTH, SKY_HEIGHT, SOIL_HEIGHT, HEIGHT, LOW_NUTRI, frame} = worldParams;

let soilActs = require('./soil-activities.js');
let soil = soilActs.soil;
let soilInfo = soilActs.soilInfo;

let sky = []; 
let plantInfo = [];


class plant {
   constructor(len, state, id) {
      this.len = len;      //the length that the stem should be
      this.state = state;  // divides sky into vertical strips
      this.id = id;        // the index of the plant cell in the sky grid 
   }
}

function createSky() {
   for (let i = 0; i < WIDTH*SKY_HEIGHT; i++) {
      const cell = document.createElement('div');
      cell.classList.add("sky");
      cell.setAttribute('id',i);
      frame.appendChild(cell);
      sky.push(cell);
   }
}


function loadPlantInfo() {
   // create a plant class for each vertical sky strip, with 45 (WIDTH) strips
   // total, load in random stem length, state, and cell id 
   for (let i = 0; i < WIDTH; i++) {
      let id = [];
      let state = [];
      for (let j = i; j < sky.length; j += WIDTH) {
         id.push(j);
         state.push('sky');
         // for whatever reason creating a list of sky's and pushing the list 
         // without the loop doesn't work later down the code 
      }
      plantInfo.push(new plant(
         Math.floor(Math.random() * (8-4) + 4), state, id
      ));
   }
}

/*
function toggleHPlant(cell) {
   // click to make h_plant stem
   let x = coordX(cell);
   let y = coordY(cell);

   cell.addEventListener('click', () => {
      cell.classList.toggle('h_plant');
      plantInfo[x].state[y] = cell.className;
      console.log(cell);
   })
}

function toggleVPlant(cell) {
   // click to make v_plant stem
   let x = coordX(cell);
   let y = coordY(cell);

   cell.addEventListener('dblclick', () => {
      cell.classList.toggle('v_plant');
      plantInfo[x].state[y] = cell.className;
      console.log(cell);
   })
}
*/


// ===========
// grow plants
// ===========

function growBud(i) {
   // if an h_root reaches the top of the soil, start growing a bud for h_plant
   let diff = WIDTH * (SKY_HEIGHT - 1);   // or sky.length - WIDTH
   // diff = difference between first row of soil cell and last row of sky cell
   let x = coordX(sky[i]);
   let y = coordY(sky[i]);

   if (soil[i - diff].className == 'soil organic h_root') {
      plantInfo[x].state[y] = 'sky h_plant';
      // console.log(i);
      // console.log(x);
      // console.log(y);
   }
   else if (soil[i - diff].className == 'soil organic v_root') {
      plantInfo[x].state[y] = 'sky v_plant';
   }
}

function growPlants(i) {
   // if there's an existing bud and the plant's length < a plant's ideal length,
   // grow 1 stem cell for h and v
   let top = i - WIDTH;
   let bot = i + WIDTH; 
   let x = coordX(sky[i]);
   let y = coordY(sky[i]);
   let hstem = plantInfo[x].state.filter(cell => cell == 'sky h_plant');
   let vstem = plantInfo[x].state.filter(cell => cell == 'sky v_plant');

   if (sky[bot].className == 'sky h_plant' && 
   sky[top].className !== 'sky h_flower' && 
   sky[top].className !== 'sky v_plant' &&
   hstem.length < plantInfo[x].len) {
      plantInfo[x].state[y] = 'sky h_plant';
      // console.log('new stem at ' + i);
   }
   else if (sky[bot].className == 'sky h_plant' &&
   sky[top].className !== 'sky h_flower' && 
   hstem.length == plantInfo[x].len) {
      plantInfo[x].state[SKY_HEIGHT - hstem.length - 1] = 'sky h_flower';
      // console.log('new flower at ' + i);
   }
   else if (sky[bot].className == 'sky v_plant' && 
   sky[top].className !== 'sky v_flower' && 
   sky[top].className !== 'sky h_plant' &&
   vstem.length < plantInfo[x].len) {
      plantInfo[x].state[y] = 'sky v_plant';
   }
   else if (sky[bot].className == 'sky v_plant' &&
   sky[top].className !== 'sky v_flower' && 
   vstem.length == plantInfo[x].len) {
      plantInfo[x].state[SKY_HEIGHT - vstem.length - 1] = 'sky v_flower';
   }
}


// wilt plants

function wiltPlant(i) {
   // if flower is wilted and root is still low on nutrients, 
   // start wilting rest of the plant 
   let diff = WIDTH * (SKY_HEIGHT - 1);  // difference between first row of soil cell and last row of sky cell
   let x = coordX(sky[i]);
   let y = coordY(sky[i]);

   if (sky[i].className.includes('h_flower_wilted') || 
   sky[i].className.includes('h_plant_wilted')) {
      let budID = plantInfo[x].id[SKY_HEIGHT - 1];
      let soilID = budID - diff;

      if (soilInfo[soilID].nutri <= LOW_NUTRI && 
         !sky[i + WIDTH].className.includes('h_plant_wilted')) {
            plantInfo[x].state[y+1] = 'sky h_plant_wilted'; 
      }
   }
   if (sky[i].className.includes('v_flower_wilted') || 
   sky[i].className.includes('v_plant_wilted')) {
      let budID = plantInfo[x].id[SKY_HEIGHT - 1];
      let soilID = budID - diff;

      if (soilInfo[soilID].nutri <= LOW_NUTRI && 
         !sky[i + WIDTH].className.includes('v_plant_wilted')) {
            plantInfo[x].state[y+1] = 'sky v_plant_wilted'; 
      }
   }
}

function wiltFlower(i) {
   // if nutri lvl of top-most root cell of plant is low on nutrients, 
   // flower will start to wilt 
   let diff = WIDTH * (SKY_HEIGHT - 1);  // difference between first row of soil cell and last row of sky cell
   let x = coordX(sky[i]);
   let y = coordY(sky[i]);

   if (sky[i].className.includes('h_flower')) {
      let budID = plantInfo[x].id[SKY_HEIGHT - 1];
      let soilID = budID - diff;

      if (soilInfo[soilID].nutri <= LOW_NUTRI) {
         plantInfo[x].state[y] = 'sky h_flower_wilted'; 
      }
   }
   if (sky[i].className.includes('v_flower')) {
      let budID = plantInfo[x].id[SKY_HEIGHT - 1];
      let soilID = budID - diff;

      if (soilInfo[soilID].nutri <= LOW_NUTRI) {
         plantInfo[x].state[y] = 'sky v_flower_wilted'; 
      }
   }
}

function plantGone(i) {
   let diff = WIDTH * (SKY_HEIGHT - 1);  // difference between first row of soil cell and last row of sky cell
   let x = coordX(sky[i]);
   let y = coordY(sky[i]);

   if (sky[i].className.includes('h_flower_wilted')) {
      let budID = plantInfo[x].id[SKY_HEIGHT - 1];
      let rootID = budID - diff;

      if (!plantInfo[x].state.includes('sky h_flower') &&
      !plantInfo[x].state.includes('sky h_plant') &&
      !soil[rootID].className.includes('h_root')) {

         for (let j = 0; j < SKY_HEIGHT; j++) {
            plantInfo[x].state[j] = 'sky';
         }
      }
   }
   if (sky[i].className.includes('v_flower_wilted')) {
      let budID = plantInfo[x].id[SKY_HEIGHT - 1];
      let rootID = budID - diff;

      if (!plantInfo[x].state.includes('sky v_flower') &&
      !plantInfo[x].state.includes('sky v_plant') &&
      !soil[rootID].className.includes('v_root')) {

         for (let j = 0; j < SKY_HEIGHT; j++) {
            plantInfo[x].state[j] = 'sky';
         }
      }
   }
   
}




module.exports = {
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
}
