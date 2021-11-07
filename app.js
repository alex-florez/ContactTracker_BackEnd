const express = require('express')
var cors = require('cors')
require('dotenv').config({path: `.env.${process.env.NODE_ENV}`}) // Cargar variables de entorno

const firebase = require('firebase-admin')

const app = express() // Aplicación Express

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
const firestore_env = process.env.FIRESTORE_ENV

app.listen(port, () => {
    console.log(`Server listening at http://${hostname}:${port} - Firestore Enviroment: ${firestore_env}`)
})




module.exports = app
