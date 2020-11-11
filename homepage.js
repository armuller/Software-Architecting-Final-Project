
/*
const finnhub = require('finnhub');
 
const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = "buko60n48v6qi7364sag" 
const finnhubClient = new finnhub.DefaultApi()

//Company News
function getCompanyNews() {
    finnhubClient.companyNews("AAPL", "2020-01-01", "2020-05-01", (error, data, response) => {
        if (error) {
            console.error(error);
        } 
        else {
            console.log(data)
        }
});
}
*/

// setup server
const express = require('express');
const app     = express();

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
app.listen(3001, function(){console.log('Running on port 3001')})