function getCompanyNews() {
  var ticker = document.getElementById("company").value;
  var endDate = parseInt(new Date().getTime() / 1000);
  var startDate = endDate - 30 * 24 * 60 * 60;

  var url = "/companynews/" + ticker + "/" + startDate + "/" + endDate;

  superagent.get(url).end(function (err, res) {
    if (err) {
      console.log(err);
      document.getElementById("target").innerHTML =
        "Acquiring Company News Failed!";
    } else {
      // console.log("Company News Acquired!");
      document.getElementById("target").innerHTML = JSON.stringify(res.body);
    }
  });
}

function getStockQuote(quote = null) {
  var ticker = document.getElementById("company").value;
  if (quote != null) {
    ticker = quote;
  }

  var url = "/stockquote/" + ticker;

  return new Promise((resolve, reject) => {
    // console.log("making super agent call");
    superagent
      .get(url)
      .then(function (res) {
        document.getElementById("ticker").innerHTML = ticker;
        document.getElementById("open").innerHTML = "$" + round(res.body.o, 2);
        document.getElementById("current").innerHTML ="$" + round(res.body.c, 2);
        return res.body;
      })
      .catch((err) => {
          console.log(err)
      })
      .then((result) => {
        resolve(result);
      });
  });
}

function getCandleStick() {
  var ticker = document.getElementById("company").value;
  var endDate = parseInt(new Date().getTime() / 1000);
  var startDate = endDate - 30 * 24 * 60 * 60;

  var url = "/candlestick/" + ticker + "/" + startDate + "/" + endDate;

  superagent.get(url).end(function (err, res) {
    if (err) {
      console.log(err);
      document.getElementById("stock_graph_canvas").innerHTML =
        "Acquiring CandleStick Failed!";
    } else {
      // console.log("Company Candle Stick Acquired!");

      var i;
      var time = [];
      for (i = 0; i < res.body.t.length; i++) {
        time.push(timeConverter(res.body.t[i]));
      }
      // console.log(time);
      var myLineChart2 = new Chart(
        document.getElementById("stock_graph_canvas"),
        {
          type: "line",
          data: {
            labels: time,
            datasets: [
              {
                label: ticker + " Stock Price",
                data: res.body.c,
                backgroundColor: "rgba(78, 115, 223, 0.05)",
                borderColor: "rgba(78, 115, 223, 1)",
                pointRadius: 3,
                pointBackgroundColor: "rgba(78, 115, 223, 1)",
                pointBorderColor: "rgba(78, 115, 223, 1)",
                pointHoverRadius: 3,
                pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
                pointHoverBorderColor: "rgba(78, 115, 223, 1)",
                pointHitRadius: 10,
                pointBorderWidth: 2,
              },
            ],
          },
          options: {
            maintainAspectRatio: false,
            },
        }
      );
    }
  });
}

function buyAndSell() {
  getStockQuote();
  getCandleStick();
}

// Got this from stack overflow
function timeConverter(UNIX_timestamp) {
  var a = new Date(UNIX_timestamp * 1000);
  var months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time =
    date + " " + month + " " + year;
  return time;
}

// Got this from stack overflow
function round(value, decimals) {
  return Number(Math.round(value + "e" + decimals) + "e-" + decimals);
}

// Combined Function onClick
function getmuhstuff() {
  getStockQuote();
  getCandleStick();
}