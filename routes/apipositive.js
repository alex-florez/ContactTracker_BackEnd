/**
 * API para gestionar las operaciones relacionadas con los positivos.
 * @param {aplicación express} app 
 * @param {repositorio de localizaciones} locationRepository 
 */
module.exports = function(app, locationRepository) {

    /**
     * POST
     * Registra un nuevo positivo en el sistema. Almacena las coordenadas
     * recibidas en el body en la base de datos firebase.
     */
    app.post('/notifyPositive', (req, res) => {
        locationRepository.addLocations(req.body, (docRef) => {
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
}