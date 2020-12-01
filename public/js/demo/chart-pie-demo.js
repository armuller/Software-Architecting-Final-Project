// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

var firebaseConfig = {
  apiKey: "AIzaSyCfJP3rWp_QZw-cnTdunHbhiG_Ms6hrml8",
  authDomain: "final-project-f6408.firebaseapp.com",
  databaseURL: "https://final-project-f6408.firebaseio.com",
  projectId: "final-project-f6408",
  storageBucket: "final-project-f6408.appspot.com",
  messagingSenderId: "321737945642",
  appId: "1:321737945642:web:2c3800f0ff3bb40841c953",
  measurementId: "G-Q52M7VL8WN"
};


if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
  }



// var userPortfolio = getUserPortfolio();
// console.log('user portfolio is')
// console.log(userPortfolio)

function buildPortfolioPie() {
  return (async () => {
    const Portfolio = await getCurrentPortfolioValue();

    if (Portfolio) {
      var stockTickers = Object.keys(Portfolio);
      var totalValue = 0
      for (var i = 0; i<stockTickers.length;i++){
        totalValue += Portfolio[stockTickers[i]]["current_value"];
      }
      var piePercent = []
      var sampleColor = ["rgb(78,115,223)", "rgb(222,78,114)", "rgb(222,186,78)", "rgb(78,222,186)", "rgb(78,187,222)", "rgb(113,78,222)", "rgb(222,78,187)", "rgb(78,222,113)", "rgb(222,113,78)", "rgb(114,222,78)"]
      var sampleHoverColor = ["rgb(88,125,233)", "rgb(232,88,124)", "rgb(232,196,88)", "rgb(88,232,196)", "rgb(88,197,232)", "rgb(123,88,232)", "rgb(232,88,197)", "rgb(88,232,123)", "rgb(232,123,88)", "rgb(124,232,88)"]
      var color = []
      var hoverColor = []
      for (var i = 0; i<stockTickers.length;i++) {
        if (i == sampleColor.length){ 
          break;
        } else {
          piePercent.push(parseFloat((Portfolio[stockTickers[i]]["current_value"]/totalValue*100).toFixed(2)));
          color.push(sampleColor[i]);
          hoverColor.push(sampleHoverColor[i]);
        }
        
        
        // r = Math.floor(Math.random() * 50);
        // g = Math.floor(Math.random() * 100);
        // b = Math.floor(Math.random() * 225);
        // c = 'rgb(' + r + ', ' + g + ', ' + b + ')';
        // h = 'rgb(' + (r+20) + ', ' + (g+20) + ', ' + (b+20) + ')';
        // color.push(c);
        // hoverColor.push(h);
        
      }
    }
    console.log(color);
    console.log(hoverColor);
    return {
      stockTickers,
      piePercent,
      color,
      hoverColor
    };
  })();
}


// Pie Chart Example
firebase.auth().onAuthStateChanged(function(user){
  
  if (user) {
    (async () => {
    
      const graph = await buildPortfolioPie();
      console.log ('pie chart')
      console.log(graph)
      var ct = document.getElementById("myPieChart");
      var myPieChart = new Chart(ct, {
        type: 'doughnut',
        data: {
          labels: graph.stockTickers,
          datasets: [{
            data: graph.piePercent,
            // backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc'],
            // hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf'],
            backgroundColor: graph.color,
            hoverBackgroundColor: graph.hoverColor,
            hoverBorderColor: "rgba(234, 236, 244, 1)",
          }],
        },
        options: {
          maintainAspectRatio: false,
          tooltips: {
            backgroundColor: "rgb(255,255,255)",
            bodyFontColor: "#858796",
            borderColor: '#dddfeb',
            borderWidth: 1,
            xPadding: 15,
            yPadding: 15,
            displayColors: false,
            caretPadding: 10,
          },
          legend: {
            display: false
          },
          cutoutPercentage: 80,
        },
      });

      var legendDiv = document.getElementById("pie_chart_legend");
      var resultString = ``;
      for (let n = 0; n<graph.stockTickers.length; n++){
        resultString += `<span class="mr-2">
        <i class="fas fa-circle text-primary-${n}"></i>${graph.stockTickers[n]}</span>`
      }
      legendDiv.innerHTML = resultString;
    })();
  }
});
