let express = require('express');
let admin = require('firebase-admin')

var app = express()
var db = admin.firestore()

//Rutas
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'los trabajoder estan corriendo de manera correcta'
    })

});

app.post('/newEmploye', (req, res, next) => {

    var body = req.body

    admin.auth().createUser(body)
        .then((userRecord) => {
            // See the UserRecord reference doc for the contents of userRecord.
            console.log("Successfully created new user:", userRecord.uid);
            res.status(200).json({
                ok: true,
                mensaje: 'el suaurio es',
                uid: userRecord.uid
            })

            return true;
        })
        .catch((error) => {
            console.log("Error creating new user:", error);
            res.status(404).json({
                ok: false,
                mensaje: 'Error de base de datos ',
                error: error
            })
        });
})

app.post('/deleteEmploye', (req, res, next) => {
    var body = req.body

    admin.auth().deleteUser(body.id)
        .then((userRecord) => {
            // See the UserRecord reference doc for the contents of userRecord.
            res.status(200).json({
                ok: true,
                mensaje: 'se elimino al usuario',
                id: body.id
            })

            return true;
        })
        .catch((error) => {
            console.log("Error creating new user:", error);
            res.status(404).json({
                ok: false,
                mensaje: 'Error de base de datos ',
                empleado: error,
                id: body.id
            })
        });
})

app.put('/updateEmploye', (req, res, next) => {
    var body = req.body

    admin.auth().updateUser(body.uid, body.user).then(user => {
        res.status(200).json({
            ok: true,
            mensaje: 'se actualizo al usuario',
            empleado: user
        })

        return true;
    }).catch(error => {
        res.status(404).json({
            ok: false,
            mensaje: 'Error al actializar al usuario',
            error: error
        })
    })
})

module.exports = app;