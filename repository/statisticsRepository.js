const firebase = require('firebase-admin')

/**
 * Recibe como parámetro un número de días y devuelve
 * el rango con la fecha de inicio y de fin correspondiente al día de
 * hoy menos el número de días indicado.
 * 
 * Días especiales:
 *  > 0: se corresponde con el día de hoy.
 *  > -1: se corresponde con infinito (todos los valores existentes)
 */
function getFilterDates(targetDate, lastDays) {
    let now = targetDate
    if(lastDays == 0) {
        let startDate = new Date(now)
        startDate.setHours(0,0,0)
        now.setHours(24,0,0)
        return [startDate, now]
    } else if(lastDays == -1) {
        return []
    } else {
        let startDate = new Date(now)
        startDate.setDate(startDate.getDate() - lastDays) // Restar los días
        now.setHours(24,0,0) // Hasta el final del día de hoy
        startDate.setHours(0,0,0) // Desde el inicio del primer día
        return [startDate, now]
    }
}

/**
 * Repositorio para gestionar las estadísticas de la aplicación.
 */
class StatisticsRepository {

    constructor(db) {
        this.db = db // Referencia a Firestore 
        this.COLLECTION_STATISTICS = `${process.env.FIRESTORE_ENV}/statistics` // Colección con las estadísticas
        this.COLLECTION_POSITIVES = `${process.env.FIRESTORE_ENV}/positives` // Colección con los positivos
    }


    /**
     * Registra una nueva instalación de la App móvil, incrementando
     * en uno el campo de instalaciones.
     * 
     * @param {long} millis Fecha y hora en milisegundos en la que se registró la instalación.
     * @param {callback} success Callbnack de éxito.
     * @param {callback} fail Callback de fallo. 
     */
    registerNewInstall(millis, success, fail) {
        // Convertir milisegundos a timestamp
        let timestamp = firebase.firestore.Timestamp.fromMillis(millis)
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
        // Convertir milisegundos a timestamp de firestore
        let timestamp = firebase.firestore.Timestamp.fromMillis(result.timestamp)
        result.timestamp = timestamp
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
     * Calcula las estadísticas relacionadas con los positivos NOTIFICADOS en los 
     * últimos días indicados como parámetro y devuelve en el callback de éxito un 
     * JSON con los datos estadísticos correspondientes:
     *  - Número de positivos notificados.
     *  - Recuento de vacunados y no vacunados.
     *  - Recuento de asintomáticos y con síntomas.
     * 
     * Si surge algún error devuelve el error concreto en el callback de fallo.
     * 
     * @param {date} targetDate Fecha de referencia.
     * @param {number} lastDays N.º de días a tener en cuenta para recuperar las estadísticas.
     * @param {callback} success Callback de éxito. 
     * @param {callback} fail Callback de fallo.
     */
    getPositivesStatistics(targetDate, lastDays, success, fail) {
        // Filtro de fechas
        let dates = getFilterDates(targetDate, lastDays)
        console.log(dates.map(d => d.toLocaleString()))
        // Callback de procesamiento de los positivos
        let callback = (positives) => {
            // Realizar el recuento
            let asymptomatics = positives.filter(p => p.asymptomatic == true).length
            let vaccinated = positives.filter(p => p.vaccinated == true).length

            success({
                positiveCount: positives.length,
                asymptomaticCount: asymptomatics,
                vaccinatedCount: vaccinated 
            })
        }
        if(dates.length > 0) {
            this.db.collection(this.COLLECTION_POSITIVES)
            .where('timestamp', '>=', dates[0].getTime())
            .where('timestamp', '<=', dates[1].getTime())
            .get()
            .then(result => {
                // Crear array de positivos
                let positives = []
                result.forEach(doc => {
                    positives.push(doc.data())
                })
                callback(positives)
            }).catch(error => fail(error))
        } else {
            this.db.collection(this.COLLECTION_POSITIVES)
            .get()
            .then(result => {
                // Crear array de positivos
                let positives = []
                result.forEach(doc => {
                    positives.push(doc.data())
                })
                callback(positives)
            })
            .catch(error => fail(error))
        }
    }

    /**
     * Devuelve en el callback de éxito los datos estadísticos relacionados
     * con la comprobación de contactos de riesgo de los resultados registrados
     * en los últimos días indicados como parámetro. Calcula los siguientes datos:
     *  - N.º de comprobaciones realizadas.
     *  - Porcentaje de riesgo medio.
     *  - Tiempo de exposición (en milisegundos).
     *  - Proximidad media (en metros).
     * 
     * Si surge algún error devuelve el error concreto en el callback de fallo.
     * 
     * @param {date} targetDate Fecha de referencia.
     * @param {number} lastDays Días utilizados para filtrar.
     * @param {callback} success Callback de éxito.
     * @param {callback} fail Callback de fallo.
     */
    getChecksStatistics(targetDate, lastDays,success, fail) {
        // Filtro de fecha
        let dates = getFilterDates(targetDate, lastDays)
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
                if(dates.length > 0){ // Con filtro de fechas
                    results = results.filter(r => 
                        r.timestamp.toDate().getTime() >= dates[0].getTime() 
                        && r.timestamp.toDate().getTime() <= dates[1].getTime())
                }
                 // Calcular las medias
                 let riskSum = results.reduce((acc, r) => acc + r.riskPercent, 0)
                 let exposeTimeSum = results.reduce((acc, r) => acc + r.exposeTime, 0)
                 let proximitySum = results.reduce((acc, r) => acc + r.proximity, 0)
                 let n = results.length

                 success({
                     checkCount: n,
                     risk: Math.round((riskSum / n) * 100) / 100, // Redondear con 2 decimales
                     exposeTime: exposeTimeSum / n,
                     proximity: Math.round((proximitySum / n) * 1000) / 1000 // Redondear con 3 decimales. 
                 })
            }
        })
        .catch(error => fail(error))
    }

    /**
     * Devuelve el número de descargas de la aplicación móvil, registradas
     * en los últimos X días, siendo X los días indicados como parámetro.
     * 
     * @param {date} targetDate Fecha de referencia.
     * @param {number} lastDays Días utilizados para filtrar.
     * @param {callback} success Callback de éxito.
     * @param {callback} fail Callback de fallo.
     */
    getInstalls(targetDate, lastDays, success, fail) {
        // Fechas del filtro
        let dates = getFilterDates(targetDate, lastDays)
        this.db.collection(this.COLLECTION_STATISTICS)
        .doc('installations')
        .get()
        .then(doc => {
            let installations = doc.data().installations
            if(typeof installations == 'undefined' || installations == null) {
                success(0)
            } else {
                if(dates.length == 0) { // Sin filtro de fechas (devolver todos los datos)
                    success(installations.length)
                } else {
                    // Filtrar por día
                    let filteredInstallations = installations.map(i => i.toDate().getTime())
                        .filter(i => i >= dates[0].getTime() && i <= dates[1].getTime())
                    success(filteredInstallations.length)
                }
            }
        })
        .catch(error => fail(error))
    }


    /**
     * Método utilizado en los tests de la API de estadísticas
     * para vaciar la base de datos de estadísticas.
     */
    deleteAllStatistics(complete) {
        let batchDelete = this.db.batch()
        this.db.collection(this.COLLECTION_STATISTICS)
            .listDocuments()
            .then(docs => {
                docs.forEach(doc => {
                    batchDelete.delete(doc)
                })

                batchDelete.commit().then(() => {
                    complete()
                })
            }).catch(error => console.log(error))
    }

}

module.exports = StatisticsRepository