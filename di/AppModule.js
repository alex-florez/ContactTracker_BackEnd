const ConfigRepository = require('../repository/ConfigRepository.js')
const ConfigController = require('../controllers/ConfigController.js')

const PositiveRepository = require('../repository/PositiveRepository.js')
const PositiveController = require('../controllers/PositiveController.js')

const StatisticsRepository = require('../repository/statisticsRepository.js')
const StatisticsController = require('../controllers/StatisticsController.js')

const NotificationManager = require('../notifications/NotificationManager.js')

// Configuración del SDK Admin para la base de datos Firestore de Firebase
const db = require('../db/firebase_config.js').config_firebase()

// Instancias de las dependencias
// ******************************

// Repositorios
configRepositoryInstance = null
positiveRepositoryInstance = null
statisticsRepositoryInstance = null

// Controladores
configControllerInstance = null
positiveControllerInstance = null
statisticsControllerInstance = null

// Managers
notificationManagerInstance = null

/**
 * Módulo de Inyección de Dependencias (DI) para la aplicación.
 */
module.exports = {

    /* Repositorios */
    configRepository: function() {
        if(configRepositoryInstance == null){
            configRepositoryInstance = new ConfigRepository(db)
        }
        return configRepositoryInstance
    },

    positiveRepository: function() {
        if(positiveRepositoryInstance == null){
            positiveRepositoryInstance = new PositiveRepository(db)
        }
        return positiveRepositoryInstance
    },

    statisticsRepository: function() {
        if(statisticsRepositoryInstance == null) {
            statisticsRepositoryInstance = new StatisticsRepository(db)
        }
        return statisticsRepositoryInstance
    },

    /* Controllers */
    configController: function() {
        if(configControllerInstance == null){
            configControllerInstance = new ConfigController(this.configRepository(), this.notificationManager())
        }
        return configControllerInstance
    },

    positiveController: function() {
        if(positiveControllerInstance == null){
            positiveControllerInstance = new PositiveController(this.positiveRepository())
        }
        return positiveControllerInstance
    },

    statisticsController: function() {
        if(statisticsControllerInstance == null) {
            statisticsControllerInstance = new StatisticsController(this.statisticsRepository())
        }
        return statisticsControllerInstance
    },

    /* Manager de Notificaciones */
    notificationManager: function() {
        if(notificationManagerInstance == null) {
            notificationManagerInstance = new NotificationManager(this.positiveRepository(), this.configRepository())
        }
        return notificationManagerInstance
    }
}