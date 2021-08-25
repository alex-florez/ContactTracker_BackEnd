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
        this.repository.registerNewInstall(req.body.timestamp,
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


    /**
     * POST
     * Registra el nuevo resultado de la comproabción en la base de datos.
     */
    newCheckResult(req, res) {
        this.repository.registerRiskContactResult(req.body,
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

module.exports = StatisticsController