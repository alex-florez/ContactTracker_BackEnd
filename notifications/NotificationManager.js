const cron = require('node-cron')
const admin = require('firebase-admin')

/**
 * Manager para gestionar la programación y envío de notificaciones
 * downstream a los clienntes Android.
 */
class NotificationManager {

    constructor(positivesRepository) {
        this.positivesRepository = positivesRepository // Repositorio de positivos.
    }

    /**
     * Reprograma las Cron Tasks para que se ejecuten periodicamente
     * en función de la configuración establecida.
     */
    scheduleNotifications() {
        cron.schedule("* * * * *", () => {
            this.sendPositivesNotification()
        })
    }

    /**
     * Recupera el n.º de positivos notificados desde el inicio del día de hoy
     * hasta la hora actual y envía una notificación al topic 'positives' para que 
     * sea recibida por todos los clientes Android subscritos a ese tema.
     */
    sendPositivesNotification() {
        // Crear fechas de filtro
        let now = new Date()
        let start = new Date(now)
        start.setHours(0, 0, 0) // Inicio del día.
        // Recuperar los positivos notificados entre esas horas.
        this.positivesRepository.getPositivesNotifiedWithinDates(
            start,
            now,
            positives => {
              // Enviar notificación con el n.º de positivos notificados.
              let numberOfNotifiedPositives = positives.length
              if(numberOfNotifiedPositives > 0) { // Enviar el mensaje solo si hay positivos notificados.
                // Construir mensaje FCM
                let notificationTitle = numberOfNotifiedPositives > 1 ? `Hoy se han notificado ${numberOfNotifiedPositives} nuevos positivos.` 
                            : 'Hoy se ha notificado 1 nuevo positivo.' 
                let message = {
                    notification: {
                        title: notificationTitle,
                        body: 'Realiza ahora una comprobación para ver si has estado en contacto con un positivo.'
                    },
                    topic: 'positives'
                }
                // Enviar mensaje
                admin.messaging().send(message)
                    .then(messageID => console.log("Mensaje de los positivos notificados enviado con éxito:", messageID))
                    .catch(error => console.log("Error al enviar el mensaje:", error))
                }
            },
            error => {
                console.log("Ha habido un error al recuperar los positivos:", error)
            }
        )
    }
}

module.exports = NotificationManager