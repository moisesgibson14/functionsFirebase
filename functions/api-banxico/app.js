let express = require('express');
var soap = require('soap');

var app = express()
//Rutas
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'los trabajoder estan corriendo de manera correcta'
    })

});

app.get('/dollar-exchange-rate', (req, res, next) => {

    var url = 'http://www.banxico.org.mx/DgieWSWeb/DgieWS?WSDL';
   
    // soap.createClient(url,(err, client) => {
    //     client.tiposDeCambioBanxico(args,(err, result) => {
    //         console.log(result);
    //     });
        // console.log(client.describe());
        
        // console.log('Result: \n' + JSON.stringify(client.tiposDeCambioBanxico));
        // console.log(client.tiposDeCambioBanxico);
         
//         var method = client['DgieWS']['DgieWSPort']['tiposDeCambioBanxico'];
//   method(requestArgs, function(err, result, envelope, soapHeader) {
//     //response envelope
//     console.log('Response Envelope: \n' + envelope);
//     //'result' is the response body
//     console.log('Result: \n' + JSON.stringify(result));
//   });

    // });
    
    res.status(200).json({
        ok: true,
        mensaje: 'Tipo de cambio en dollar'
    })

});

module.exports = app;