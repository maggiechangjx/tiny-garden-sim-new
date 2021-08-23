// button effects when clicked for restart and garden info 
import "./style/main.css";


let allInfo = document.getElementById('info');
let allInfoChildren = allInfo.children;
const infoPage = document.getElementById('all_info');


function initInfo() {
   // create initial info page that will be shown when browser first opens
   // hide all info pages except info1 
   allInfoChildren[0].classname = "info1";
   for (let i = 1; i < allInfoChildren.length; i++) {
      allInfoChildren[i].className = "info" + i + "_hide"
      // console.log(allInfoChildren[i].className);
   }

}

function cycleInfo() {
   // cycle through info 1-7 

   let currentInfo = 0;

   for (let i = 0; i < allInfoChildren.length; i++) {
      if (!allInfoChildren[i].className.includes('hide')) {
         currentInfo = allInfoChildren[i].className;
      }
   }
   // if cycleInfo was previous used, "refresh it"
   if (currentInfo == 0) {
      allInfoChildren[0].className = 'info1';
      currentInfo = allInfoChildren[0].className;
      infoPage.id = "all_info";
   }

   let nextInfoID = Number(currentInfo.replace('info',''));
   let infoID = Number(currentInfo.replace('info','')) - 1;

   let infoName = infoID + 1;
   let nextInfoName = nextInfoID + 1;

   // flip to next info 
   if (nextInfoName <= allInfoChildren.length) {
      allInfoChildren[infoID].className = 'info' + infoName.toString() + '_hide';
      allInfoChildren[nextInfoID].className = 'info' + nextInfoName.toString();
   }
   // at the end of the slide, turn cycle off
   else if (nextInfoName > allInfoChildren.length) {
      allInfoChildren[infoID].className = 'info' + infoName.toString() + '_hide';
      infoPage.id = "all_info_hide"
      // console.log('info cycle ends');
   }
  // console.log(`current: ${infoID}, ${allInfoChildren[infoID].className}`);
  // console.log(nextInfoID);
  // console.log(currentInfo);
}

function revealRestart() {
   // click on soil cover enough times to reveal restart button
}



module.exports = {
   infoPage,
   allInfo,
   allInfoChildren,
   initInfo,
   cycleInfo   
}