const functions = require('firebase-functions');
const express = require('express')
var bodyParser = require('body-parser')
var admin = require('firebase-admin')

const app = express()
var key = require('./key.json')

admin.initializeApp({
    credential: admin.credential.cert(key)
})

app.use((request,response,next) => {
    response.setHeader('Content-Type', 'application/json');
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    response.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETED,DELETE,OPTIONS')
    next();    
  })

var appRoutes = require('./routes/app')
var routeApi = require('./api-mercadopago/app')
var employees = require('./routes/employeesTES')
var appBanxico  = require('./api-banxico/app')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', appRoutes)
app.use('/api',routeApi)
app.use('/employees', employees)
app.use('/banxico', appBanxico)

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
exports.app = functions.https.onRequest(app);

app.listen(8080, () => {
    console.log(`Escuchando peticiones en el puerto `);
})