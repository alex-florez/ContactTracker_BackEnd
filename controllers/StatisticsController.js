/**
 * Controlador para las peticiones realizadas a la API de Estadísticas.
 */
class StatisticsController {

    constructor(statisticsRepository) {
        this.repository = statisticsRepository // Repositorio de estadísticas.
    }

    /**
     * POST
     * Incrementa en uno el n.º de instalaciones de la aplicación móvil.
     */
    newInstall(req, res) {
        this.repository.registerNewInstall(
            (docRef) => {
                console.log("Nueva instalación registrada.")
                res.json({
                    registered: true,
                    msg: "Instalación registrada."
                })
            },
            (error) => {
                console.log("Error al registrar una instalación.")
                console.log(error)
                res.json({
                    registered: false,
                    msg: "Error al registrar la instalación."
                })
            }
        )
    }
}

module.exports = StatisticsController