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
  resetAllHTMLDivs();
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
    price: 0
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
  resetAllHTMLDivs();
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
  resetAllHTMLDivs();
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
        // status.innerHTML =
        //   "Got current user from DB: " + JSON.stringify(results);
        return results;
      })
      .then((result) => {
        resolve(result);
      });
  });
}

// todo: check if number is negative that the user has enough shares to sell. If the number is positive user has enough money to buy
// todo: transactions needs to be a list we continuously append to, not an object that keeps replacing itself
function purchaseStock(isBuy) {
  resetAllHTMLDivs();
  console.log('is buy is: ' + isBuy)
  const userId = firebase.auth().currentUser.uid;
  const status = document.getElementById("status");
  const butSellResult = document.getElementById("buy_sell_result")
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
    console.log('user is')
    console.log(currentUser)

    // determine if user has sufficient balance if the user is buying stocks:
    const transCost = numShares * currentPrice;
    if (isBuy) {
      if (transCost <= balance) {
        console.log(currentPrice)
        console.log(currentUser.transactions)
        console.log(currentUser)
        currentUser.transactions.push({
          symbol: stock,
          purchase_date: new Date().getTime(),
          num_shares: numShares,
          price: currentPrice // get this info from finnhub
        });
        console.log("current user after stock purchase");
        console.log(currentUser);

        // update balance
        updateCashBalance(-transCost)

        var updates = {};
        updates[userId] = currentUser;
        butSellResult.innerHTML = `Purchased ${numShares} shares of ${stock}!`
          // numShares > 0
            // ? `Purchased ${numShares} shares of ${stock}!`
            // : `Sold ${numShares} shares of ${stock}!`;
        return db.ref("users").update(updates);
      } else {
        console.log("error, insufficient balance");
        status.innerHTML =
          'Error, insufficient balance to make this purchase'
      }
    } else {
      // selling stocks
      // check if we have enough shares of the stock to sell (perhaps by calling getUserPortfolio first)
      // if so, add the transactions indicating the sell and update the cash balance
      // otherwise, show an error
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
  (async () => {
    const currentUser = await getCurrentUser();
    const transactions = currentUser.transactions;
    console.log('user is')
    console.log(currentUser)
    console.log(transactions)

    // loop through and aggregate data on stocks user owns, # of shares, cost basis, unrealized gains/ losses, % gain/ loss
    var transaction_length = transactions.length;
    var n = 0;
    var portfolio = {}
    for (n =0; n < transaction_length; n++){
      console.log(transactions[n])
      console.log(transactions[n].symbol)
      console.log(transactions[n].symbol in portfolio)
       if (transactions[n].symbol in portfolio){
        var quantity = transactions[n].num_shares
        var cost = transactions[n].price*quantity
        portfolio[transactions[n].symbol].quantity += quantity
        portfolio[transactions[n].symbol].cost_basis += cost
        console.log(portfolio)
       } else {
        if (transactions[n].symbol != ""){
          const ticker = transactions[n].symbol
          var quantity = transactions[n].num_shares
          var cost = transactions[n].price*quantity
          portfolio[ticker] = {
              quantity: quantity,
              cost_basis: cost,
              current_value: 0,
              gain: 0,
              return: 0
          };
          console.log(portfolio)
        };
      };
    };
    for (var stock in portfolio){
      console.log(stock);
      console.log(portfolio[stock]);

      const stockQuoteInfo = await getStockQuote(stock);
      var curr_price = stockQuoteInfo.c;
      portfolio[stock].current_value = curr_price * portfolio[stock].quantity
      portfolio[stock].gain = portfolio[stock].current_value - portfolio[stock].cost_basis
      portfolio[stock].return = portfolio[stock].gain/portfolio[stock].cost_basis

      console.log(portfolio[stock]);
    }
  })();
  
  // auto-refresh the user account table after the account is made
};

/**
 * Given an amount to update the balance by, update the user's cash balance
 *
 * @param float amount positive if depositing money or selling stock, negative if buying stock
 */
function updateCashBalance(amount) {
  const userId = firebase.auth().currentUser.uid;
  const status = document.getElementById("status");
  (async () => {
    const currentUser = await getCurrentUser();
      const balance = parseFloat(currentUser["balance"]) + amount;
      currentUser["balance"] = parseFloat(balance);
      var updates = {};
      updates[userId] = currentUser;
      status.innerHTML = `Updated balance by $${amount}! New balance is: $${balance.toFixed(2)}`;
      return db.ref("users").update(updates);
  })();
}

function depositFunds() {
  resetAllHTMLDivs();
  const status = document.getElementById("status");
  const depositAmount = parseFloat(
    document.getElementById("deposit_amount").value
  );
  console.log("deposit amount is " + depositAmount);
  updateCashBalance(depositAmount)
}

/**
 * clear all HTML divs on every button click so previous data isn't still hanging around. call this at the beginning of all user facing functions
 */
function resetAllHTMLDivs() {
  const buyAndSell = document.getElementById("buy_sell_result");
  const status = document.getElementById("status");
  buyAndSell.innerHTML = '';
  status.innerHTML = '';
}


