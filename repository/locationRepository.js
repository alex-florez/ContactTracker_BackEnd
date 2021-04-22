module.exports = {
    db: null, // Instancia de Firestore
    COLLECTION_POSITIVES: 'positives', // Nombre de las colecciones
    init: function(firestore) { // Constructor
        this.db = firestore
    },

    /**
     * Inserta todas las localizaciones pasadas como parámetro
     * en la base de datos. Si hay éxito ejecuta el callback pasado
     * como parámetro.
     * @param {lista de localiaciones} locations 
     * @param {callback de éxito} success
     * @param {callback de fallo} fail
     */
    addLocations: function(locations, success, fail) {
       this.db.collection(this.COLLECTION_POSITIVES).add({
           timestamp: Date.now(),
           positiveLocations: locations
       }).then(docRef => {
           success(docRef)
       }).catch(error => {
           fail(error)
       })
    }

}