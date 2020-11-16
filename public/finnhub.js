function getCompanyNews() {
    var ticker = document.getElementById('company').value;
    var endDate = parseInt(new Date().getTime() / 1000)
    var startDate = endDate - 30 * 24 * 60 * 60;

    var url = '/companynews/' + ticker + '/' + startDate + '/' + endDate;

    superagent
        .get(url)
        .end(function (err, res) {
            if (err) {
                console.log(err);
                document.getElementById("target").innerHTML = "Acquiring Company News Failed!";
            }
            else {
                console.log('Company News Acquired!');
                document.getElementById("target").innerHTML = JSON.stringify(res.body);
            }
        });
};

function getStockQuote() {
    var ticker = document.getElementById('company').value;

    var url = '/stockquote/' + ticker;

    superagent
        .get(url)
        .end(function (err, res) {
            if (err) {
                console.log(err);
                document.getElementById("target").innerHTML = "Acquiring Company Quote Failed!";
            }
            else {
                console.log('Company Quote Acquired!');
                document.getElementById("Buy target").innerHTML = JSON.stringify(res.body);
            }
        });
};



function getCandleStick() {
    var ticker = document.getElementById('company').value;
    var endDate = parseInt(new Date().getTime() / 1000)
    var startDate = endDate - 30 * 24 * 60 * 60;

    var url = '/candlestick/' + ticker + '/' + startDate + '/' + endDate;

    superagent
        .get(url)
        .end(function (err, res) {
            if (err) {
                console.log(err);
                document.getElementById("target").innerHTML = "Acquiring CandleStick Failed!";
            }
            else {
                console.log('Company Candle Stick Acquired!');
                var myLineChart2 = new Chart(
                  document.getElementById("Buy target"),
                  {
                    type: "line",
                    data: {
                      labels: res.body.t,
                      datasets: [
                        {
                          label: "My First Dataset",
                          data: res.body.c,
                          fill: false,
                          borderColor: "rgb(75, 192, 192)",
                          lineTension: 0.1,
                        },
                      ],
                    },
                    options: {},
                  }
                );
            }
        });
};


function buyAndSell() {
    getStockQuote();
    getCandleStick();
}

// stock quote
// request(`https://finnhub.io/api/v1/quote?symbol=AAPL&token=${token}`, { json: true }, (err, res, body) => {
//   if (err) { return console.log(err); }
//   console.log('successfully received stock information')
//   console.log(body);
// });
