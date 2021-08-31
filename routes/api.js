/**
 * Define un Router para la API Rest expuesta por el Backend.
 */
const API = require('express').Router()

const {configRouter} = require('./apiconfig') // Router para la Configuración
const {positiveRouter} = require('./apipositive.js') // Router para los Positivos
const {statisticsRouter} = require('./apistatistics.js') // Router para las Estadísticas

// Declaración de las rutas.
API.use('/config', configRouter)
API.use('/positive', positiveRouter)
API.use('/statistics', statisticsRouter)

module.exports = {
    API
}