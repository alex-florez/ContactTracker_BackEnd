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

/* Reprogramar Cron Tasks establecidas en la configuración */
notificationManager.scheduleNotifications()

const port = process.env.port || 8080
const hostname = 'localhost'

app.listen(port, () => {
    console.log(`Server listening at http://${hostname}:${port}`)
})
