const dateFormat = require('dateformat')

/**
 * Controlador para las peticiones realizadas a la API de positivos.
 */
class PositiveController {

    constructor(positiveRepository) {
        this.repository = positiveRepository // Repositorio de positivos
    }

     /**
     * POST
     * Registra un nuevo positivo en el sistema. Almacena las coordenadas
     * recibidas en el body en la base de datos firebase. Devuelve como respuesta
     * el n.º de localizaciones registradas y el ID único del positivo.
     */
    notifyPositive(req, res) {
        this.repository.addPositive(req.body, (docRef) => {
            console.log(`Nuevo positivo registrado ${docRef.id}`)
            // Respuesta
            res.json({
                positiveCode: docRef.id, // Código del positivo (ID del documento)
                uploadedLocations: req.body.locations.length // N.º de localizaciones registradas.
            })
        }, (error) => {
            console.log(`Error al insertar positivo: ${error}`)
            res.json({
                uploadedLocations: 0
            })
        })
    }


    /**
     * GET
     * Devuelve una lista de positivos que tengan localizaciones registradas
     * en los últimos días indicados con el número de días pasado como 
     * parámetro de Ruta.
     */
    getPositives(req,res) {
        let lastDays = parseInt(req.params.lastDays)
        /* Construir el array de fechas */
        let queryDates = []
        let now = new Date() // Fecha actual
        for(let i = 0; i <= lastDays; i++){
            let diff = new Date(new Date().setDate(now.getDate() - i))
            queryDates.push(dateFormat(diff, "yyyy-mm-dd"))
        }
        /* Query para recuperar los positivos que tengan localizaciones en esas fechas.*/
        this.repository.getPositivesWithinDates(queryDates,
            (positives) => { // Éxito
                res.json(positives)
            }, (error) => { // Error
                console.log(`Error al recuperar los Positivos: ${error}`)
                res.json([]) // Enviar un JSON vacío
            })
    }
}

module.exports = PositiveController