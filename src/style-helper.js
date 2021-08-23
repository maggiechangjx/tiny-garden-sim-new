// kind of generalized function(s) to style elements on page
import "./style/main.css";

function toggleBtnOnOff(element) {
   // button changes color when clicked
   if (element.className !== 'toggled') {
      element.className = 'toggled'
   }
   else { element.className = ''; }
}


function fadeElem(elem, duration, finalOpacity) {
   // fade an html element on screen 
   // duration in miliseconds - int
   // finalOpacity - string
   let start = new Date; 
   (function next() {
      let time = new Date - start;
      if (time < duration) {
         elem.style.opacity = 1 - time/duration;
         requestAnimationFrame(next);
      } 
      else {
         elem.style.opacity = finalOpacity;
      }
   })();
}



module.exports = {
   toggleBtnOnOff,
   fadeElem
}