
// (function(){

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
        measurementId: "G-Q52M7VL8WN"
	};
	const target = document.getElementById('login_target');

    // Initialize Firebase
    if (!firebase.apps.length) {
		firebase.initializeApp(firebaseConfig);
		firebase.analytics();
      }

	// get elements
	const email    = document.getElementById('email');
	const password = document.getElementById('password');
	const login    = document.getElementById('login');
	// const signup   = document.getElementById('signup');
	// const logout   = document.getElementById('logout');

	// const user = firebase.auth().currentUser;
	// console.log('user is')
	// console.log(user)
	// console.log('location')
	// console.log(window.location.pathname)
	// if (user) {
	// 	console.log('user is logged in')
	// } else {
	// 	console.log('no user logged in, redirecting to login page')
	// 	if (window.location.pathname != '/login.html') {
	// 	window.location.href = '/login.html'
	// }
		
		
	// 	return;
	// }
	// return;
	

	// // login
	// function login(e) {
	// 	console.log('in log in function')
	// 	const auth  = firebase.auth();		
	// 	const promise = auth.signInWithEmailAndPassword(email.value, password.value);
	// 	promise.catch(e => {
	// 		console.log(e.message)
	// 		target.innerHTML = `
	// 			<div class="alert alert-warning mt-3" role="alert">
	// 			Failed to log in. Account does not exist or email and password is incorrect. Please sign up for an account or double check your email and password is correct
	// 		</div>`
	// 	});
	// }
	if(login) {
		login.addEventListener('click', e => {
		const auth  = firebase.auth();		
		const promise = auth.signInWithEmailAndPassword(email.value, password.value);
		promise.catch(e => {
			console.log(e.message)
			target.innerHTML = `
				<div class="alert alert-warning mt-3" role="alert">
				Failed to log in. Account does not exist or email and password is incorrect. Please sign up for an account or double check your email and password is correct
			</div>`
		});
	});

	}

	// signup
	// signup.addEventListener('click', e => {
	// 	// TODO: check for real email
	// 	const auth  = firebase.auth();
	// 	const promise = auth.createUserWithEmailAndPassword(email.value,password.value);
	// 	promise.catch(e => {
	// 		console.log(e.message)
	// 		target.innerHTML = `
	// 			<div class="alert alert-danger mt-3" role="alert">
	// 			There was an error creating the account: ${e.message}. Please try again
	// 		</div>`
	// 	});
	// });

	// logout
	// if(logout) {
	// 	logout.addEventListener('click', e => {
	// 	console.log('clicked on log out!')
	// 	firebase.auth().signOut();
	// 	target.innerHTML = `
	// 		<div class="alert alert-success mt-3" role="alert">
	// 		Successfully logged out!
	// 	  </div>`
	// });
	// }
	


    // login state
	firebase.auth().onAuthStateChanged(firebaseUser => {
		console.log('in login on auth state changed')
		console.log('currently at ' + window.location.pathname)
		if(firebaseUser){
			console.log('firebase user is: ')
			console.log(firebaseUser);
			// set display name for legacy accounts
			if (firebaseUser.displayName == null) {
				firebaseUser.updateProfile({
					displayName: `LGO Capital Test`
				});
			}
			let displayName = firebaseUser.displayName ?? `LGO Capital Test`
			// save the user's display name in cookies
			document.cookie = `displayName:${displayName}`

			const userId = firebaseUser.uid;
			firebase.database().ref('/users/' + userId).once('value', snapshot => {
				var accountBalance = document.getElementById('accountBalance');
				var navAccountBalance = document.getElementById('navAccountBalance');
				if (snapshot.exists()) {
					console.log('account exists!')
					console.log(snapshot.val());
					navAccountBalance.innerHTML = `Account Balance: $${(snapshot.val().balance).toFixed(2)}`;

					if (accountBalance) {
						accountBalance.innerHTML = `$${(snapshot.val().balance).toFixed(2)}`;
					}
				} else {
					console.log('account does not exist yet')
					console.log(userId)
					// add new user to DB if the user does not exist yet
					addNewUser()
					navAccountBalance.innerHTML = `Account Balance: $0`
					if (accountBalance) {
						accountBalance.innerHTML = `$0`;
					}
				}
			})
			if (window.location.pathname == '/login.html') {
				window.location.href = '/index.html'
			}
		}
		else{
			console.log('User is not logged in');
			if (
				window.location.pathname != "/login.html" &&
				window.location.pathname != "/register.html"
			  ) {
				window.location.href = "/login.html";
			  }
		}
	});

// }());