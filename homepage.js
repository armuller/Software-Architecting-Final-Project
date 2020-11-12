// setup server
const express = require('express');
const app     = express();

// setup Finnhub API Access
const finnhub = require('finnhub');
const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = "buko60n48v6qi7364sag" 
const finnhubClient = new finnhub.DefaultApi()

app.use(express.static('public'));

app.get('/companynews/:ticker/:startDate/:endDate', function (req, res) {

    var ticker = req.params.ticker;
    var startDate = req.params.startDate;
    var endDate = req.params.endDate;

    // YOUR CODE
    finnhubClient.companyNews(ticker, startDate, endDate, (error, data, response) => {
        if (error) {
            console.error(error);
        } 
        else {
            console.log(data)
        }
    console.log('Success');
    res.send(data);
    });
});

app.get('/stockquote/:ticker', function (req, res) {

    var ticker = req.params.ticker;

    // YOUR CODE
    finnhubClient.quote(ticker, (error, data, response) => {
        if (error) {
            console.error(error);
        } 
        else {
            console.log(data)
        }
    console.log('Success');
    res.send(data);
    });
});

app.get('/candlestick/:ticker/:startDate/:endDate', function (req, res) {

    var ticker = req.params.ticker;
    var startDate = req.params.startDate;
    var endDate = req.params.endDate;

    let opts = {
        'adjusted': "adjusted_example" // String | By default, <code>adjusted=false</code>. Use <code>true</code> to get adjusted data.
      };

    // YOUR CODE
    finnhubClient.stockCandles(ticker, "D", startDate, endDate, opts, (error, data, response) => {
        if (error) {
            console.error(error);
        } 
        else {
            console.log(data)
        }
    console.log('Success');
    res.send(data);
    });
});


app.listen(3001, function(){console.log('Running on port 3001')})