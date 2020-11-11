// Obtained base code from W3 Schools Full Page Tab Website then modified as needed (https://www.w3schools.com/howto/howto_js_full_page_tabs.asp)

// login state
function openPage(pageName, elmnt, color) {
  firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser){
      var i, tabcontent, tablinks;
      tabcontent = document.getElementsByClassName("tabcontent");
      for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
      }
    
      // Remove the background color of all tablinks/buttons
      tablinks = document.getElementsByClassName("tablink");
      for (i = 0; i < tablinks.length; i++) {
        tablinks[i].style.backgroundColor = "";
      }
    
      // Show the specific tab content
      document.getElementById(pageName).style.display = "block";
    
      // Add the specific color to the button used to open the tab content
      elmnt.style.backgroundColor = color;
    }
    else{
      console.log('User is not logged in');
      var i, tabcontent, tablinks;
      tabcontent = document.getElementsByClassName("tabcontent");
      for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
      }
      document.getElementById("Home").style.display = "block";
    }
  });
}