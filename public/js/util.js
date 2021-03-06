function getCookie(cname) {
    var name = cname + ":";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
          console.log('found cookie! ' + c.substring(name.length, c.length))
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

// Function to hide the loading Spinner
function hideSpinner(elementName) {
  if (document.getElementById(elementName)) {
    document.getElementById(elementName).style.display = "none";
  }
  
}

var displayName = document.getElementById('displayName');
displayName.innerHTML = getCookie('displayName');