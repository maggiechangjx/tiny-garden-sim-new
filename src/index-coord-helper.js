// relates cell indices to x, y positions 

let world = require('./world-params.js');
let {WIDTH, SOIL_HEIGHT, HEIGHT, frame} = world;


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
   if (x == undefined) { return 0; }
   else { return x; }
}

function coordToIndex(lst) {
   // given an array of [x,y] coordinates from a 2-D list,
   // return the associated index value in its 1-D list
   return lst[1] * WIDTH + lst[0]
}

/*
module.export = {
   coordY, 
   coordX, 
   coordToIndex
}
*/

export {
   coordY,
   coordX,
   coordToIndex
}