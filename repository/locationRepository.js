module.exports = {
    db: null, // Instancia de Firestore
    app: null, // Referencia a la App
    COLLECTION_POSITIVES: 'positives', // Nombre de las colecciones
    init: function(app, firestore) { // Constructor
        this.app = app
        this.db = firestore
    },

    /**
     * Inserta todas las localizaciones pasadas como parámetro
     * en la base de datos. Si hay éxito ejecuta el callback pasado
     * como parámetro.
     * @param {list} locations Lista de objetos de localización. 
     * @param {callback} success Callback de éxito.
     * @param {callback} fail Callback de fallo.
     */
    addLocations: function(locations, success, fail) {
        this.db.collection(this.COLLECTION_POSITIVES).add(locations).then(docRef => {
           success(docRef)
        }).catch(error => {
           fail(error)
        })
    },

    /**
     * Devuelve los positivos que tienen localizaciones registradas
     * en alguna de las fechas pasadas como parámetro en el array
     * de fechas.
     * @param {array} dates Array con las fechas de la query. 
     * @param {callback} success Callback de éxito.
     * @param {callback} fail Callback de fallo.
     */
    getPositivesWithinDates: function(dates, success, fail) {
        this.db.collection(this.COLLECTION_POSITIVES)
            .where('locationDates', 'array-contains-any', dates)
            .get()
            .then(result => {
                let positives = []
                result.forEach(doc => {
                    let positive = doc.data()
                    positive.id = doc.id // Establecer el id del documento
                    positives.push(positive)
                })
                success(positives)
            })
            .catch(fail)
    }
}