let express = require('express');
let admin = require('firebase-admin')

var app = express()
var db = admin.firestore()

//Rutas
app.get('/hola', (req, res, next) => {

    res.status(200).json({
        ok: true,
        mensaje: 'La API esta corriendo de manera correcta'
    })

});

app.get('/getUsers', (req, res, next) =>{
    db.collection('usersTES').get().then( data =>{
        let users = []

        data.forEach(user =>{
            users = users.concat(user.data());
        })
        res.status(200).json({
            ok:true,
            mensaje: 'usuarios traidos con exito',
            users: users
        })

        return true;

    }).catch( error =>{
        res.status(404).json({
            ok:false,
            mensaje: 'error al llamar usuario'
        })
    })
})
module.exports = app;