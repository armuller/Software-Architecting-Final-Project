// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
  apiKey: "AIzaSyCfJP3rWp_QZw-cnTdunHbhiG_Ms6hrml8",
  authDomain: "final-project-f6408.firebaseapp.com",
  databaseURL: "https://final-project-f6408.firebaseio.com",
  projectId: "final-project-f6408",
  storageBucket: "final-project-f6408.appspot.com",
  messagingSenderId: "321737945642",
  appId: "1:321737945642:web:2c3800f0ff3bb40841c953",
  measurementId: "G-Q52M7VL8WN",
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
}

// get elements
const logout = document.getElementById("logout");

// logout
if (logout) {
    logout.addEventListener("click", (e) => {
    console.log("clicked on log out!");
    firebase.auth().signOut();
    });
}


// login state
firebase.auth().onAuthStateChanged((firebaseUser) => {
  console.log("in logout on auth state changed");
  if (firebaseUser) {
    console.log("firebase user is: ");
    console.log(firebaseUser);
    const userId = firebaseUser.uid;
    firebase
      .database()
      .ref("/users/" + userId)
      .once("value", (snapshot) => {
        if (snapshot.exists()) {
          console.log("account exists!");
          console.log(snapshot.val());
        } else {
          console.log("account does not exist yet");
          console.log(userId);
          // add new user to DB if the user does not exist yet
          addNewUser();
        }
      });
  } else {
    console.log('User is not logged in');
    if (
        window.location.pathname != "/login.html" &&
        window.location.pathname != "/register.html"
      ) {
        window.location.href = "/login.html";
      }
  }
});
