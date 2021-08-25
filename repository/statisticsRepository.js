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
     * @param {long} timestamp Fecha y hora en milisegundos en la que se registró la instalación.
     * @param {callback} success Callbnack de éxito.
     * @param {callback} fail Callback de fallo. 
     */
    registerNewInstall(timestamp, success, fail) {
        const array = firebase.firestore.FieldValue.arrayUnion(timestamp)
        this.db.collection(this.COLLECTION_STATISTICS)
            .doc('installations')
            .set({
                installations: array
            }, {merge: true})
            .then(docRef => success(docRef))
            .catch(error => fail(error))
    }


    /**
     * Registra en la base de datos el resultado de la comprobación de riesgo
     * pasado como parámetro.
     * 
     * @param {JSON} result JSON con los datos del resultado. 
     * @param {callback} success Callback de éxito.
     * @param {callback} fail Callback de fallo.
     */
    registerRiskContactResult(result, success, fail) {
        const array = firebase.firestore.FieldValue.arrayUnion(result)
        this.db.collection(this.COLLECTION_STATISTICS)
        .doc('check-results')
        .set({
            results: array
        }, {merge: true})
        .then(docRef => success(docRef))
        .catch(error => fail(error))
    }
}

module.exports = StatisticsRepository