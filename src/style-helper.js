// kind of generalized function(s) to style elements on page


function toggleBtnOnOff(element) {
   // button changes color when clicked
   if (element.className !== 'toggled') {
      element.className = 'toggled'
   }
   else { element.className = ''; }
}


module.exports = {
   toggleBtnOnOff
}