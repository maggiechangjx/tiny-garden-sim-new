import "./style/main.css";

module.exports = {
   WIDTH: 90,
   SKY_HEIGHT: 20,
   SOIL_HEIGHT: 60,
   HEIGHT: 80,
   LOWEST_STARTING_NUTRI: 25,    // lowest nutri value to be distributed to soil cells 
   LOW_NUTRI: 6,                 // indicating soil has low nutri 
   MAX_NUTRI: 32,                // highest nutri value to be initially distributed 
   FLOOD_THRESHOLD: 60,
   WATER_NUTRI_VAL: 20,          // amount of nutrients a drop of water can deliver
   ROOT_LEN_FOR_PLANT: 10,       // how much root1 must grow before plant starts sprouting 
   MAX_ROOT_LEN: 200,             // maximum length that a root can grow (init max value)
   ROOT_MULTIPLIER: 8,           // multiply by stem length to figure out max root growth
   frame: document.querySelector('.frame')
};


// keeping the difference between LOWEST STARTING NUTRI and MAXI NUETRI at 7 
// results in prettily growing roots c: