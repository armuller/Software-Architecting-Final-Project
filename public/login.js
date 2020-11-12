(function(){

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
	const target = document.getElementById('home_target');

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();

	// get elements
	const email    = document.getElementById('email');
	const password = document.getElementById('password');
	const login    = document.getElementById('login');
	const signup   = document.getElementById('signup');
	const logout   = document.getElementById('logout');

	// login
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

	// signup
	signup.addEventListener('click', e => {
		// TODO: check for real email
		const auth  = firebase.auth();
		const promise = auth.createUserWithEmailAndPassword(email.value,password.value);
		promise.catch(e => {
			console.log(e.message)
			target.innerHTML = `
				<div class="alert alert-danger mt-3" role="alert">
				There was an error creating the account: ${e.message}. Please try again
			</div>`
		});
	});

    // logout
	logout.addEventListener('click', e => {
		firebase.auth().signOut();
		target.innerHTML = `
			<div class="alert alert-success mt-3" role="alert">
			Successfully logged out!
		  </div>`
	});


    // login state
	firebase.auth().onAuthStateChanged(firebaseUser => {
		if(firebaseUser){
			console.log(firebaseUser);
			logout.style.display = 'inline';
			login.style.display  = 'none';
			signup.style.display = 'none';
			target.innerHTML = `
			<div class="alert alert-success mt-3" role="alert">
			Successfully logged in! Welcome, ${firebaseUser.email}
		  </div>`
		}
		else{
			console.log('User is not logged in');
			logout.style.display = 'none';			
			login.style.display  = 'inline';
			signup.style.display = 'inline';
		}
	});

}());