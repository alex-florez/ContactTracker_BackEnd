/**
 * Controlador para las peticiones realizadas a la API de Estadísticas.
 */
class StatisticsController {

    constructor(statisticsRepository) {
        this.repository = statisticsRepository // Repositorio de estadísticas.
    }

    /**
     * POST
     * Registra la nueva instalación de la app en la base de datos.
     */
    newInstall(req, res) {
        let install = req.body
        if(typeof install === 'undefined' || install == null || Object.keys(install).length === 0) {
            res.sendStatus(400)
        } else {
            this.repository.registerNewInstall(install.timestamp,
                (docRef) => {
                    console.log("Nueva instalación registrada.")
                    res.json({
                        registered: true,
                        msg: "Instalación registrada."
                    })
                },
                (error) => {
                    console.log("Error al registrar una instalación.")
                    res.json({
                        registered: false,
                        msg: "Error al registrar la instalación."
                    })
                }
            )
        }
    }

    /**
     * POST
     * Registra el nuevo resultado de la comproabción en la base de datos.
     */
    newCheckResult(req, res) {
        let result = req.body
        if(typeof result === 'undefined' || result == null || Object.keys(result).length === 0) {
            res.sendStatus(400)
        } else {
            this.repository.registerRiskContactResult(result,
                (docRef) => {
                    console.log("Resultado de la comprobación registrado.")
                    res.json({
                        registered: true,
                        msg: "Resultado de la comprobación registrado."
                    })
                }, (error) => {
                    console.log("Error al registrar el resultado de la comprobación.")
                    res.json({
                        registered: false,
                        msg: "Error al registrar el resultado de la comprobación."
                    })
                })
        }
    }

    /**
     * GET
     * Devuelve en la respuesta un objeto JSON con los datos estadísticos 
     * relacionados con la notificación de positivos.
     */
    positiveStatistics(req, res) {
        let targetDate = new Date(parseInt(req.params.targetDate))
        this.repository.getPositivesStatistics(targetDate, req.params.lastDays, data => {
            res.json(data)
        }, error => {
            console.log("Error al calcular las estadísticas de positivos.")
            res.json({})
        })
    }

    /**
     * GET
     * Devuelve un objeto JSON con los datos estadísticos relacionados
     * con la comprobación de contactos de riesgo.
     */
    checkStatistics(req, res) {
        let targetDate = new Date(parseInt(req.params.targetDate))
        this.repository.getChecksStatistics(targetDate, req.params.lastDays, data => {
            res.json(data)
        }, error => {
            console.log(`Error al calcular las estadísticas de comprobaciones: ${error}`)
            res.json({})
        })
    }

    /**
     * GET 
     * Devuelve el número de instalaciones de la aplicación móvil.
     */
    installationStatistics(req, res) {
        let targetDate = new Date(parseInt(req.params.targetDate))
        this.repository.getInstalls(targetDate, req.params.lastDays, numberOfInstalls => {
            res.json({
                installCount: numberOfInstalls
            })
        }, error => {
            console.log("Error al recuperar el número de instalaciones.")
            res.json({
                installCount: 0
            })
        })
    }
}

module.exports = StatisticsController