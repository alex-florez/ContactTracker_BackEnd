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

/**
 * GET
 * Devuelve un objeto JSON con los datos estadísticos relativos a los positivos.
 * Esto incluye un recuento con:
 *  - N.º total de positivos.
 *  - N.º de positivos asintomáticos.
 *  - N.º de positivos vacunados.
 */
statisticsRouter.get('/positives', statisticsController.positiveStatistics.bind(statisticsController))

/**
 * GET
 * Devuelve un objeto JSON con los datos estadísticos relativos a las comprobaciones de contactos de riesgo.
 * Esto incluye los siguientes datos:
 *  - Número de comprobaciones realizadas.
 *  - Porcentaje de riesgo medio.
 *  - Tiempo de exposición medio (en milisegundos).
 *  - Proximidad media (en metros).
 */
statisticsRouter.get('/checks', statisticsController.checkStatistics.bind(statisticsController))


/**
 * GET
 * Devuelve un objeto JSON con el número de descargas/instalaciones de la aplicación móvil.
 * Se trata de un dato estadístico virtual, es decir, no representa realmente las descargas de 
 * la aplicación, ya que se calcula teniendo en cuenta la primera vez que se inicia la aplicación.
 */
statisticsRouter.get('/installs', statisticsController.installationStatistics.bind(statisticsController))

module.exports = {
    statisticsRouter
} 