/**
 * Router para la API de gestión de positivos.
 */
const positiveRouter = require('express').Router()
const di = require('../di/AppModule.js') // Inyección de Dependencias (DI)

/* Controlador */ 
const positiveController = di.positiveController()

/**
 * POST
 * Registra un nuevo positivo en el sistema. Almacena las coordenadas
 * recibidas en el body en la base de datos firebase. Devuelve como respuesta
 * el n.º de localizaciones registradas y el ID único del positivo.
 */
positiveRouter.post('/notifyPositive', positiveController.notifyPositive.bind(positiveController))


/**
 * GET
 * Devuelve una lista de positivos que tengan localizaciones registradas
 * en los últimos días indicados con el número de días pasado como 
 * parámetro de Ruta.
 */
positiveRouter.get('/getPositives/:lastDays', positiveController.getPositives.bind(positiveController))

module.exports = {
    positiveRouter
}