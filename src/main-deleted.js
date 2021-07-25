/* 
This is all the code from main.js that were later redistributed into separate,
smaller js files. I kept the code just in case redistribution didn't work out.
*/




/*
const WIDTH = 90;
const SKY_HEIGHT = 20;
const SOIL_HEIGHT = 60;
const HEIGHT = SKY_HEIGHT + SOIL_HEIGHT;
*/

/*
const MYCOR_NUM = 10;   
const MYCOR_RADIUS = 5;
const MYCOR_MIN_RADIUS = 1;

let soil = [];
let soilInfo = [];
*/

/*
let sky = []; 
// let skyInfo = [];

let plantInfo = []; 

let mycorInfo = [];

// const frame = document.querySelector('.frame');
*/




/*
class soilCell {
   constructor(state, nutri, id, organism) {
      this.state = state;  // soil, h_root, v_root
      this.nutri = nutri;  // nutrient level in specific soil cell
      this.id = id;        // soil id
      this.organism = organism;    // any organism populating the cell
   }
}

class plant {
   constructor(len, state, id) {
      this.len = len;      //the length that the stem should be
      this.state = state;  // divides sky into vertical strips
      this.id = id;        // the index of the plant cell in the sky grid 
   }
}

class mycor {
   constructor(vel, separation, radius, id) {
      this.vel = vel;
      this.separation = separation;
      this.radius = radius;
      this.id = id;
   }
   // video 12:56+ -- for coding average velocity / where boid goes next
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









function createSoil() {
   let stotal = WIDTH * SOIL_HEIGHT;
   for(let i=0; i < stotal; i++) {
      const cell = document.createElement('div');
      cell.classList.add("soil");
      cell.setAttribute('id',i);
      frame.appendChild(cell);
      soil.push(cell);
   }
   for (let i = 0; i < WIDTH; i++) {
      soil[i].classList.add("organic");
   }
   for (let i = WIDTH; i < stotal / 2 - WIDTH; i++){
      soil[i].classList.add("topsoil");
   }
   for (let i = stotal / 2 - WIDTH; i < stotal; i++) {
      soil[i].classList.add("subsoil");
   }
}

function loadSoilInfo() {
   for (let i = 0; i < WIDTH; i++) {
      soilInfo.push(new soilCell(
         soil[i].className, Math.floor(Math.random() * (8-4) + 4), i));
   }
   for (let i = WIDTH; i < soil.length / 2 - WIDTH; i++) {
      soilInfo.push(new soilCell(
         soil[i].className, Math.floor(Math.random() * (8-4) + 4), i));
   }
   for (let i = soil.length / 2 - WIDTH; i < soil.length; i++) {
      soilInfo.push(new soilCell(
         soil[i].className, Math.floor(Math.random() * (8-4) + 4), i));
   }
} 


function createMycor() {
   // store all mycor in mycorInfo and populate soil randomly with micorrhizal fungi
   for (let num = 0; num < MYCOR_NUM; num++) {
      let velX = Math.round(Math.random() * 2.0 - 1.0);
      let velY = Math.round(Math.random() * 2.0 - 1.0);
      let vel = [velX, velY];
      let randIndex = Math.floor(Math.random() * (soil.length-WIDTH) + WIDTH);

      if (velX == 0 && velY == 0) { vel[Math.floor(Math.random() * 2)] = 1; }

      mycorInfo.push(new mycor(vel, 1.0, 5.0, randIndex))
      soil[randIndex].className = soil[randIndex].className.concat(' mycor');
      soilInfo[randIndex].organism = mycorInfo[mycorInfo.length - 1];
   }
}


/*
function populateMycor() {
   // populate soil randomly with micorrhizal fungi 
   for (let i = 0; i < 10; i++) {
      let randI = Math.floor(Math.random() * (soil.length-WIDTH) + WIDTH);
      soil[randI].className = soil[randI].className.concat(' mycor');
   }
}
*/


/*
function loadSoilInfo() {
   // load same soil nutrients
   for (let i = 0; i < WIDTH; i++) {
      soilInfo.push(new soilCell(
         soil[i].className, 5, i));
   }
   for (let i = WIDTH; i < soil.length / 2 - WIDTH; i++) {
      soilInfo.push(new soilCell(
         soil[i].className, 5, i));
   }
   for (let i = soil.length / 2 - WIDTH; i < soil.length; i++) {
      soilInfo.push(new soilCell(
         soil[i].className, 5, i));
   }
} */



/*
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






function toggleHRoot(cell) {
   // click to make horizontal root,
   // reduce soil nutri level by 1
   cell.addEventListener('click', () => {
      cell.classList.toggle('h_root');
      soilInfo[cell.id].state = cell.className;
      soilInfo[cell.id].nutri -= 1;
      console.log(cell);
   });
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







function toggleVRoot(cell) {
   // double click to make vertical root,
   // reduce soil nutri level by 1
   cell.addEventListener('dblclick', () => {
      cell.classList.toggle('v_root');
      soilInfo[cell.id].state = cell.className;
      soilInfo[cell.id].nutri -= .5;
      console.log(cell);
   })
}









// =======================
// index to coord helpers
// =======================

function coordY(cell) {
   // return the Y position of a cell based on its id
   let y;
   let id = Number(cell.id);
   for (i=0; i<HEIGHT + 1; i++) {
      if (id < i * WIDTH && id >= (i-1) * WIDTH) {
         y = i-1;
      }
   }
   if (y === undefined) { // why is 'undefined' returned instead of 0?
      y = 0;
   } 
   return y
}

function coordX(cell) {
   // return the X position of a cell based on its id
   let x;
   let id = Number(cell.id);
   if (coordY(cell) == 0) {
      x = id;
   } else if (coordY(cell) > 0) {
      x = id - WIDTH * coordY(cell);
   }
   if (x == undefined) {
      return 0;
   }
   else { return x; }
}

function coordToIndex(lst) {
   // given an array of [x,y] coordinates from a 2-D list,
   // return the associated index value in its 1-D list
   return lst[1] * WIDTH + lst[0]
}












// ====================
// grow roots and fungi
// ====================

function hypotenuse(x, y) {
   return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}


function mostNutri(lst) {
   // given an array of soilCells, return [cell] with most nutri lvl 
   // if multiple items in array have the same nutri value, and the cells
   // are not next to each other, return both in the same array 
   let l = lst;
   // check lst length is 3
   if (l.length === 1) return l;

   if (l[0].nutri < l[1].nutri) { l.splice(0,1); }
   else { l.splice(1,1); }

   if (l.length === 2 && l[0].nutri == l[1].nutri) {
      if (l[0].id == (l[1].id - 45) || l[0].id == (l[1].id - 1)) {
         l.splice(1,1); }
      else { return l; }
   }

   return mostNutri(l)
}

function arrIncludes(arr, str) {
   // checks if any strings in an array of strings includes the given str
   let a = arr;

   if (a.length > 1 && !a[0].includes(str)) { a.splice(0,1); }
   else {return a[0].includes(str)}

   return arrIncludes(a, str)
}

function arrClassIncludes (arr, str) {
   // checks of an array of objects (classes) includes the given str
   //let a = arr;
   let next = [];

   if (arr.length > 1 && !arr[0].state.includes(str)) { next = arr.slice(1); }
   else { return arr[0].state.includes(str) }

   return arrClassIncludes(next, str)
}




/*
function mycorNeighbours(cell) {
   // return an array of [soilCell] of a mycor cell's neighbours
   let n = [];
   let x = coordX(cell);
   let y = coordY(cell);
   
   for (dx = -3; dx < 4; dx++) {
      for (dy = -3; dy < 4; dy++) {
         let nx = (x + dx + WIDTH) % WIDTH;
         let ny = (y + dy + HEIGHT) % HEIGHT;
         n.push(soilInfo[coordToIndex([nx, ny])]);
      }
   }
   n.splice(24,1);
   return n;
}

function immediateNeighbours(cell) {
   // return an array of [soilCell] of a cell's 8 immediate neighbours
   let n = [];
   let x = coordX(cell);
   let y = coordY(cell);

   for (dx = -1; dx < 2; dx++) {
      for (dy = -1; dy < 2; dy++) {
         let nx = (x + dx + WIDTH) % WIDTH;
         let ny = (y + dy + HEIGHT) % HEIGHT;
         n.push(soilInfo[coordToIndex([nx, ny])]);
      }
   }
   n.splice(4,1);
   return n
}
*/

/*
function rootVel(ogCell, relCell) {
   // returns the location ('velocity') of relCell relative to ogCell
   let ogX = coordX(ogCell);
   let ogY = coordY(ogCell);
   let relX = coordX(relCell);
   let relY = coordY(relCell);
   let vel = [0,0];

   if (ogX > relX) { vel[0] = -1; }
   else if (ogX < relX) { vel[0] = 1; }
   
   if (ogY > relY) { vel[1] = -1; }
   else if (ogY < relY) { vel[1] = 1; }

   // console.log(`cell ${ogCell.id} needs to go in direction 
   // ${vel} to get to cell ${relCell.id}`);
   return vel
}


function mycorNeighbours(cell) {
   // pass in soil[i] to get a mycor's next position and velocity 
   // based on its neighbours
   let nCount = 0;
   let x = coordX(cell);
   let y = coordY(cell);
   let avgPos = [0, 0];
   let avgVel = [0, 0];
   let radius = soilInfo[cell.id].organism.radius;
   // let avoid = [x,y];
   // let avoidDir = [];

   for (dx = -radius; dx <= radius; dx++) {
      for (dy = -radius; dy <= radius; dy++) {
         let nx = (x + dx + WIDTH) % WIDTH;
         let ny = (y + dy + SOIL_HEIGHT) % SOIL_HEIGHT;
         let nID = coordToIndex([nx, ny]);
         
         if (soil[nID].className.includes('mycor')) {
            let nVel = soilInfo[nID].organism.vel;

            avgPos[0] += nx;
            avgPos[1] += ny;
            avgVel[0] += nVel[0];
            avgVel[1] += nVel[1];
            nCount += 1;
         }
         else if (soil[nID].className.includes('h_root') ||
         soil[nID].className.includes('v_root')) {
            // make it so mycor follows root growth direction more
            let posMultiplier = 2;
            let velMultiplier = 2;
            avgPos[0] += (nx * posMultiplier);
            avgPos[1] += (ny * posMultiplier);
            // return relative location of root to mycor
            let rVel = rootVel(cell, soil[nID]);
            avgVel[0] += (rVel[0] * velMultiplier);
            avgVel[1] += (rVel[1] * velMultiplier);
            nCount += 1;
         }

         // console.log(`mycorNeighbour ID: ${nID}`);
      }
   }
   // average and round the positions and velocities 
   avgPos[0] = (nCount > 0)? Math.round(avgPos[0] / nCount) : 0;
   avgPos[1] = (nCount > 0)? Math.round(avgPos[1] / nCount) : 0;

   
   let avgPosLen = hypotenuse(avgPos[0], avgPos[1]);
   if (avgPosLen > 0) {
      avgPos[0] = Math.round(avgPos[0] / avgPosLen);
      avgPos[1] = Math.round(avgPos[1] / avgPosLen);
   }
   
   /*
   avgVel[0] = (nCount > 0) ? Math.min(1, Math.max(-1, Math.round(avgVel[0] / nCount))) : 0;
   avgVel[1] = (nCount > 0) ? Math.min(1, Math.max(-1, Math.round(avgVel[1] / nCount))) : 0;
   */
  /*
   avgVel[0] = (nCount > 0) ? Math.round(avgVel[0] / nCount) : 0;
   avgVel[1] = (nCount > 0) ? Math.round(avgVel[1] / nCount) : 0;

   // probably need to add separation in there 
   // to prevent multiples of the same index in mycorInfo!!!!!!!

   console.log(`mycorNeighbour avgPos: ${avgPos}, avgVel: ${avgVel}`);

   return {
      pos: avgPos,
      vel: avgVel
   };
}




function growMycor(i) {
   // THIS WORKS BUT LOOK INTO IT MORE -- mycor maybe not growing the way you want 
   // ALSO DON'T GROW IF H_ROOT OR V_ROOT IS PRESENT 
   // also why does mycorInfo have repeating mycors ?? 
   let data = require('./mycor-params.js');
   let {O_COEFF, A_COEFF, C_COEFF, S_COEFF, R_COEFF} = data;

   let n = mycorNeighbours(soil[i]); 
   let x = coordX(soil[i]);
   let y = coordY(soil[i]);

   let newVel = soilInfo[i].organism.vel;
   let randAdjustment = [
      Math.round(Math.random() * 2.0 - 1.0),
      Math.round(Math.random() * 2.0 - 1.0)
   ];

   newVel[0] = n.vel[0]; + n.pos[0] * 0.1;
   newVel[1] = n.vel[1]; + n.pos[1] * 0.1;

   /*
   newVel[0] = 
      O_COEFF * newVel[0] +
      A_COEFF * n.vel[0] +
      C_COEFF * n.pos[0] +
      R_COEFF * randAdjustment[0];

   newVel[1] = 
      O_COEFF * newVel[1] +
      A_COEFF * n.vel[1] +
      C_COEFF * n.pos[1] +
      R_COEFF * randAdjustment[1];
   */

   /*
   let newVelLen = hypotenuse(newVel[0], newVel[1]);

   if (newVelLen > 0) {
      newVel[0] = Math.round(newVel[0] / newVelLen);
      newVel[1] = Math.round(newVel[1] / newVelLen);
   }
   
   

   let nx = (x + newVel[0] + WIDTH) % WIDTH;
   let ny = (y + newVel[1] + SOIL_HEIGHT) % SOIL_HEIGHT;
   let newMycorID = coordToIndex([nx, ny]);

   if (!soil[newMycorID].className.includes('mycor') &&
       !soil[newMycorID].className.includes('h_root') &&
       !soil[newMycorID].className.includes('v_root')) {
      let newMycor = new mycor(newVel, 1, MYCOR_RADIUS, newMycorID);
   
      soilInfo[newMycorID].organism = newMycor;
      
      mycorInfo.push(newMycor);

      // console.log(`nx: ${nx}, ny: ${ny}`);
      console.log(`growMycor newVel: ${newVel}`);
      console.log(`newMycorID: ${newMycorID}, prev cell: ${i}`);
   }

   

   // if the same ID already exists in mycorInfo, replace that one with newMycor 

   /*
   mycorInfo.forEach(function(mycor) 
      { if (mycor.id !== newMycorID) mycorInfo.push(newMycor); })
      */

   /*for (let i = 0; i < mycorInfo.length; i++) {
      if (mycorInfo[i].id == newMycorID) { mycorInfo[i] = newMycor; }
      else { mycorInfo.push(newMycor); }
   } */
   
   
   /*
   if (arrClassIncludes(n, 'h_root') || arrClassIncludes(n, 'v_root') ||
   arrClassIncludes(n, 'mycor')) {
      // if mycor neighbours include roots or other mycors, 
      // grow towards their average
      targets = n.filter(cell => cell.state.includes('mycor'));
      targets = targets.concat(n.filter(cell => cell.state.includes('v_root')));
      targets = targets.concat(n.filter(cell => cell.state.includes('h_root')));

   }
   */ /*
}



function cleanMycorInfo() {
   let unique = []
   let uniqueID = []

   mycorInfo.forEach((mycor) => {
      if (!uniqueID.includes(mycor.id)) {
         unique.push(mycor);
         uniqueID.push(mycor.id);
      }
   })
   mycorInfo = unique;
}



function vNeighbours(cell) {
   // return an array [soilCell] of a soil cell's vertical neighbours 
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

function growVRoot(i) {
   // turn 1 or 2 cells below an existing v_root into a v_root every iteration
   // the cell with the highest nutri lvl will be turned into a v_root 
   // if two cells have the same high nutri lvl and the two cells are not 
   // together, v_root will grow on both cells 
   let nb = vNeighbours(soil[i]);
   let nbState = [];

   // filter out mycor cells
   // nb = nb.filter(cell => !cell.className.includes('mycor'));

   for (let j = 0; j < nb.length; j++) {
      nbState.push(nb[j].state);
   }

   // if bottom neighbours not occupied, grow 
   if (!arrIncludes(nbState, 'v_root') && !arrIncludes(nbState, 'mycor')) {
      // choose cell with largest soil nutri value to grow into 
      let grow = mostNutri(nb); 

      for (let k = 0; k < grow.length; k++) {
         if (soilInfo[grow[k].id].state.includes('h_root')) { growHVRoot(grow[k].id) }
         else {
            soilInfo[grow[k].id].state = soilInfo[grow[k].id].state.concat(' v_root');
            soilInfo[grow[k].id].nutri -= 1;
            console.log('new v_root: ' + grow[k].id);
         }
      }
   }
}

function hNeighbours(cell, dir) {
   // return an array [soilCell] of a soil cell's horizontal neighbours 
   let x = coordX(cell);
   let y = coordY(cell);
   let n = [];

   for (let dx = -1; dx < 2; dx += 2) {
      for (let dy = -1; dy < 2; dy++) {
         let nx = (x + dx + WIDTH) % WIDTH;
         let ny = (y + dy + SOIL_HEIGHT) % SOIL_HEIGHT;

         n.push(soilInfo[coordToIndex([nx,ny])]);
      }
   }
   // remove some cells from array according to 'dir'
   if (dir == 'both') {
      return n;
   } else if (dir == 'l') {
      return n.splice(0,3);
   } else if (dir == 'r') {
      return n.splice(3);
   } else {
      return 'hNeighbours invalid cell direction'
   }
}

function growHRoot(i) {
   // make root grow horizontally on both sides by 1 cell every iteration
   // root finds the soil cell with largest nutri level to grow into
   // if two cells have the same nutri lvl, grow into both 
   // if root reaches top of soil, grow stem
   let nb = hNeighbours(soil[i], 'both');
   let lnb = nb.slice(0,3);
   let rnb = nb.slice(3);
   let nbState = [];
   // let nbID = [];

   for (let j = 0; j < nb.length; j++) {
      nbState.push(nb[j].state);
      // nbID.push(nb[j].id);
   }

   let lnbState = nbState.slice(0,3);
   let rnbState = nbState.slice(3);

   // case 1: lone cell, grow on both left and right neighbours
   if (!arrIncludes(nbState, 'h_root') && !arrIncludes(nbState, 'mycor')) {
      let growL = mostNutri(lnb);
      let growR = mostNutri(rnb); 

      for (let k = 0; k < growL.length; k++) {
         if (soilInfo[growL[k].id].state.includes('h_root')) { growHVRoot(growL[k].id) }
         else {
            soilInfo[growL[k].id].state = soilInfo[growL[k].id].state.concat(' h_root');
            soilInfo[growL[k].id].nutri -= 1;
            // console.log('new h_root: ' + growL[k].id);
         }
      }
      for (let k = 0; k < growR.length; k++) {
         if (soilInfo[growR[k].id].state.includes('h_root')) { growHVRoot(growR[k].id) }
         else {
            soilInfo[growR[k].id].state = soilInfo[growR[k].id].state.concat(' h_root');
            soilInfo[growR[k].id].nutri -= 1;
            // console.log('new h_root: ' + growR[k].id);
         }
      }
   }
   // case 2: if cell is the left end of the root, grow on left neighbours only
   else if (!arrIncludes(lnbState, 'h_root') && !arrIncludes(lnbState, 'mycor')) {
      let grow = mostNutri(lnb);

      for (let k = 0; k < grow.length; k++) {
         if (soilInfo[grow[k].id].state.includes('h_root')) { growHVRoot(grow[k].id) }
         else {
            soilInfo[grow[k].id].state = soilInfo[grow[k].id].state.concat(' h_root');
            soilInfo[grow[k].id].nutri -= 1;
            // console.log('new h_root: ' + grow[k].id);
         }
      }
   } 
   // case 3: if cell is on right end of root, grow on right neighbours only
   else if (!arrIncludes(rnbState, 'h_root') && !arrIncludes(rnbState, 'mycor')) {
      let grow = mostNutri(rnb);

      for (let k = 0; k < grow.length; k++) {
         if (soilInfo[grow[k].id].state.includes('h_root')) { growHVRoot(grow[k].id) }
         else {
            soilInfo[grow[k].id].state = soilInfo[grow[k].id].state.concat(' h_root');
            soilInfo[grow[k].id].nutri -= 1;
            // console.log('new h_root: ' + grow[k].id);
         }
      }
   } 
}



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
      console.log(i);
      console.log(x);
      console.log(y);
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


// figure out collision between h_root and v_root

function growHVRoot(i) {
   soilInfo[i].state = 'soil hv_root';
   soilInfo[i].nutri -= 3;
}



function growHVPlant(i) {
   // when a horizontal root intersects with a vertical root, start growing plant
}



// function updateSoilNutri()
// reduce soil nutri of occupied soil cells by 1 every step

*/