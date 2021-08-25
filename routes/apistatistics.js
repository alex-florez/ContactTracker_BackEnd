/**
 * Router para la API de Estadísticas de la App Móvil.
 */

const statisticsRouter = require('express').Router()
const di = require('../di/AppModule.js') // Inyección de dependencias.

/* Controlador */
const statisticsController = di.statisticsController()

/**
 * POST
 * Registra una nueva instalación de la aplicación móvil, incrementando en uno
 * el campo del n.º de instalaciones.
 */
statisticsRouter.post('/registerInstall', statisticsController.newInstall.bind(statisticsController))

/**
 * POST
 * Registra un nuevo resultado de una comprobación realizada por un usuario. Se almacenan
 * en la nube solo los datos principales de la comprobación.
 */
statisticsRouter.post('/registerCheckResult', statisticsController.newCheckResult.bind(statisticsController))

module.exports = {
    statisticsRouter
} 