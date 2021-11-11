const dateFormat = require('dateformat')
const { firestore } = require('firebase-admin')
const firebase = require('firebase-admin')

/**
 * Repositorio para gestionar los positivos notificados en el sistema.
 */
class PositiveRepository {

    constructor(db){
        this.db = db // Referencia a Firestore
        this.COLLECTION_POSITIVES = `${process.env.FIRESTORE_ENV}/positives` // Nombre de la colección
    }


    /**
     * Devuelve en el callback de éxito un listado con todos los positivos
     * notificados, ordenados por timestamp de notificación descendente.
     * 
     * @param {callback} success Callback de éxito.
     * @param {callback} fail Callback de fallo. 
     */
    getAllPositives(success, fail) {
        this.db.collection(this.COLLECTION_POSITIVES)
            .orderBy('timestamp', 'desc')
            .get()
            .then(result => {
                let positives = []
                result.forEach(doc => {
                    let positive = doc.data()
                    positive.positiveCode = doc.id // ID del documento como código del positivo.
                    positives.push(positive)
                })
                success(positives)
            })
            .catch(error => fail(error))
    }

    /**
     * Inserta el positivo en la base de datos. Inserta todas las localizaciones
     * almacenadas en el positivo en la base de datos. Si hay éxito ejecuta el callback pasado
     * como parámetro.
     * @param {object} positive Objeto Positivo con las localizaciones. 
     * @param {callback} success Callback de éxito.
     * @param {callback} fail Callback de fallo.
     */
     addPositive(positive, success, fail) {
        // Construir array de fechas únicas
        let locationDates = positive.locations.map(
            location => dateFormat(new Date(location.point.locationTimestamp), "yyyy-mm-dd")
        ).filter((date, index, array) => array.indexOf(date) === index)
        positive.locationDates = locationDates
        this.db.collection(this.COLLECTION_POSITIVES).add(positive).then(docRef => {
           success(docRef)
        }).catch(error => {
           fail(error)
        })
    }

    /**
     * Devuelve los positivos que tienen localizaciones registradas
     * en alguna de las fechas pasadas como parámetro en el array
     * de fechas.
     * @param {array} dates Array con las fechas de la query. 
     * @param {callback} success Callback de éxito.
     * @param {callback} fail Callback de fallo.
     */
    getPositivesWithinDates(dates, success, fail) {
        this.db.collection(this.COLLECTION_POSITIVES)
            .where('locationDates', 'array-contains-any', dates)
            .get()
            .then(result => {
                let positives = [] // Array de positivos
                result.forEach(doc => {
                    let positive = doc.data()
                    positive.positiveCode = doc.id // Establecer el id del documento
                    positives.push(positive)
                })
                // Ordenarlos por timestamp
                positives.sort(function(a, b) {
                    return b.timestamp - a.timestamp
                })
                success(positives)
            })
            .catch(fail)
    }

    /**
     * Devuelve en el callback de éxito una lista con los positivos notificados entre 
     * las fechas y horas pasadas como parámetro.
     * 
     * @param {date} start Fecha de inicio.
     * @param {date} end Fecha de fin.
     * @param {callback} success Callback de éxito. 
     * @param {callback} fail Callback de fallo.
     */
    getPositivesNotifiedBetweenDates(start, end, success, fail) {
        this.db.collection(this.COLLECTION_POSITIVES)
            .where('timestamp', '>=', start.getTime())
            .where('timestamp', '<=', end.getTime())
            .get()
            .then(result => {
                let positives = []
                result.forEach(doc => {
                    positives.push(doc.data())
                })
                success(positives)
            })
            .catch(error => fail(error))
    }

    /**
     * Método utilizado en las pruebas de Integración para
     * la API REST, de forma que se eliminen todos los positivos
     * de la base de datos.
     */
    deleteAllPositives(complete) {
        let batchDelete = this.db.batch()

        this.db.collection(this.COLLECTION_POSITIVES)
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

module.exports = PositiveRepository