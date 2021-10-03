/**
 * Controlador para las peticiones realizadas a la API de configuración.
 */
class ConfigController {

    constructor(configRepository, notificationManager) {
        this.repository = configRepository // Repositorio de configuración
        this.notificationManager = notificationManager // Manager de notificaciones.
    }

    /**
     * Actualiza la configuración de la Notificación de Positivos.
     * @param {object} req Petición
     * @param {object} res Respuesta
     */
    updateNotifyConfig(req, res) {
        let newConfig = req.body
        if(typeof newConfig === 'undefined' || newConfig == null || Object.keys(newConfig).length === 0) {
            res.sendStatus(400)
        } else {
            this.repository.updateNotifyConfig(newConfig,
                (docRef) => {
                    /* Actualizar alarmas de notificaciones */
                    this.notificationManager.schedulePositivesNotifications(newConfig.positivesNotificationTime)
                    res.json({
                        updated: true,
                        msg: 'Configuración actualizada correctamente.'
                    })
                }, (error) => {
                    console.log(`Error al actualizar la configuración de la notificación de positivos: ${error}`)
                    res.json({
                        updated: false,
                        msg: 'Ha habido un error al actualizar la configuracion de la notificación de positivos.'
                    })
                })
        }
    }

    /**
     * Actualiza la configuración de la comprobación de contactos de riesgo.
     * @param {object} req Petición
     * @param {object} res Respuesta
     */
    updateRiskContactConfig(req, res) {
        let newConfig = req.body
        if(typeof newConfig === 'undefined' || newConfig == null || Object.keys(newConfig).length === 0) {
            res.sendStatus(400)
        } else {
            this.repository.updateRiskContactConfig(newConfig,
                (docRef) => {
                    res.json({
                        updated: true,
                        msg: 'Configuración actualizada correctamente.'
                    })
                }, (error) => {
                    console.log(`Error al actualizar la configuración de la comprobación: ${error}`)
                    res.json({
                        updated: false,
                        msg: 'Ha habido un error al actualizar la configuración de la comprobación.'
                    })
                })
        }
    }

    /**
     * Recupera y devuelve los valores de la configuración 
     * almacenados en el fichero recibido como parámetro de la petición.
     * @param {object} req Petición
     * @param {object} res Respuesta
     */
    getConfig(req, res) {
        let configFile = req.params.fileName
        this.repository.retrieveConfig(configFile, (configData) => {
            if(configData == null || Object.keys(configData).length === 0){
                res.sendStatus(404)
            } else {
                res.json(configData)
            }
        }, (error) => {
            res.json({})
        })
    }
}

module.exports = ConfigController