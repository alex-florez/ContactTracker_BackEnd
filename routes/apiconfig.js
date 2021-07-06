/**
 * API para gestionar la configuración del rastreo y 
 * de las comprobaciones de contactos de riesgo.
 * @param {aplicacion express} app 
 * @param {repositorio de configuración} configRepository 
 */
module.exports = function(app, configRepository) {

    /**
     * POST
     * Actualiza la configuración de la notificación de positivos con 
     * los nuevos valores pasados en el BODY de la petición.
     */
    app.post('/updateNotifyConfig', (req, res) => {
        configRepository.updateNotifyConfig(req.body,
            (docRef) => {
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
    })


    /**
     * POST
     * Actualiza la configuración de la comprobación de contactos de 
     * riesgo con los nuevos valores pasados en el BODY de la petición.
     */
    app.post('/updateRiskContactConfig', (req, res) => {
        configRepository.updateRiskContactConfig(req.body,
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
    })

    /**
     * GET
     * Devuelve los parámetros de configuración del fichero de configuración
     * correspondiente al nombre pasado como parámetro de la URL.
     */
    app.get('/config/:fileName', (req, res) => {
        let configFile = req.params.fileName
        configRepository.retrieveConfig(configFile, (configData) => {
            res.json(configData)
        }, (error) => {
            res.json({})
        })
    })
}