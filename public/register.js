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
const signup = document.getElementById("signup");
var firstName = document.getElementById("registerFirstName");
var lastName = document.getElementById('registerLastName');
const registerEmail    = document.getElementById('registerEmail');
const registerPassword = document.getElementById('registerPassword');
const repeatPassword = document.getElementById('registerRepeatPassword');
const registerStatus = document.getElementById('registerStatus');
console.log("in signup!");


// signup
signup.addEventListener("click", (e) => {
    registerStatus.innerHTML = ''
    if (registerPassword.value !== repeatPassword.value) {
        registerStatus.innerHTML = 	`<div class="alert alert-warning mt-3" role="alert">
            The passwords do not match
            </div>`
            return;
    }
  // TODO: check for real email
  const auth = firebase.auth();
  auth
    .createUserWithEmailAndPassword(registerEmail.value, registerPassword.value)
    .then((result) => {
      const displayName = `${firstName.value} ${lastName.value}`
      document.cookie = `displayName:${displayName}`
      return result.user.updateProfile({
          displayName: `${displayName}`
      });
    })
    .catch((e) => {
      console.log(e.message);
      registerStatus.innerHTML = `<div class="alert alert-warning mt-3" role="alert">
      ${e.message}
      </div>`
    });
});

// login state
firebase.auth().onAuthStateChanged((firebaseUser) => {
  console.log("in register on auth state changed");
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

        window.location.href = '/index.html'
      });
  } else {
    console.log("User is not logged in");
    if (
      window.location.pathname != "/login.html" &&
      window.location.pathname != "/register.html"
    ) {
      window.location.href = "/login.html";
    }
  }
});
