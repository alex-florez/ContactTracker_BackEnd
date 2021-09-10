const express = require('express')
var cors = require('cors')

const app = express() // Aplicación Express

const admin = require('firebase-admin') // Admin SDK de Firebase

const notificationManager = require('./di/AppModule.js').notificationManager() // Manager para las notificaciones.

app.use(express.json()) // Body Parser para el JSON
app.use(cors()) // CORS: para habilitar la cabecera Access-Control-Allow-Origin


/* Router para la API REST */
const {API} = require('./routes/api.js')
app.use('/', API)

/* Reprogramar Cron Tasks */
notificationManager.scheduleNotifications()

const port = process.env.port || 8080
const hostname = 'localhost'

app.listen(port, () => {
    console.log(`Server listening at http://${hostname}:${port}`)
})


// Prueba de notificaciones FCM
const msg = {
    notification: {
        title: "Mensaje de FCM",
        body: "Esto es el body de la notificación"
    },
    data: {
        prueba: "Alex"
    },
    topic: "positives"
}

// admin.messaging().send(msg)
//     .then(msgID => {
//         console.log("Mensaje enviado con éxito:", msgID)
//     })
//     .catch(error => {
//         console.log("Error al enviar el mensaje:", error)
//     })