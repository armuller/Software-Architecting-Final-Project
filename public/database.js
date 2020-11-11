// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyCfJP3rWp_QZw-cnTdunHbhiG_Ms6hrml8",
    authDomain: "final-project-f6408.firebaseapp.com",
    databaseURL: "https://final-project-f6408.firebaseio.com/",
    projectId: "final-project-f6408",
    storageBucket: "final-project-f6408.appspot.com",
    };
// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// handle on firebase db
var db = firebase.database();

function addNewUser() {
    const status  = document.getElementById('status');
    console.log('current user uid is: ' + firebase.auth().currentUser.uid)
    const email = 'test@gmail.com'
    const name = 'ehau test'
    const users = db.ref('users')
    const userId = firebase.auth().currentUser.uid
    // const id = email.substring(0, email.indexOf('@'))
    console.log('id is ' + userId)
    // write to db
    users.child(userId).set({email, name})
    .then(function(){
        status.innerHTML = "Wrote to DB!";
    })
    .catch(function(err) {
        status.innerHTML = 'There was an error. did not write to DB';
    });
}

function getAllUsers() {
    const status  = document.getElementById('status');
    return db.ref('/users/').once('value').then(function(snapshot) {
        console.log(snapshot.val())
        // var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
        // ...
        status.innerHTML = "Got all users from DB"
      });
}

function getCurrentUser() {
    const userId = firebase.auth().currentUser.uid
    let results = null
    const status  = document.getElementById('status');
    return db.ref('/users/' + userId).once('value').then(function(snapshot) {
        console.log(snapshot.val())
        results = snapshot.val()
        // var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
        // ...
        status.innerHTML = "Got current user from DB"
      });
    // return results
}

function purchaseStock() {
    const userId = firebase.auth().currentUser.uid
    // console.log(getCurrentUser())
    // note: for some reason because getCurrentUser() is an unresolved promise I was having
    // undefined issues...so I decided to just do it here instaed of doing promise chaining
    const status  = document.getElementById('status');
    db.ref('/users/' + userId).once('value').then(function(snapshot) {
        currentUser = snapshot.val()
        console.log('current user information is')
        console.log(currentUser)
        currentUser['stocks'] = {
            'symbol': 'AAPL',
            'purchase_date': new Date().getTime(),
            'number of shares': 2
        }
        console.log('current user after stock purchase')
        console.log(currentUser)
        var updates = {}
        updates[userId] = currentUser
        status.innerHTML = "Purchased stock!"
        return db.ref('users').update(updates)
        
      });
    
        
}
