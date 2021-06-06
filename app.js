const express = require('express')
const app = express()
var cors = require('cors')

// Body Parser para el JSON
app.use(express.json())

// CORS
app.use(cors())

// Base de datos firebase
const db = require('./db/firebase_config.js').config_firebase()

// Repositorios
const locationRepository = require('./repository/locationRepository.js')
locationRepository.init(db)
const configRepository = require('./repository/configRepository.js')
configRepository.init(db)

// Routers de la API
const positiveApi = require('./routes/apipositive.js')(app, locationRepository)
const configApi = require('./routes/apiconfig.js')(app, configRepository)

const port = process.env.port || 8080
const hostname = 'localhost'

// app.get('/getPositivo', (req,res) => {
//     console.log("get prueba invocado")
//     // res.json({
//     //     positiveID: '199',
//     //     prueba: "esto es una prueba"
//     // })
//     res.status(404).send({
//         code: 405,
//         message: "No existe el recurso.",
//         timestamp: Date.now()
//     })
// })

app.listen(port, () => {
    console.log(`Server listening at http://${hostname}:${port}`)
})
