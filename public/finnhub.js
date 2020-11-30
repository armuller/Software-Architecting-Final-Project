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
      console.log("Company News Acquired!");
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
    console.log("making super agent call");
    superagent
      .get(url)
      .then(function (res) {
        console.log("Company Quote Acquired!");
        console.log(res.body);
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

function getCandleStick(stock = null, date = null) {
  var ticker;
  if (stock != null) {
    ticker = stock;
  } else {
    ticker = document.getElementById("company").value;
  };
  
  var endDate = parseInt(new Date().getTime() / 1000);
  if (date != null){
    endDate = parseInt(date/1000);
  };

  var startDate = endDate - 30 * 24 * 60 * 60;

  var url = "/candlestick/" + ticker + "/" + startDate + "/" + endDate;

  return new Promise((resolve, reject) => {
    superagent.get(url).then(function(res) {
      console.log("Company Candle Stick Acquired!");

      var i;
      var time = [];
      console.log(res.body);
      for (i = 0; i < res.body.t.length; i++) {
        time.push(timeConverter(res.body.t[i]));
      }
      // var myLineChart2 = new Chart(
      //   document.getElementById("stock_graph_canvas"),
      //   {
      //     type: "line",
      //     data: {
      //       labels: time,
      //       datasets: [
      //         {
      //           label: ticker + " Stock Price",
      //           data: res.body.c,
      //           fill: false,
      //           borderColor: "rgb(75, 192, 192)",
      //           lineTension: 0.1,
      //         },
      //       ],
      //     },
      //     options: {},
      //   }
      // );
      return res.body;
    })
    .catch((err) => {
      console.log(err)
    })
    .then((result) => {
      resolve(result);
    });

  })
  
  // superagent.get(url).end(function (err, res) {
  //   if (err) {
  //     console.log(err);
  //     document.getElementById("stock_graph_canvas").innerHTML =
  //       "Acquiring CandleStick Failed!";
  //   } else {
  //     console.log("Company Candle Stick Acquired!");

  //     var i;
  //     var time = [];
  //     console.log(res.body);
  //     for (i = 0; i < res.body.t.length; i++) {
  //       time.push(timeConverter(res.body.t[i]));
  //     }
  //     console.log(time);
  //     var myLineChart2 = new Chart(
  //       document.getElementById("stock_graph_canvas"),
  //       {
  //         type: "line",
  //         data: {
  //           labels: time,
  //           datasets: [
  //             {
  //               label: ticker + " Stock Price",
  //               data: res.body.c,
  //               fill: false,
  //               borderColor: "rgb(75, 192, 192)",
  //               lineTension: 0.1,
  //             },
  //           ],
  //         },
  //         options: {},
  //       }
  //     );
  //     return res.body;
  //   }
  // });
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

function getGraph(stock = null, date = null) {
  var ticker;
  if (stock != null) {
    ticker = stock;
  } else {
    ticker = document.getElementById("company").value;
  };
  
  var endDate = parseInt(new Date().getTime() / 1000);
  if (date != null){
    endDate = parseInt(date/1000);
  };

  var startDate = endDate - 30 * 24 * 60 * 60;

  var url = "/candlestick/" + ticker + "/" + startDate + "/" + endDate;

  return new Promise((resolve, reject) => {
    superagent.get(url).end(function (err, res) {
        if (err) {
          console.log(err);
          document.getElementById("stock_graph_canvas").innerHTML =
            "Acquiring CandleStick Failed!";
        } else {
          console.log("Company Candle Stick Acquired!");

          var i;
          var time = [];
          console.log(res.body);
          for (i = 0; i < res.body.t.length; i++) {
            time.push(timeConverter(res.body.t[i]));
          }
          console.log(time);
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
                    fill: false,
                    borderColor: "#4e73df",
                    lineTension: 0.1,
                  },
                ],
              },
              options: {},
            }
          );
          return res.body;
        }
      });
    });
}

function getmuhstuff() {
  getGraph();
  getStockQuote();
}

