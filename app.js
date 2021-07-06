const express = require('express')
const app = express()
var cors = require('cors')
var dateFormat = require('dateformat')

// Body Parser para el JSON
app.use(express.json())

// CORS
app.use(cors())

/* Base de datos firebase */
const db = require('./db/firebase_config.js').config_firebase()

/* Variables Globales */
app.set('dateformatter', dateFormat) // Librería DateFormat

/* Repositorios */
const positiveRepository = require('./repository/positiveRepository.js')
positiveRepository.init(app, db)
const configRepository = require('./repository/configRepository.js')
configRepository.init(db)

//* Routers de la API */
const positiveApi = require('./routes/apipositive.js')(app, positiveRepository)
const configApi = require('./routes/apiconfig.js')(app, configRepository)

const port = process.env.port || 8080
const hostname = 'localhost'

app.listen(port, () => {
    console.log(`Server listening at http://${hostname}:${port}`)
})
