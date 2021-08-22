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
   mostNutri,
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
   LOWEST_STARTING_NUTRI,    // lowest nutri value to be distributed to soil cells 
   LOW_NUTRI,                 // indicating soil has low nutri 
   MAX_NUTRI,                // highest nutri value to be initially distributed 
} = worldParams;

let nutriGrid = require('./nutri-grid.js');
let {
   nutriFrame,
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
   waterBtn
} = hoseActivities;

let styling = require('./style-helper.js');
let {
   toggleBtnOnOff
} = styling;




let plant1 = require('./single-seed.js');
let {
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
} = plant1;

   /*
   localStorage.setItem('soil', soil);
   localStorage.setItem('soilInfo', soilInfo);
   localStorage.setItem('mycorInfo', mycorInfo);

   localStorage.setItem('sky', sky);
   localStorage.setItem('plantInfo', plantInfo);

   localStorage.setItem('soilNutri', soilNutri);
   localStorage.setItem('soilNutriRec', soilNutriRec);

   localStorage.setItem('allPlants', allPlants);

   localStorage.setItem('totalStep', totalStep);
   

/*
localStorage.setItem('soil', JSON.stringify(soil));
localStorage.setItem('soilInfo', JSON.stringify(soilInfo));
localStorage.setItem('mycorInfo', JSON.stringify(mycorInfo));

localStorage.setItem('sky', JSON.stringify(sky));
localStorage.setItem('plantInfo', JSON.stringify(plantInfo));

localStorage.setItem('soilNutri', JSON.stringify(soilNutri));
localStorage.setItem('soilNutriRec', JSON.stringify(soilNutriRec));

localStorage.setItem('allPlants', JSON.stringify(allPlants));

localStorage.setItem('totalStep', totalStep);
*/

//soil = JSON.parse(localStorage.getItem('soil'))


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

const hSeedBtn = document.getElementById('h_seed_btn');
const vSeedBtn = document.getElementById('v_seed_btn');
const nutriBtn = document.getElementById('nutri');

const singleSeedBtn = document.getElementById('single_seed_btn');




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


      if (soil[i].className.includes('seed1') ||
      soil[i].className.includes('ud_plant1')) { growPlant1Under(i); }

      if (soil[i].className.includes('seed1') || 
      soil[i].className.includes('root1')) { growRoot1(i); }
      // else { continue }
      reduceNutrient(i);
      reducePlant1Nutri(i);
      plant1UnderGone(i);
   }

   // iterate through sky cells and grow buds and plants   
   // and drop water if hose is turned on 
   // why do I have 3 for loops here again??? 
   for (let k = sky.length - WIDTH - 1; k > 0; k--) {
      growPlants(k);
      growPlant1Above(k);
      waterFlow(k);
   } 
   for (let j = sky.length - WIDTH; j < sky.length; j++) {
      growBud(j);
      seed1Bud(j);
      wiltPlant1Bud(j);
      waterFlow(j);
   }
   for (let l = 0; l < sky.length - WIDTH; l++) {
      wiltFlower(l);
      wiltPlant(l);
      plantGone(l);

      wiltFlower1(l);
      wiltPlant1(l);
      plant1Gone(l);
   }

   // water in nutri grid
   if (waterBtn.className == 'toggled') { waterOn(); }  // the hose takes a while to turn off
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
   
   // localStorage.setItem('soil', JSON.stringify(soil));
   localStorage.setItem('soilInfo', JSON.stringify(soilInfo));
   localStorage.setItem('mycorInfo', JSON.stringify(mycorInfo));

   // localStorage.setItem('sky', JSON.stringify(sky));
   localStorage.setItem('plantInfo', JSON.stringify(plantInfo));

   localStorage.setItem('soilNutri', JSON.stringify(soilNutri));
   localStorage.setItem('soilNutriRec', JSON.stringify(soilNutriRec));

   localStorage.setItem('allPlants', JSON.stringify(allPlants));

   localStorage.setItem('totalStep', totalStep);
}

 
function restart() {
   localStorage.clear();

   totalStep = 0;
   
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
   
   // updates for nutri grid
   for (let i = 0; i < WIDTH*SOIL_HEIGHT; i++) {
       soilNutriRec[i] = "soil-nutri nutri_soil";
       soilNutri[i].className = "soil-nutri nutri_soil";

      if (soilInfo[i].nutri < LOW_NUTRI &&
      !soilNutriRec[i].includes('low-nutri')) {
         soilNutri[i].className = soilNutri[i].className.concat(' low-nutri');
         soilNutriRec[i]= soilNutriRec[i].concat(' low-nutri');
      }
      if (soilInfo[i].nutri >= LOW_NUTRI && 
      soilInfo[i].nutri < LOWEST_STARTING_NUTRI + 2 &&
      !soilNutriRec[i].includes('med-nutri')) {
         soilNutriRec[i] = soilNutriRec[i].concat(' med-nutri');
         soilNutri[i].className = soilNutri[i].className.concat(' med-nutri');
      }
      if (soilInfo[i].nutri > MAX_NUTRI) {
         soilNutriRec[i] = soilNutriRec[i].replace('low-nutri', '');
         soilNutriRec[i] = soilNutriRec[i].replace('med-nutri', '');
         soilNutri[i] = soilNutri[i].replace('low-nutri', '');
         soilNutri[i] = soilNutri[i].replace('med-nutri', '');
      }
      if (soilInfo[i].nutri <= 0 &&
      !soilNutriRec[i].includes('dead-nutri')) {
         soilNutriRec[i] = soilNutriRec[i].concat(' dead-nutri');
         soilNutri[i].className = soilNutri[i].className.concat(' dead-nutri');
      }
    }

   allPlants = [];
}




// =============
// initiate sim
// =============

createSky();
createSoil();
// loadSkyInfo();
loadSoilInfo();
loadPlantInfo();

createMycor();

createSoilNutri();
updateNutriRec();

// update soilNutri
for (let i = 0; i < soil.length; i++) {
   soilNutri[i].className = soilNutriRec[i];
}

// click on a sky cell to turn it to h plant / v plant / hose 
/* sky.forEach((cell) => { toggleHose(cell) }); */

/*
sky.forEach((cell) => { toggleHPlant(cell)});
sky.forEach((cell) => { toggleVPlant(cell) });
*/


//// localStorage.setItem('soil', JSON.stringify(soil));
// localStorage.setItem('soilInfo', JSON.stringify(soilInfo));
// localStorage.setItem('mycorInfo', JSON.stringify(mycorInfo));

//// localStorage.setItem('sky', JSON.stringify(sky));
// localStorage.setItem('plantInfo', JSON.stringify(plantInfo));

//// localStorage.setItem('soilNutri', JSON.stringify(soilNutri));
// localStorage.setItem('soilNutriRec', JSON.stringify(soilNutriRec));

// localStorage.setItem('allPlants', JSON.stringify(allPlants));

// localStorage.setItem('totalStep', totalStep);


/*
// localStorage.setItem('soil', soil);
localStorage.setItem('soilInfo', soilInfo);
localStorage.setItem('mycorInfo', mycorInfo);

localStorage.setItem('sky', sky);
localStorage.setItem('plantInfo', plantInfo);

localStorage.setItem('soilNutri', soilNutri);
localStorage.setItem('soilNutriRec', soilNutriRec);

localStorage.setItem('allPlants', allPlants);

localStorage.setItem('totalStep', totalStep);
*/

// soil = localStorage.getItem('soil');
// soil = JSON.parse(localStorage.getItem('soil'));

/*
soilInfo = JSON.parse(localStorage.getItem('soilInfo'));
mycorInfo = JSON.parse(localStorage.getItem('mycorInfo'));

plantInfo = JSON.parse(localStorage.getItem('plantInfo'));

soilNutri = JSON.parse(localStorage.getItem('soilNutri'));
soilNutriRec = JSON.parse(localStorage.getItem('soilNutriRec'));

allPlants = JSON.parse(localStorage.getItem('allPlants'));

totalStep = JSON.parse(localStorage.getItem('totalStep'));
*/

// ===========================
// assign functions to buttons
// ===========================


hSeedBtn.addEventListener('click', function() {
   soil.forEach((cell) => { toggleHRoot(cell) });
   toggleBtnOnOff(hSeedBtn);
});

vSeedBtn.addEventListener('click', function() {
   soil.forEach((cell) => { toggleVRoot(cell) });
   toggleBtnOnOff(vSeedBtn);
});


nutriBtn.addEventListener('click', function() {
   showNutri();
   toggleBtnOnOff(nutriBtn);
});



singleSeedBtn.addEventListener('click', function() {
   soil.forEach((cell) => { toggleSeed1(cell) });
   toggleBtnOnOff(singleSeedBtn);
});





playBtn.addEventListener('click', function() {
   timer = setInterval(step, 300); });
   // need to prevent player from executing 'play' more than once 

pauseBtn.addEventListener('click', function() {clearInterval(timer);});

nextBtn.addEventListener('click', step);

reBtn.addEventListener('click', function() {
   clearInterval(timer);
   restart();
});

//reBtn.addEventListener('click', restart);







//waterBtn2.addEventListener('click', getSpigots);

//waterBtn1.addEventListener('change', getSpigots); 
//getSpigots()



// would be nice if game automatically starts after the first seed is planted 