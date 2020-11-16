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
                //document.getElementById("stock_quote").innerHTML = JSON.stringify(res.body);
                document.getElementById("ticker").innerHTML = ticker;
                document.getElementById("open").innerHTML = "$"+round(res.body.o,2);
                document.getElementById("close").innerHTML = "$"+round(res.body.c,2);
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
                document.getElementById("stock_graph_canvas").innerHTML = "Acquiring CandleStick Failed!";
            }
            else {
                console.log('Company Candle Stick Acquired!');
                
                var i;
                var time = [];
                for (i=0; i < res.body.t.length; i++) {
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

function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
  }
  console.log(timeConverter(0));

function round(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
  }


// stock quote
// request(`https://finnhub.io/api/v1/quote?symbol=AAPL&token=${token}`, { json: true }, (err, res, body) => {
//   if (err) { return console.log(err); }
//   console.log('successfully received stock information')
//   console.log(body);
// });
