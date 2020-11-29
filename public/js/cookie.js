function getCookie(cname) {
    console.log('in get cookie')
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

var displayName = document.getElementById('displayName');
displayName.innerHTML = getCookie('displayName');