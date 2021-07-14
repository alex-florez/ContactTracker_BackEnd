const dateFormat = require('dateformat')

/**
 * Repositorio para gestionar los positivos notificados en el sistema.
 */
class PositiveRepository {

    constructor(db){
        this.db = db // Referencia a Firestore
        this.COLLECTION_POSITIVES = "positives" // Nombre de la colección
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
                success(positives)
            })
            .catch(fail)
    }
}

module.exports = PositiveRepository