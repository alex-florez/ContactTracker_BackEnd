const firebase = require('firebase-admin')

/**
 * Repositorio para gestionar las estadísticas de la aplicación.
 */
class StatisticsRepository {

    constructor(db) {
        this.db = db // Referencia a Firestore 
        this.COLLECTION_STATISTICS = "statistics" // Colección con las estadísticas
        this.COLLECTION_POSITIVES = "positives" // Colección con los positivos
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

    /**
     * Calcula las estadísticas relacionadas con los positivos y devuelve en el
     * callback de éxito un JSON con los datos estadísticos correspondientes:
     *  - Número de positivos notificados.
     *  - Recuento de vacunados y no vacunados.
     *  - Recuento de asintomáticos y con síntomas.
     * 
     * Si surge algún error devuelve el error concreto en el callback de fallo.
     * 
     * @param {callback} success Callback de éxito. 
     * @param {callback} fail Callback de fallo.
     */
    getPositivesStatistics(success, fail) {
        this.db.collection(this.COLLECTION_POSITIVES)
        .get()
        .then(result => {
            // Crear array de positivos
            let positives = []
            result.forEach(doc => {
                positives.push(doc.data())
            })
            // Realizar el recuento
            let asymptomatics = positives.filter(p => p.asymptomatic == true).length
            let vaccinated = positives.filter(p => p.vaccinated == true).length

            success({
                positiveCount: positives.length,
                asymptomaticCount: asymptomatics,
                vaccinatedCount: vaccinated 
            })
        })
        .catch(error => fail(error))
    }

    /**
     * Devuelve en el callback de éxito los datos estadísticos relacionados
     * con la comprobación de contactos de riesgo. Calcula los siguientes datos:
     *  - N.º de comprobaciones realizadas.
     *  - Porcentaje de riesgo medio.
     *  - Tiempo de exposición (en milisegundos).
     *  - Proximidad media (en metros).
     * 
     * Si surge algún error devuelve el error concreto en el callback de fallo.
     * 
     * @param {callback} success Callback de éxito.
     * @param {callback} fail Callback de fallo.
     */
    getChecksStatistics(success, fail) {
        this.db.collection(this.COLLECTION_STATISTICS)
        .doc('check-results')
        .get()
        .then(doc => {
            let results = doc.data().results
            if(results == null || results.length == 0){
                success({
                    checkCount: 0,
                    risk: 0,
                    exposeTime: 0,
                    proximity: 0
                })
            } else {
                // Calcular las medias
                let riskSum = results.reduce((acc, r) => acc.riskPercent + r.riskPercent)
                let exposeTimeSum = results.reduce((acc, r) => acc.exposeTime + r.exposeTime)
                let proximitySum = results.reduce((acc, r) => acc.proximity + r.proximity)
                let n = results.length
                
                success({
                    checkCount: n,
                    risk: riskSum / n,
                    exposeTime: exposeTimeSum / n,
                    proximity: proximitySum / n
                })
            }
        })
        .catch(error => fail(error))
    }

    /**
     * Devuelve el número de descargas de la aplicación móvil.
     * 
     * @param {callback} success Callback de éxito.
     * @param {callback} fail Callback de fallo.
     */
    getInstalls(success, fail) {
        this.db.collection(this.COLLECTION_STATISTICS)
        .doc('installations')
        .get()
        .then(doc => {
            let installations = doc.data().installations
            if(typeof installations == 'undefined' || installations == null) {
                success(0)
            } else {
                success(installations.length)
            }
        })
        .catch(error => fail(error))
    }

}

module.exports = StatisticsRepository