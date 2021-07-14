/**
 * Define un Router para la API Rest expuesta por el Backend.
 */
const API = require('express').Router()

const {configRouter} = require('./apiconfig') // Router para la Configuración
const {positiveRouter} = require('./apipositive.js') // Router para los Positivos

// Declaración de las rutas.
API.use('/config', configRouter)
API.use('/positive', positiveRouter)

module.exports = {
    API
}