const dateFormat = require('dateformat')
const {parse} = require('date-format-parse')

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
        let positive = req.body
        if(typeof positive === 'undefined' || positive == null || Object.keys(positive).length === 0) {
            res.sendStatus(400)
        } else {
            this.repository.addPositive(positive, (docRef) => {
                console.log(`Nuevo positivo registrado ${docRef.id}`)
                // Respuesta
                res.json({
                    positiveCode: docRef.id, // Código del positivo (ID del documento)
                    uploadedLocations: positive.locations.length // N.º de localizaciones registradas.
                })
            }, (error) => {
                console.log(`Error al insertar positivo: ${error}`)
                res.json({
                    uploadedLocations: 0
                })
            })
        }
    }


    /**
     * GET
     * Devuelve una lista de positivos que tengan localizaciones registradas
     * en los últimos días indicados con el número de días pasado como 
     * parámetro de Ruta, tomando como referencia la fecha objetivo recibida en el 
     * cuerpo de la petición formateada a milisegundos.
     */
    getPositives(req,res) {
        let targetDate = new Date(parseInt(req.params.targetDate))
        let lastDays = parseInt(req.params.lastDays)
        /* Construir el array de fechas */
        let queryDates = []
        for(let i = 0; i <= lastDays; i++) {
            let date = new Date(targetDate.getTime())
            date.setDate(date.getDate() - i) // Restar i días
            queryDates.push(dateFormat(date, "yyyy-mm-dd"))
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


    /**
     * GET
     * Devuelve una lista con todos los positivos notificados desde la aplicación móvil.
     */
    getAllPositives(req, res) {
        this.repository.getAllPositives(positives => {
            res.json(positives)
        }, error => {
            console.log("Error al recuperar todos los positivos.")
            res.json({})
        })
    }

    pruebaGet(req, res) {
        this.repository.pruebaGet(positives => {
            res.json(positives)
        }, error => {
            console.log(error)
            res.json({})
        })
    }
}

module.exports = PositiveController