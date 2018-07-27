let express = require('express');
let config = require('./config')
let mercadopago = require('mercadopago')
var bodyParser = require('body-parser');
let admin = require('firebase-admin')
var request = require('request')


var db = admin.firestore().collection('notification-payment')
var dbpayment = admin.firestore().collection('payment')
var dbEvents = admin.firestore().collection('events')

var app = express()
app.use(bodyParser.urlencoded({
    extended: true
}));
//configure credentials API mercado pago 
mercadopago.configure({
    client_id: config.client_id,
    client_secret: config.client_secret
});
//Rutas
app.post('/payment', (req, res, next) => {
    console.log(req.body);
    var data = req.body
    var preference = {
        items: [
            item = {
                id: data.idEvent,
                title: data.name + ' ' + data.idEvent + ' ' + data.email,
                quantity: 1,
                currency_id: 'MXN',
                unit_price: parseFloat(data.price)
            }
        ],
        payer: {
            email: data.email
        }
    };
    mercadopago.preferences.create(preference)
        .then((preference) => {
            console.log(preference.response);
            res.status(200).json({
                ok: true,
                mensaje: 'Datos comprobados correctamente',
                url: preference.response.init_point,
                data: preference.response
            })
            return true
        }).catch((error) => {
            res.status(400).json({
                ok: false,
                mensaje: 'Datos no comprobados correctamente'
            })
        });
});

app.post('/payment-notification', (req, res, next) => {
    res.sendStatus(200)
    let body = req.body

    request(`${body.resource}?access_token=${config.access_token}`, (error, response, bodyComplete) => {

        let bodyData = JSON.parse(bodyComplete)
       
        let separador = " " // un espacio en blanco
        let arregloDeSubCadenas = bodyData.collection.reason.split(separador);
        let numEvent = arregloDeSubCadenas[arregloDeSubCadenas.length - 2];
        let emailUser = arregloDeSubCadenas[arregloDeSubCadenas.length - 1];
        db.get().then(data => {
            data.forEach(paymentEvent => {
                let idBasePayment = paymentEvent.id
                let dataPayment = paymentEvent.data()
                if (dataPayment.email === emailUser) {
                    if (dataPayment.numberEvent === parseInt(numEvent))
                        dataPayment.status = bodyData.collection.status
                    db.doc(idBasePayment).update(dataPayment).then(() => {
                        return true
                    }).catch((error) => {
                    })

                    if (bodyData.collection.status === "pending") {
                        dbpayment.add(bodyData).then(() => {
                            return true
                        }).catch((error) => {
                        })

                        let tempEvent
                        dbEvents.doc(dataPayment.idEvent).get().then(eventSelected => {
                            tempEvent = {}
                            tempEvent = eventSelected.data()
                            if (tempEvent) {
                                if (tempEvent.pallets.length > 0) {
                                    let dataPaymentTemp = []
                                    tempEvent.pallets.forEach(mainData => {
                                        dataPaymentTemp.push(mainData)
                                    });
                                    var getFinishData = dataPaymentTemp[dataPaymentTemp.length - 1]
                                    let dataPallets = [{ 'idUsuario': dataPayment.idUser, 'NoPaleta': parseInt(getFinishData.NoPaleta) + 1 }]
                                    tempEvent.pallets = tempEvent.pallets.concat(dataPallets)

                                    dbEvents.doc(tempEvent.idEvent).update(tempEvent).then(() => {
                                        return true
                                    }).catch((error) =>{
                                    })


                                    dataPayment.pallets = parseInt(getFinishData.NoPaleta) + 1 

                                    db.doc(idBasePayment).update(dataPayment).then(() => {
                                        return true
                                    }).catch((error) => {
                                    })
                                } else {
                                    tempEvent.pallets = [{ 'idUsuario': dataPayment.idUser, 'NoPaleta': 1 }]
                                    dataPayment.pallets =  1
                                    dbEvents.doc(tempEvent.idEvent).update(tempEvent).then(() => {
                                        return true
                                    }).catch((error) =>{
                            
                                    })
                                    db.doc(idBasePayment).update(dataPayment).then(() => {
                                        return true
                                    }).catch((error) => {
                                    })
                                }
                            }
                            return true
                        }).catch((error) =>{

                        })

                    }
                }
            })
            return true;
        }).catch(error => {
        })
    })
}),
    module.exports = app;