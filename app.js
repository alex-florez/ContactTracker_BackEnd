const express = require('express')
const app = express()

// Body Parser para el JSON
app.use(express.json())

// Configuración de FIREBASE
const fbAdmin = require('firebase-admin')
const fbServiceAccount = require('./db/contacttracker-admin-sdk.json')
fbAdmin.initializeApp({
    credential: fbAdmin.credential.cert(fbServiceAccount) 
})

const db = fbAdmin.firestore()

const port = process.env.port || 8080
// const hostname = process.env.WEBSITE_HOSTNAME || 'localhost'

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

app.post('/notifyPositive', (req, res) => {
    console.log(req.body)
    pruebaAdd()
    res.json({
        uploadedLocations: req.body.length
    })
    // res.status(403).send({
    //     code: 403,
    //     message: "Error",
    //     timestamp: Date.now()
    // })
})

app.listen(port, () => {
    console.log(`Server listening at http://${hostname}:${port}`)
})


function pruebaAdd() {
    db.collection("pruebas").add({
        name: "Alejandro",
        age: "21"
    }).then((docRef) => {
        console.log(`Added: ${docRef.id}`)
    }).catch((error) => {
        console.log(`Error adding: ${error}`)
    })
}