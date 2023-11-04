const express = require("express");
const app = express();
const cors = require('cors')
const regression = require('regression')
const csvFilePath = './data/carbon2.csv' // Resource.csv in your case
const gasCsv = './data/carbon_gas.csv'
const csv = require('csvtojson') // Make sure you have this line in order to call functions from this modules

// const result = regression.linear(carbonData);
// console.log(result)
// const gradient = result.equation[0];
// const yIntercept = result.equation[1];
// const useful_points = result.points.map(([x, y]) => {
//     return result.predict(x)
//     // return y;    
//     // or {x, y}, depending on whether you just want y-coords for a 'linear' plot
//     // or x&y for a 'scatterplot'
// })
// x is electricity bill y is no. of people in household predict line on chart
// console.log(useful_points)
// // console.log(gradient, yIntercept)
// console.log(result.predict(32))
app.use(express.json());
app.use(cors());



app.get('/api/v1/carbon-electricity', (req, res) => {
    let chartData = []
    let predictLine = []
    csv({ noheader: true, output: "csv" }).fromFile(csvFilePath).then((jsonObj) => {
        carbonData = jsonObj.map(item => {

            return item.map(Number)
        })
        console.log(carbonData)
        let obj = {}
        chartObj = carbonData.map(item => {
            obj = { x: item[0], y: item[1] }
            chartData.push(obj)
        })


        result = regression.linear(carbonData, {
            order: 1,
            precision: 2,
        },)
        // console.log(result.predict(25))
        const gradient = result.equation[0];
        const yIntercept = result.equation[1];
        // console.log(result,gradient, yIntercept)
        console.log(chartData)
        let pts = {}
        chartObj = result.points.map(item => {
            pts = { x: item[0], y: item[1] }
            predictLine.push(pts)
        })
        // res.status(200).json({result: result.points, data:chartData})
        res.status(200).json({ result: predictLine, data: chartData, gradient, yIntercept })
    })
})
app.get('/api/v1/carbon-gas', (req, res) => {
    let chartData = []
    let predictLine = []
    csv({ noheader: true, output: "csv" }).fromFile(gasCsv).then((jsonObj) => {
        gasData = jsonObj.map(item => {

            return item.map(Number)
        })

        let obj = {}
        chartObj = gasData.map(item => {
            obj = { x: item[0], y: item[1] }
            chartData.push(obj)
        })


        resultGas = regression.linear(gasData, {
            order: 1,
            precision: 2,
        },)
        // console.log(result.equation[0], result.equation[1])
        const gradient = resultGas.equation[0];
        const yIntercept = resultGas.equation[1];
        // console.log(result,gradient, yIntercept)

        let pts = {}
        chartObj = resultGas.points.map(item => {
            pts = { x: item[0], y: item[1] }
            predictLine.push(pts)
        })
        // res.status(200).json({result: result.points, data:chartData})
        res.status(200).json({ result: predictLine, data: chartData, gradient, yIntercept })
    })
})

app.post('/api/v1/predict', async (req, res, next) => {
    if (req.body.type === 'electricity') {
        csv({ noheader: true, output: "csv" }).fromFile(csvFilePath).then((jsonObj) => {
            carbonData = jsonObj.map(item => {
                return item.map(Number)
            })
            result = regression.linear(carbonData,  {
                order: 3,
                precision: 4,
            })
            predict = result.predict(req.body.value)

            return res.status(201).json({
                success: true,
                predict,
            })
        })
    }
    else {
        csv({ noheader: true, output: "csv" }).fromFile(gasCsv).then((jsonObj) => {
            carbonData = jsonObj.map(item => {
                return item.map(Number)
            })
            result = regression.linear(carbonData)
            predict = result.predict(req.body.value)

            return res.status(201).json({
                success: true,
                predict,
            })
        })
    }
    // res.status(400).json({message: "no data available", })


})
app.listen(8080, () => {
    console.log("server is running http://localhost:8080");
});