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
  const status = document.getElementById("status");

  const firebaseUser = firebase.auth().currentUser;
  console.log("current user is: " + firebaseUser);
  const email = firebaseUser.email;
  const name = email.substring(0, email.indexOf("@")); // todo: can probably update to ask for the user's name, but for now just take whatever is in front of '@'
  const users = db.ref("users");
  const userId = firebaseUser.uid;
  const balance = 0;
  var transactions = [{
    symbol: "",
    purchase_date: new Date().getTime(),
    num_shares: 0,
    price: 0, 
  }];

  // write to db
  users
    .child(userId)
    .set({ email, name, balance, transactions})
    .then(function () {
      console.log(`successfully added new user to DB: ${email}`);
      status.innerHTML = "Wrote to DB!";
    })
    .catch(function (err) {
      console.log(`failed added new user to DB: ${email}`);
      status.innerHTML = "There was an error. did not write to DB";
    });
}

function getAllUsers() {
  const status = document.getElementById("status");
  return db
    .ref("/users/")
    .once("value")
    .then(function (snapshot) {
      console.log(snapshot.val());
      // var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
      // ...
      status.innerHTML = "Got all users from DB";
    });
}

function getCurrentUser() {
  const userId = firebase.auth().currentUser.uid;
  let results = null;
  const status = document.getElementById("status");
  return new Promise((resolve, reject) => {
    db.ref("/users/" + userId)
      .once("value")
      .then(function (snapshot) {
        console.log(snapshot.val());
        results = snapshot.val();
        // var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
        // ...
        status.innerHTML =
          "Got current user from DB: " + JSON.stringify(results);
        return results;
      })
      .then((result) => {
        resolve(result);
      });
  });
}

// todo: check if number is negative that the user has enough shares to sell. If the number is positive user has enough money to buy
// todo: transactions needs to be a list we continuously append to, not an object that keeps replacing itself
function purchaseStock() {
  const userId = firebase.auth().currentUser.uid;
  const status = document.getElementById("status");
  const stock = document.getElementById("stock_ticker").value;
  const numShares = parseInt(document.getElementById("num_shares").value);

  (async () => {
    const stockQuoteInfo = await getStockQuote(stock);
    // const currentPrice = getStockQuote(stock)
    console.log("stock quote info is:");
    console.log(stockQuoteInfo);
    const currentPrice = stockQuoteInfo.c;
    const currentUser = await getCurrentUser();
    const balance = currentUser.balance;
    // console.log('user is')

    // determine if user has sufficient balance:
    const transCost = numShares * currentPrice;
    if (transCost <= balance) {
      console.log(currentPrice)
      currentUser.transactions.push({
        symbol: stock,
        purchase_date: new Date().getTime(),
        num_shares: numShares,
        price: currentPrice, // get this info from finnhub
      });
      console.log("current user after stock purchase");
      console.log(currentUser);
      
      // update balance
      newbal = balance - transCost;
      var changes = {};
      changes[userId + '/balance'] = newbal;
      db.ref("users").update(changes);

      var updates = {};
      updates[userId] = currentUser;
      status.innerHTML =
        numShares > 0
          ? `Purchased ${numShares} shares of ${stock}!`
          : `Sold ${numShares} shares of ${stock}!`;
      return db.ref("users").update(updates);
    }
    else {
      console.log("error, insufficient balance");
      status.innerHTML =
        'Error, insufficient balance to make this purchase'
    }
  })();
}


/**
 * get user portfolio for displaying account information on the UI
 *
 * @return JSON object containing information on stocks user owns, # of shares, cost basis, unrealized gains/ losses, % gain/ loss
 */
function getUserPortfolio() {
  // get all of user's transactions
  // loop through and aggregate data on stocks user owns, # of shares, cost basis, unrealized gains/ losses, % gain/ loss
  // auto-refresh the user account table after the account is made
  // cost basis from weighted average of the purchase history
  // unrealized gains & losses we need to ping finnhub for current price
}

/**
 * Given a buy/ sell transaction, depending on whether the user bought or sold, update user's cash balance
 *
 * @param object transaction
 */
function updateCashBalance(transaction) {
  
}

function depositFunds() {
  const depositAmount = parseFloat(
    document.getElementById("deposit_amount").value
  );
  console.log("deposit amount is " + depositAmount);
  const userId = firebase.auth().currentUser.uid;
  const status = document.getElementById("status");
  (async () => {
    const currentUser = await getCurrentUser();
    // console.log('user is')
    console.log("current user information is");
      console.log(currentUser);
      const balance = parseFloat(currentUser["balance"]) + depositAmount;
      currentUser["balance"] = parseFloat(balance);
      console.log("current user after deposit");
      console.log(currentUser);
      var updates = {};
      updates[userId] = currentUser;
      status.innerHTML = `Deposited $${depositAmount}! New balance is: $${balance}`;
      return db.ref("users").update(updates);
  })();
}
