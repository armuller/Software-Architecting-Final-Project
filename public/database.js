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
  const name = firebaseUser.displayName;
  const users = db.ref("users");
  const userId = firebaseUser.uid;
  const balance = 0;
  var transactions = [
    {
      num_shares: 0,
      price: 0,
      purchase_date: new Date().getTime(),
      symbol: "",
    },
  ];

  // write to db
  users
    .child(userId)
    .set({ email, name, balance, transactions })
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
  const user = firebase.auth().currentUser;
  const userId = user.uid;
  let results = null;
  const status = document.getElementById("status");
  return new Promise((resolve, reject) => {
    db.ref("/users/" + userId)
      .once("value")
      .then(function (snapshot) {
        // console.log(snapshot.val());
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
  // console.log('is buy is: ' + isBuy)
  const userId = firebase.auth().currentUser.uid;
  const status = document.getElementById("status");
  const buySellResult = document.getElementById("buy_sell_result");
  const stock = document.getElementById("company").value.toUpperCase();
  const numShares = parseInt(document.getElementById("num_shares").value);
  console.log("buy sell result is");
  console.log(buySellResult);

  (async () => {
    console.log("getting stock data");
    const stockQuoteInfo = await getStockQuote(stock);
    console.log("stock is " + stock);
    // const currentPrice = getStockQuote(stock)
    console.log("stock quote info is:");
    console.log(stockQuoteInfo);
    const currentPrice = stockQuoteInfo.c;
    const currentUser = await getCurrentUser();
    const balance = currentUser.balance;
    console.log("user is");
    console.log(currentUser);

    // determine if user has sufficient balance if the user is buying stocks:
    const transCost = numShares * currentPrice;
    if (isBuy) {
      if (transCost <= balance) {
        console.log(currentPrice);
        console.log(currentUser.transactions);
        console.log(currentUser);
        currentUser.transactions.push({
          symbol: stock,
          purchase_date: new Date().getTime(),
          num_shares: numShares,
          price: currentPrice, // get this info from finnhub
        });

        // update balance
        updateCashBalance(-transCost);
        buySellResult.innerHTML = `
        <div class="alert alert-success" role="alert"> 
          Purchased ${numShares} share(s) of ${stock}!
        </div>`;

        var updates = {};
        updates[userId] = currentUser;
        console.log("updates is");
        console.log(updates);

        return db.ref("users").update(updates);
      } else {
        console.log("error, insufficient balance");
        status.innerHTML = `<div class="alert alert-warning mt-3" role="alert">
            Error, insufficient balance to make this purchase
          </div>`;
      }
    } else {
      // selling stocks
      // check if we have enough shares of the stock to sell (perhaps by calling getUserPortfolio first)
      // if so, add the transactions indicating the sell and update the cash balance
      // otherwise, show an error
      console.log("selling stock");
      // get user portfolio
      const transactions = currentUser.transactions;
      var transaction_length = transactions.length;
      var n = 0;
      var portfolio = {};

      for (n = 0; n < transaction_length; n++) {
        if (transactions[n]) {
          if (transactions[n].symbol in portfolio) {
            var quantity = transactions[n].num_shares;
            var cost = transactions[n].price * quantity;
            portfolio[transactions[n].symbol].quantity += quantity;
            portfolio[transactions[n].symbol].cost_basis += cost;
          } else {
            if (transactions[n].symbol != "") {
              const ticker = transactions[n].symbol;
              var quantity = transactions[n].num_shares;
              var cost = transactions[n].price * quantity;
              portfolio[ticker] = {
                quantity: quantity,
                cost_basis: cost,
                current_value: 0,
                gain: 0,
                return: 0,
              };
            }
          }
        }
      }
      for (stock_symbol in portfolio) {
        const stockQuoteInfo = await getStockQuote(stock_symbol);
        var curr_price = stockQuoteInfo.c;
        portfolio[stock_symbol].current_value =
          curr_price * portfolio[stock_symbol].quantity;
        portfolio[stock_symbol].gain =
          portfolio[stock_symbol].current_value -
          portfolio[stock_symbol].cost_basis;
        portfolio[stock_symbol].return =
          portfolio[stock_symbol].gain / portfolio[stock_symbol].cost_basis;
      }
      console.log("user portfolio");
      console.log(portfolio);
      // if user owns the stock and has enough shares to sell, allow them to sell it
      let userOwnedQuantity = 0;
      if (stock in portfolio && portfolio[stock].quantity > 0) {
        userOwnedQuantity = portfolio[stock].quantity;
      }
      if (userOwnedQuantity - numShares >= 0) {
        console.log("stock is in user portfolio");
        currentUser.transactions.push({
          symbol: stock,
          purchase_date: new Date().getTime(),
          num_shares: -numShares,
          price: currentPrice, // get this info from finnhub
        });

        // update balance
        updateCashBalance(transCost);
        buySellResult.innerHTML = `
         <div class="alert alert-success" role="alert">
          Sold ${numShares} share(s) of ${stock}!
        </div>
         `;

        var updates = {};
        updates[userId] = currentUser;
        return db.ref("users").update(updates);
      } else {
        console.log(
          "error, user trying to sell " +
            numShares +
            " shares of " +
            stock +
            " but does not own enough shares to sell"
        );
        status.innerHTML = `<div class="alert alert-warning mt-3" role="alert">
				Failed to sell ${numShares} shares of ${stock}. You have ${userOwnedQuantity} shares to sell
			</div>`;
      }
    }
  })();
}

/**
 * get user portfolio for displaying account information on the UI
 *
 * @return JSON object containing information on stocks user owns, # of shares, cost basis, unrealized gains/ losses, % gain/ loss
 */
function getUserPortfolio(date = new Date().getTime()) {
  // get all of user's transactions
  return (async () => {
    const currentUser = await getCurrentUser();
    const transactions = currentUser.transactions;

    // loop through and aggregate data on stocks user owns, # of shares, cost basis, unrealized gains/ losses, % gain/ loss
    var transaction_length = transactions.length;
    var n = 0;
    var portfolio = {};
    for (n = 0; n < transaction_length; n++) {
      if (transactions[n]) {
        if (transactions[n].purchase_date <= date) {
          if (transactions[n].symbol in portfolio) {
            var quantity = transactions[n].num_shares;
            var cost = transactions[n].price * quantity;
            portfolio[transactions[n].symbol].quantity += quantity;
            portfolio[transactions[n].symbol].cost_basis += cost;
          } else {
            if (transactions[n].symbol != "") {
              const ticker = transactions[n].symbol;
              var quantity = transactions[n].num_shares;
              var cost = transactions[n].price * quantity;
              portfolio[ticker] = {
                quantity: quantity,
                cost_basis: cost,
                current_value: 0,
                gain: 0,
                return: 0,
              };
            }
          }
        }
      }
    }
    return portfolio;
  })();
  // auto-refresh the user account table after the account is made
}

function getCurrentPortfolioValue(portfolio = {}) {
  return async () => {
    for (var stock in portfolio) {
      const stockQuoteInfo = await getStockQuote(stock);
      var curr_price = stockQuoteInfo.c;
      portfolio[stock].current_value = curr_price * portfolio[stock].quantity;
      portfolio[stock].gain =
        portfolio[stock].current_value - portfolio[stock].cost_basis;
      portfolio[stock].return =
        portfolio[stock].gain / portfolio[stock].cost_basis;
    }
    return portfolio;
  };
}

/**
 * Given an amount to update the balance by, update the user's cash balance
 *
 * @param float amount positive if depositing money or selling stock, negative if buying stock
 */
function updateCashBalance(amount) {
  const userId = firebase.auth().currentUser.uid;
  const status = document.getElementById("status");
  const navAccountBalance = document.getElementById('navAccountBalance');
  (async () => {
    const currentUser = await getCurrentUser();
    const balance = parseFloat(currentUser["balance"]) + amount;
    currentUser["balance"] = parseFloat(balance);
    var updates = {};
    updates[userId] = currentUser;
    navAccountBalance.innerHTML = `Account Balance: $${balance.toFixed(2)}`
    status.innerHTML = `
      <div class="alert alert-success" role="alert">
        Updated balance by $${amount}! New balance is: $${balance.toFixed(2)}
      </div>
      `;
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
  updateCashBalance(depositAmount);
}

/**
 * clear all HTML divs on every button click so previous data isn't still hanging around. call this at the beginning of all user facing functions
 */
function resetAllHTMLDivs() {
  const buyAndSell = document.getElementById("buy_sell_result");
  const status = document.getElementById("status");
  if (buyAndSell && status) {
    buyAndSell.innerHTML = "";
    status.innerHTML = "";
  }
}

function getTransactions() {
  (async () => {
    const currentUser = await getCurrentUser();
    const transactions = currentUser.transactions;
    console.log(transactions);
    if (transactions) {
      let resultsDiv = document.getElementById("transactions");
      resultsString = "";
      resultsString = `
        <table class="table">
          <thead>
            <tr>`;
      let tableHeaders = Object.keys(transactions[0]);
      let tableHeaders2 = [
        "Number of Shares Purchased",
        "Purchase Price ($)",
        "Purchase Date/Time (UNIX)",
        "Stock Ticker",
      ];
      for (let i = 0; i < tableHeaders2.length; i++) {
        resultsString += `<th scope="col">${tableHeaders2[i]}</th>`;
      }
      resultsString += `</tr>
      </thead>
      <tbody>
      `;
      for (let i = 0; i < transactions.length; i++) {
        resultsString += `<tr>`;
        for (let j = 0; j < tableHeaders.length; j++) {
          let currentHeader = tableHeaders[j];
          resultsString += `<td>${transactions[i][currentHeader]}</td>`;
        }
        resultsString += `</tr>`;
      }
      resultsString += `</tbody></table>`;
      resultsDiv.innerHTML = resultsString;
    }
    return transactions;
  })();
}

function getFriendsPerformance() {
  const friendemail = document.getElementById("friend_email");
  const firebaseuser = firebase.auth().getUserByEmail(friendemail);
  console.log(firebaseuser.balance);
}

function getFriendData() {
  const status = document.getElementById("friend_email").value;
  const display = document.getElementById("friend");
  return db
    .ref("/users/")
    .once("value")
    .then(function (snapshot) {
      var something = snapshot.val();
      console.log(something);
      for (i in something) {
        console.log(something[i].email)
        if (something[i].email == status) {
          var balance = something[i].balance;
          console.log(balance);
          display.innerHTML = `<div class="alert alert-success mt-3" role="alert">
          Your Friend's Balance is: $${balance.toFixed(2)}
        </div>`
        };
    };
  });
}
