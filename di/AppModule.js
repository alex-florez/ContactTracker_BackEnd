const ConfigRepository = require('../repository/ConfigRepository.js')
const ConfigController = require('../controllers/ConfigController.js')

const PositiveRepository = require('../repository/PositiveRepository.js')
const PositiveController = require('../controllers/PositiveController.js')


// Configuración del SDK Admin para la base de datos Firebase
const db = require('../db/firebase_config.js').config_firebase()

// Instancias de las dependencias
// ******************************

// Repositorios
configRepositoryInstance = null
positiveRepositoryInstance = null

// Controladores
configControllerInstance = null
positiveControllerInstance = null


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

    /* Controllers */
    configController: function() {
        if(configRepositoryInstance == null){
            configRepositoryInstance = new ConfigController(this.configRepository())
        }
        return configRepositoryInstance
    },

    positiveController: function() {
        if(positiveControllerInstance == null){
            positiveControllerInstance = new PositiveController(this.positiveRepository())
        }
        return positiveControllerInstance
    }
}