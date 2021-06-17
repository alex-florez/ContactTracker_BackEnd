/**
 * API para gestionar las operaciones relacionadas con los positivos.
 * @param {aplicación express} app 
 * @param {repositorio de positivos} positiveRepository 
 */
module.exports = function(app, positiveRepository) {

    /**
     * POST
     * Registra un nuevo positivo en el sistema. Almacena las coordenadas
     * recibidas en el body en la base de datos firebase.
     */
    app.post('/notifyPositive', (req, res) => {
        console.log(req.body)
        positiveRepository.addPositive(req.body, (docRef) => {
            console.log(`Nuevo positivo registrado ${docRef.id}`)
            res.json({
                uploadedLocations: req.body.locations.length
            })
        }, (error) => {
            console.log(`Error al insertar positivo: ${error}`)
            res.json({
                uploadedLocations: 0
            })
        })
    })


    /**
     * GET
     * Devuelve una lista de positivos que tengan localizaciones registradas
     * en los últimos días indicados con el número de días pasado como 
     * parámetro de Ruta.
     */
    app.get('/getPositives/:lastDays', (req,res) => {
        let lastDays = parseInt(req.params.lastDays)
        /* Construir el array de fechas */
        let queryDates = []
        let now = new Date() // Fecha actual
        for(let i = 0; i <= lastDays; i++){
            let diff = new Date(new Date().setDate(now.getDate() - i))
            queryDates.push(app.get('dateformatter')(diff, "yyyy-mm-dd"))
        }
        /* Query para recuperar los positivos que tengan localizaciones en esas fechas.*/
        positiveRepository.getPositivesWithinDates(queryDates,
            (positives) => { // Éxito
                res.json(positives)
            }, (error) => { // Error
                console.log(`Error al recuperar los Positivos: ${error}`)
                res.json([]) // Enviar un JSON vacío
            })
    })
}