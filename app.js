const express = require('express')
const app = express()

// Body Parser para el JSON
app.use(express.json())

// Configuración de FIREBASE
// const fbAdmin = require('firebase-admin')
// const fbServiceAccount = require('./db/contacttracker-admin-sdk.json')
// fbAdmin.initializeApp({
//     credential: fbAdmin.credential.cert(fbServiceAccount) 
// })

// Base de datos firebase
const db = require('./db/firebase_config.js').config_firebase()

// Repositorios
const locationRepository = require('./repository/locationRepository.js')
locationRepository.init(db)

// Routers
const positiveApi = require('./routes/apipositive.js')(app, locationRepository)

const port = process.env.port || 8080
const hostname = 'localhost'

app.get('/', (req, res) => {
    res.send("Hello World!! from Node.js Server 2.1")
})

app.get('/hola', (req, res) => {
    res.send("Hola mundo!")
})

app.get('/res/:id', (req, res) => {
    res.send(`Accediendo al recurso ${req.params.id}`)
})


app.get('/getPositivo', (req,res) => {
    console.log("get prueba invocado")
    // res.json({
    //     positiveID: '199',
    //     prueba: "esto es una prueba"
    // })
    res.status(404).send({
        code: 405,
        message: "No existe el recurso.",
        timestamp: Date.now()
    })
})


app.listen(port, () => {
    console.log(`Server listening at http://${hostname}:${port}`)
})
