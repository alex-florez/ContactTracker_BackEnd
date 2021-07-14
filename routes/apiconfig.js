/**
 * Router para la API de gestión de la configuración del rastreo, la notificación
 * de positivos y la comprobación de contactos de riesgo.
 */
const configRouter = require('express').Router()
const di = require('../di/AppModule.js') // Inyección de Dependencias (DI)

/* Controlador */
const configController = di.configController()

/**
 * GET
 * Devuelve los parámetros de configuración del fichero de configuración
 * correspondiente al nombre pasado como parámetro de la URL.
 */
 configRouter.get('/:fileName', configController.getConfig.bind(configController))

/**
 * POST
 * Actualiza la configuración de la notificación de positivos con 
 * los nuevos valores pasados en el BODY de la petición.
 */
configRouter.post('/updateNotifyConfig', configController.updateNotifyConfig.bind(configController))

/**
 * POST
 * Actualiza la configuración de la comprobación de contactos de 
 * riesgo con los nuevos valores pasados en el BODY de la petición.
 */
configRouter.post('/updateRiskContactConfig', configController.updateRiskContactConfig.bind(configController))

module.exports = {
    configRouter
}