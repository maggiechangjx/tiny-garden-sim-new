// grow a single plant from a single seed

import "./style/main.css";
import {coordY, coordX, coordToIndex} from './index-coord-helper.js';

let styling = require('./style-helper.js');
let {
   toggleBtnOnOff
} = styling;

let worldParams = require('./world-params.js');
let {
   WIDTH, 
   SOIL_HEIGHT, 
   SKY_HEIGHT,
   HEIGHT, 
   LOWEST_STARTING_NUTRI, 
   LOW_NUTRI,
   MAX_NUTRI, 
   ROOT_LEN_FOR_PLANT,
   MAX_ROOT_LEN,
   CONT_ROOT_GROW,
   ROOT_MULTIPLIER,
   frame} = worldParams;

let soilActivities = require('./soil-activities.js');
let {
   arrIncludes,
   soil, 
   soilInfo,
   mycorInfo,
   createSoil, 
   loadSoilInfo, 
   mostNutri,
   reduceNutrient
} = soilActivities;

let skyActivities = require('./sky-activities.js');
let {
   sky,
   plantInfo
} = skyActivities

class singlePlant {
   constructor(id, rootLen, maxRootLen, rootList, soilPlantList) {
      this.id = id;                          // ID of initial seed placement
      this.rootLen = rootLen;                // length of root
      this.maxRootLen = maxRootLen,          // maximum length of root
      this.rootList = rootList;              // list of all root cells IDs associated with this seed
      this.soilPlantList = soilPlantList;    // list of underground plant cells 
   }
}

class skyCell {
   constructor(state, id) {
      this.state = state;
      this.id = id;
   }
}

let allPlants = [];
let skyInfo = [];



// =================
// grow underground
// =================

function toggleSeed1(cell) {
   // click to make single root,
   // reduce soil nutri level by 1
   cell.addEventListener('click', () => {
      cell.classList.toggle('seed1');
      soilInfo[cell.id].state = cell.className;
      soilInfo[cell.id].nutri -= 1;
      allPlants.push ( new singlePlant( Number(cell.id), 1, MAX_ROOT_LEN, 
      [Number(cell.id)], []));
      console.log(cell)
   });
}

/*
function loadSkyInfo() {
   for (let i = 0; i < SKY_HEIGHT * WIDTH; i++) {
      skyInfo.push(new skyCell( sky[i].className, i ));
   }
}
*/

function avgPlant1SoilNutri(i) {
   // given any id, calculate the average nutri level of plant1 in soil 
   let seedID = findSeedID(i);
   let allPlantsPos = findIndex(allPlants, seedID); 
   // console.log(`id: ${i}, seedID: ${seedID}, allPlantsPos: ${allPlantsPos}`)
   let rootList = allPlants[allPlantsPos].rootList;
   let soilPlantList = allPlants[allPlantsPos].soilPlantList;
   let totalNutri = 0; 

   for (let k = 0; k < rootList.length; k++) {
      let cellID = rootList[k];
      totalNutri += soilInfo[cellID].nutri;
   }
   // console.log(`totalNutri in rootList: ${totalNutri}`);
   for (let j = 0; j < soilPlantList.length; j++) {
      let cellID = soilPlantList[j];
      totalNutri += soilInfo[cellID].nutri;
   }
   // console.log(`totalNutri in rootList + soilPlantList: ${totalNutri}`);
   return {
      allPlantsPos: allPlantsPos,
      avgPlantNutri: totalNutri / (rootList.length + soilPlantList.length)
   };
}

function findIndex(arr, index) {
   // array of class objects, grid-based index --> position in array (int)
   // given the object's grid-based index, return the object's index in another array
   let result = arr.find( ({id}) => Number(id) == Number(index) );
   return arr.indexOf(result);
}

function root1Neighbours(cell) {
   // return an array [soilCell] of a soil cell's nearest 3 neighbours below
   // same as vRootNeighbours()
   let n = [];
   let x = coordX(cell);
   let y = coordY(cell);
   let ny = (y + 1 + SOIL_HEIGHT) % SOIL_HEIGHT;

   for (let dx = -1; dx < 2; dx++) {
      let nx = (x + dx + WIDTH) % WIDTH;
      n.push(soilInfo[coordToIndex([nx, ny])]);
   }
   return n
}

function findSeedID(i) {
   // search through rootList and soilPlantList in allPlants to find the seed ID, given i  
   // let result = arr.find( ({id}) => Number(id) == i );

   for (j = 0; j < allPlants.length; j++) {
      for (k = 0; k < allPlants[j].rootList.length; k++) {
         let searchID = allPlants[j].rootList[k];
         if (searchID == i) { return allPlants[j].id }
      }
      for (l = 0; l < allPlants[j].soilPlantList.length; l++) {
         let searchID = allPlants[j].soilPlantList[l];
         if (searchID == i) { return allPlants[j].id }
      } 
   }
}


// ========================
// grow plant underground
// ========================

function growRoot1(i) {
   // turn 1 or 2 cells below an existing seed or root into a new root every iteration
   // the cell with the highest nutri lvl will be turned into a root 
   // if two cells have the same high nutri lvl and the two cells are not 
   // together, roots will grow on both cells 
   let nb = root1Neighbours(soil[i]);
   let nbState = [];

   // filter out mycor cells
   // nb = nb.filter(cell => !cell.className.includes('mycor'));

   for (let j = 0; j < nb.length; j++) {
      nbState.push(nb[j].state);
   }

   let avg = avgPlant1SoilNutri(i); 
   let {allPlantsPos, avgPlantNutri} = avg

   // if bottom neighbours not occupied, grow 
   if (!arrIncludes(nbState, 'root1') && !arrIncludes(nbState, 'seed1') &&
   !arrIncludes(nbState, 'ud_plant1') && avgPlantNutri > LOW_NUTRI) {
      // choose cell with largest soil nutri value to grow into 
      let grow = mostNutri(nb); 
      // find the cell's corresponding plant in allPlants
      let seedID = findSeedID(i);
      let allPlantsID = findIndex(allPlants, seedID);

      for (let k = 0; k < grow.length; k++) {
         if (soilInfo[grow[k].id].nutri > 0 &&
            allPlants[allPlantsID].rootLen < allPlants[allPlantsID].maxRootLen) {
            soilInfo[grow[k].id].state = soilInfo[grow[k].id].state.concat(' root1');
            soilInfo[grow[k].id].nutri -= 1;
            // console.log('new root1: ' + grow[k].id);

            // update allPlants 
            allPlants[allPlantsID].rootLen += 1; 
            allPlants[allPlantsID].rootList.push(grow[k].id)
         }
      }
   }
}

function growPlant1Under(i) {
   // start growing plant from seed underground
   
   // find the corresponding plant in allPlants for seed index i 
   allPlantSeedID = findIndex(allPlants, i); 
   // look to see if cell directly above is occupied
   let aboveID = i - WIDTH;

   if (aboveID >= 0) {
      // find plant in allPlants
      let seedID = findSeedID(i)
      let plantID = findIndex(allPlants, seedID);

      let avg = avgPlant1SoilNutri(i); 
      let {allPlantsPos, avgPlantNutri} = avg

      // if i is a seed 
      if (soil[i].className.includes('seed1') &&
      allPlants[allPlantSeedID].rootLen > ROOT_LEN_FOR_PLANT &&
      !soil[aboveID].className.includes('ud_plant1') &&
      !soil[aboveID].className.includes('seed1') &&
      avgPlantNutri > LOW_NUTRI) {
         soilInfo[aboveID].state = soilInfo[aboveID].state.concat(' ud_plant1');
         soilInfo[aboveID].nutri -= 1;
         // console.log(`plant grown underground at ${aboveID}`)
         // update udPlantList
         allPlants[plantID].soilPlantList.push(aboveID);
      }
      // if i is a udPlant
      if (soil[i].className.includes('ud_plant1') &&
         !soil[aboveID].className.includes('ud_plant1') &&
         !soil[aboveID].className.includes('root1') &&
         !soil[aboveID].className.includes('seed1') &&
         avgPlantNutri > LOW_NUTRI) {
            soilInfo[aboveID].state = soilInfo[aboveID].state.concat(' ud_plant1');
            soilInfo[aboveID].nutri -= 1;
            // update udPlantList
            allPlants[plantID].soilPlantList.push(aboveID);
      }
   }
}



// ==================
// grow above ground
// ==================

function seed1Bud(i) {
   // if plant1 reaches the top of the soil, start growing a bud for plant1
   let diff = WIDTH * (SKY_HEIGHT - 1);   // or sky.length - WIDTH
   // diff = difference between first row of soil cell and last row of sky cell
   let x = coordX(sky[i]);
   let y = coordY(sky[i]);

   if (soil[i - diff].className.includes('ud_plant1') &&
   !plantInfo[x].state[y].includes('ab_plant1')) {
      let avg = avgPlant1SoilNutri(i-diff);
      let {allPlantsPos, avgPlantNutri} = avg;

      if (avgPlantNutri > LOW_NUTRI) {
         plantInfo[x].state[y] = plantInfo[x].state[y].concat(' ab_plant1');
         // let plantID = findSeedID(i-diff);
         // console.log(`soil id under bud: ${i-diff}`)
         // console.log(`plantID: ${plantID}`);
         // allPlants[plantID].skyPlantList.push(i);
         // console.log(i);
         // console.log(x);
         // console.log(y);
      }
   }
}

function growPlant1Above(i) {
   // if there's an existing bud and the plant's length < a plant's ideal length,
   // grow 1 stem cell 
   let top = i - WIDTH;
   let bot = i + WIDTH; 
   let x = coordX(sky[i]);
   let y = coordY(sky[i]);
   let plant1stem = plantInfo[x].state.filter(cell => cell.includes('ab_plant1'))

   // grow plant1
   if (sky[bot].className.includes('ab_plant1') &&
   !sky[top].className.includes('flower1') &&
   !sky[top].className.includes('water') &&
   plant1stem.length < plantInfo[x].len) {
      plantInfo[x].state[y] = 'sky ab_plant1';
   }
   // grow flower1 
   else if (sky[bot].className.includes('ab_plant1') &&
   !sky[top].className.includes('flower1') &&
   plant1stem.length == plantInfo[x].len) {
      plantInfo[x].state[SKY_HEIGHT - plant1stem.length - 1] = 'sky flower1';

      // once flower grows, change max root length to current root length
      let budID = plantInfo[x].id[SKY_HEIGHT-1];
      let diff = WIDTH * (SKY_HEIGHT - 1);
      let topSoilRootID = budID - diff; 
      let seedID = findSeedID(topSoilRootID);
      let plantID = findIndex(allPlants, seedID);
      allPlants[plantID].maxRootLen = plant1stem.length * ROOT_MULTIPLIER;
   }
}



// ============================
// nutri control / plant decay
// ============================


function reducePlant1Nutri(i) {
   // reduce the nutri level of plant1 
   if (soil[i].className.includes('seed1') ||
   soil[i].className.includes('ud_plant1') ||
   soil[i].className.includes('root1')) {
      // always reduce soil nutri every step 
      if (soilInfo[i].nutri > 0) soilInfo[i].nutri -= 1;
      // console.log(`soil cell ${i} nutrient lvl reduce by 1`)
   }
   if (soil[i].className.includes('seed1')) {
      // calculate the average nutri level of a plant's roots 
      // if it's below LOW_NUTRI, remove the end-most root 
      // and wilt flowers 
      // if root length is below x, start removing plant cells above ground 
      let avg = avgPlant1SoilNutri(i);
      let {allPlantsPos, avgPlantNutri} = avg;
      console.log(avgPlantNutri);

      if (avgPlantNutri < LOW_NUTRI) {
         // let plantX = coordX(soil[i]); 

         // look into allPlants to find last root index 
         // remove from allPlants.rootList and soilInfo
         // start wilting flower
         if (allPlants[allPlantsPos].rootList.length > 1) {    // so the seed won't be removed 
            let removedID = allPlants[allPlantsPos].rootList.pop();
            allPlants[allPlantsPos].rootLen -= 1;
            soilInfo[removedID].state = soilInfo[removedID].state.replace(' root1', '');
            // soilInfo[removedID].state = soilInfo[removedID].state.replace(' seed1', '');
            soil[removedID].className = soilInfo[removedID].state;
            // console.log(`removedID: ${removedID}`)
            console.log(`${allPlants[allPlantsPos].rootList}`);

            //if (plantInfo[plantX].state.includes('flower1')) {
               // wiltFlower1(plantX);
            //}
         }
      } 
   }
   // if soil cell runs out of nutrients

   /* 
   if (soilInfo[i].nutri <= 0) {
      let stotal = WIDTH * SOIL_HEIGHT;
      if (i < WIDTH) soilInfo[i].state = 'soil organic';
      else if (i >= WIDTH && i < stotal / 2 - WIDTH) soilInfo[i].state = 'soil topsoil';
      else if (i < stotal) soilInfo[i].state = 'soil subsoil';

      // remove cells from allPlants
      
      //allPlants[plantID].soilPlantList.pop();
   }
   */
   // let seedID = findSeedID(i);
   // let allPlantsPos = findIndex(allPlants, seedID); 
   // if length of root >= max root length 
}

function wiltFlower1(i) {
   // change flower1 to flower1_wilted if avg plant nutri lvl < LOW_NUTRI 
   let x = coordX(sky[i]);
   let y = coordY(sky[i]);
   let diff = WIDTH * (SKY_HEIGHT - 1);
   let budID = plantInfo[x].id[SKY_HEIGHT-1];
   let topSoilID = budID - diff;
   
   if (plantInfo[x].state[y] == "sky flower1") {
      let avg = avgPlant1SoilNutri(topSoilID);
      let {allPlantsPos, avgPlantNutri} = avg;

      // wilt flower
      if (avgPlantNutri < LOW_NUTRI) {
         plantInfo[x].state[y] = "sky flower1_wilted";
      }
      // renew flower
      else if (plantInfo[x].state[y] == "sky flower1_wilted" &&
      avgPlantNutri >= LOW_NUTRI &&
      plantInfo[x].state[y+1] == "sky ab_plant1") {
         plantInfo[x].state[y] = "sky flower1";
      }
   }
}


function wiltPlant1(i) {
   // change ab_plant1 to ab_plant1_wilted 
   // if avg plant nutri lvl < LOW_NUTRI 
   let x = coordX(sky[i]);
   let y = coordY(sky[i]);
   let diff = WIDTH * (SKY_HEIGHT - 1);
   let budID = plantInfo[x].id[SKY_HEIGHT-1];
   let topSoilID = budID - diff;

   // wilt stem
   if (plantInfo[x].state[y] == "sky ab_plant1") {
      let avg = avgPlant1SoilNutri(topSoilID);
      let {allPlantsPos, avgPlantNutri} = avg;

      if (avgPlantNutri < LOW_NUTRI &&
      plantInfo[x].state[y-1].includes("wilted")) {
         plantInfo[x].state[y] = "sky ab_plant1_wilted";
      }
   }
   // renew stem
   if (plantInfo[x].state[y] == "sky ab_plant1_wilted") {
      let avg = avgPlant1SoilNutri(topSoilID);
      let {allPlantsPos, avgPlantNutri} = avg;

      if (avgPlantNutri >= LOW_NUTRI &&
      plantInfo[x].state[y+1].includes("ab_plant1")) {
         plantInfo[x].state[y] = "sky ab_plant1";
         //console.log(`plantinfo ${x} state ${y} renewed`);
      }
   }
   
}

function wiltPlant1Bud(i) {
   // only search through bottom row of sky
   // change ab_plant1 to ab_plant1_wilted 
   // if avg plant nutri lvl < LOW_NUTRI 
   let x = coordX(sky[i]);
   let y = coordY(sky[i]);
   let diff = WIDTH * (SKY_HEIGHT - 1);
   let budID = plantInfo[x].id[SKY_HEIGHT-1];
   let topSoilID = budID - diff;

   // wilt bud
   if (plantInfo[x].state[y] == "sky ab_plant1") {
      let avg = avgPlant1SoilNutri(topSoilID);
      let {allPlantsPos, avgPlantNutri} = avg;

      if (avgPlantNutri < LOW_NUTRI &&
         plantInfo[x].state[y-1] == "sky ab_plant1_wilted") {
            plantInfo[x].state[y] = "sky ab_plant1_wilted"
         }
   }
   // renew bud 
   if (plantInfo[x].state[y] == "sky ab_plant1_wilted") {
      let avg = avgPlant1SoilNutri(topSoilID);
      let {allPlantsPos, avgPlantNutri} = avg;

      if (avgPlantNutri >= LOW_NUTRI) {
         plantInfo[x].state[y] = "sky ab_plant1";
      }
      /*
      // remove bud if nutri lvl low and there are no more plants on top
      if (avgPlantNutri < LOW_NUTRI &&
      plantInfo[x].state[y-1] == "sky") {
         plantInfo[x].state[y] == "sky";
      } */
   }
}

function plant1Gone(i) {
   let diff = WIDTH * (SKY_HEIGHT - 1);  // difference between first row of soil cell and last row of sky cell
   let x = coordX(sky[i]);
   let y = coordY(sky[i]);

   if (sky[i].className.includes('flower1_wilted')) {
      let budID = plantInfo[x].id[SKY_HEIGHT - 1];
      let topSoilID = budID - diff;
      let avg = avgPlant1SoilNutri(topSoilID);
      let {allPlantsPos, avgPlantNutri} = avg;

      let plantCells = plantInfo[x].state.filter(cell => cell.includes('plant'));
      let wiltedCells = plantInfo[x].state.filter(cell => cell.includes('wilted'));

      // if all plant cells are wilted and nutri lvl is low
      if (avgPlantNutri < LOW_NUTRI &&
      plantCells.length + 1 == wiltedCells.length) {
         for (let j = 0; j < SKY_HEIGHT; j++) {
            if (!plantInfo[x].state[j].includes('hose')){
               plantInfo[x].state[j] = 'sky';
            }
         }
      }
   }
}

function plant1UnderGone(i) {
   // after plant1 above soil is gone, remove entire plant

   if (soil[i].className.includes('seed1')) {
      // find x and link to sky
      let x = coordX(soil[i]);
      let plant = plantInfo[x].state.filter(cell => cell.includes('ab_plant1'));

      if (plant.length == 0) {
         let plantID = findIndex(allPlants, i);

         if (allPlants[plantID].soilPlantList.length > 0 &&
         allPlants[plantID].rootList.length == 1) {
            for (let j = 0; j < allPlants[plantID].soilPlantList.length; j++) {
               let udID = allPlants[plantID].soilPlantList[j];
               soilInfo[udID].state = soilInfo[udID].state.replace(' ud_plant1', '');
               soil[udID].className = soil[udID].className.replace(' ud_plant1', '');
            }
            soilInfo[i].state = soilInfo[i].state.replace(' seed1', '');
            soil[i].className = soil[i].className.replace(' seed1', '');
            allPlants.splice(plantID, 1);
         }
      }
   }
}



module.exports = {
   allPlants,
   // skyInfo,
   // loadSkyInfo,
   findIndex,
   toggleSeed1,
   findSeedID,
   growRoot1,
   growPlant1Under,
   growPlant1Above,
   seed1Bud,
   reducePlant1Nutri,
   wiltFlower1,
   wiltPlant1,
   wiltPlant1Bud,
   plant1Gone,
   plant1UnderGone
}



// figure out localhost 
// make everything slower by just increasing step size 
// design  
// figure out time thing 
