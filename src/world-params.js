import "./style/main.css";

module.exports = {
   WIDTH: 90,
   SKY_HEIGHT: 20,
   SOIL_HEIGHT: 60,
   HEIGHT: 80,
   LOWEST_STARTING_NUTRI: 15,    // lowest nutri value to be distributed to soil cells 
   LOW_NUTRI: 6,  // indicating soil has low nutri 
   MAX_NUTRI: 30,
   FLOOD_THRESHOLD: 60,
   frame: document.querySelector('.frame')
};