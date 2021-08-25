const firebase = require('firebase-admin')

/**
 * Repositorio para gestionar las estadísticas de la aplicación.
 */
class StatisticsRepository {

    constructor(db) {
        this.db = db // Referencia a Firestore 
        this.COLLECTION_STATISTICS = "statistics" // Colección con las estadísticas
    }


    /**
     * Registra una nueva instalación de la App móvil, incrementando
     * en uno el campo de instalaciones.
     * 
     * @param {callback} success Callbnack de éxito.
     * @param {callback} fail Callback de fallo. 
     */
    registerNewInstall(success, fail) {
        const increment = firebase.firestore.FieldValue.increment(1)
        this.db.collection(this.COLLECTION_STATISTICS)
            .doc('installations')
            .set({
                numberOfInstallations: increment
            }, {merge: true})
            .then(docRef => success(docRef))
            .catch(error => fail(error))
    }
}

module.exports = StatisticsRepository