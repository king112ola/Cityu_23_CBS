
/**######################################### algorithm Init state #########################################*/
// Init constant e.g.

const period = 24
const priceElements = 4
const BTC_TO_HKD_Rate = 170222.53
let accepted_Range_For_standard_Deviation = 80;

// // Convert BTC to HKD
// function convertBTCToHKD(price_INBTC) {
//   return price_INBTC * BTC_TO_HKD_Rate
// }

// // Convert BTC to HKD
// function convertHKDToBTC(price_INHKD) {
//   return price_INHKD / BTC_TO_HKD_Rate
// }

// Init StandardDeviation method
function getStandardDeviation(array) {
  const n = array.length
  const mean = array.reduce((a, b) => a + b) / n
  return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
}

const CBS_Algorithm = (product_Price) => {

  // Reading the Hourly AAVE/BTC from Excel doc. that was pull from the bitstamp https://www.cryptodatadownload.com/data/bitstamp/
  let XLSX = require("xlsx");
  let AAVEBTC_WORKBOOK = XLSX.readFile('./assets/Bitstamp_BTCUSDT_1h.csv')
  let AAVEBTC_WORKSHEET = AAVEBTC_WORKBOOK.Sheets[AAVEBTC_WORKBOOK.SheetNames[0]]

  // Create the total avger from all the 24 hrs average pricing
  let totalAvg_In_Period = 0;

  // Create dataset variable for the algorithm
  let dataset = [];

  for (let index = 2; index < period; index++) {
    const dates_In_Period = AAVEBTC_WORKSHEET[`B${index}`].v
    const openPrice = (AAVEBTC_WORKSHEET[`D${index}`].v) * 7.85
    const HighPrice = (AAVEBTC_WORKSHEET[`E${index}`].v) * 7.85
    const lowPrice = (AAVEBTC_WORKSHEET[`F${index}`].v) * 7.85
    const closePrice = (AAVEBTC_WORKSHEET[`G${index}`].v) * 7.85

    // Compute the average of the four price
    const averagePrice = (openPrice + HighPrice + lowPrice + closePrice) / priceElements

    // Add to data set
    dataset.push({ dates_In_Period, openPrice, HighPrice, lowPrice, closePrice, averagePrice })
  }

  // Find the total average amount, @Important, this is the suggested price after multiplyed by the porduct price
  totalAvg_In_Period = dataset.map((element) => element.averagePrice).reduce((firstElement, secondElement) => firstElement + secondElement, 0) / period



  // cultivate the totalAvg_In_Period with the actual price 
  totalAvg_In_Period = (totalAvg_In_Period / BTC_TO_HKD_Rate) * product_Price

  // Find the standard deviation
  let standard_Deviation = getStandardDeviation(dataset.map((element) => element.averagePrice))
  standard_Deviation = standard_Deviation / 7.85


  // Finsal state


  // Check if the standard_Deviation exceeds the limit of our self calced standard_Deviation range
  if (standard_Deviation > accepted_Range_For_standard_Deviation) {
    // reject showing suggested price
    console.log("This transaction has been decliend");
    return "Unavilable"
  }
  else {// if the standard_Deviation passed our limit range // give suggested price
    totalAvg_In_Period += totalAvg_In_Period * 0.05
    console.log("This transaction has been accepted");
    return totalAvg_In_Period
  }
}


/**######################################### algorithm Unmount state #########################################*/




/**######################################### Express Browser Init state #########################################*/
const express = require('express')
const app = express()
const port = 3012
const path = require('path')
const bodyParser = require('body-parser');



app.use('/front-end', express.static(path.join("../", 'front-end')))

app.use(bodyParser.json());

app.get('/',(req,res)=>{
res.redirect("/front-end");
})

// Define Aip
app.post('/api/v1/get-suggested-price', (req, res) => {
  let product_Price = req.body.productPrice_INBTC;
  product_Price = product_Price

  let suggested_Price_INBTC = CBS_Algorithm(product_Price)

  res.send({ suggested_Price: suggested_Price_INBTC })
})

app.post('/api/v1/disaster-mode-toggle', (req, res) => {
  accepted_Range_For_standard_Deviation = - accepted_Range_For_standard_Deviation
  res.send({}) // return only empty object since only toggle is needed
})



// Listen
app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})




/**######################################### Express Browser End state #########################################*/



