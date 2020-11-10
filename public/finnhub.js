// finnhub

/*
var finnhub = require('finnhub')
var request = require('request')
var token = 'buko60n48v6qi7364sag'

const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = token // Replace this
const finnhubClient = new finnhub.DefaultApi()

//Company News
// finnhubClient.companyNews("AAPL", "2020-11-08", "2020-11-09", (error, data, response) => {
//     if (error) {
//         console.error(error);
//     } else {
//         console.log('received company news')
//         console.log(data)
//     }
// });

// stock quote
request(`https://finnhub.io/api/v1/quote?symbol=AAPL&token=${token}`, { json: true }, (err, res, body) => {
  if (err) { return console.log(err); }
  console.log('successfully received stock information')
  console.log(body);
});

*/
const express = require('express');
const app     = express();

console.log('At finnhub.js')


// var request = require('request')
// const api_key = finnhub.ApiClient.instance.authentications['api_key'];
// api_key.apiKey = "buko60n48v6qi7364sag" // Replace this

// Stock candles
// finnhubClient.stockCandles("AAPL", "D", 1590988249, 1591852249, {}, (error, data, response) => {
//     console.log('stock candles')
//     console.log(data)
// });
 
//Company News
function getCompanyNews() {
    var finnhub = require('finnhub')    
    var finnhubClient = new finnhub.DefaultApi()
    console.log(finnhubClient)
    finnhubClient.companyNews("AAPL", "2020-11-08", "2020-11-09", (error, data, response) => {
        if (error) {
            console.error(error);
        } else {
            console.log(data)
        }
    });
};
