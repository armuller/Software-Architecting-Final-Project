// finnhub
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