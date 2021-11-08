const cron = require('node-cron')
const admin = require('firebase-admin')

// Task Keys
const SEND_POSITIVES_NOTIFICATION = "sendPositivesNotification"

/**
 * Manager para gestionar la programación y envío de notificaciones
 * downstream a los clienntes Android.
 */
class NotificationManager {

    constructor(positivesRepository, configRepository) {
        this.positivesRepository = positivesRepository, // Repositorio de positivos.
        this.configRepository = configRepository, // Repositorio de configuración.
        this.scheduledTasks = {} // Mapa de tareas programadas
    }

    /**
     * Reprograma las Cron Tasks para que se ejecuten periodicamente
     * en función de la configuración establecida en la base de datos.
     */
     scheduleNotifications() {
        /* Mensaje de número de positivos notificados en el día de hoy */
        this.configRepository.retrieveConfig("notify-config", (configData) => { // Recuperar horas y minutos de la alarma en la configuración.
            let time = configData.positivesNotificationTime
            this.schedulePositivesNotifications(time)
        }, error => {
            console.log("Error al recuperar la configuración.", error)
        })
    }

    /**
     * Crea una nueva tarea periódica en la hora indicada como parámetro para
     * enviar notificaciones diarias sobre los positivos notificados. 
     * 
     * @param {string} time Hora y minutos en formato 'HH:mm' a la que enviar las notificaciones.
     */
    schedulePositivesNotifications(time) {
        let splittedTime = time.split(':')
        let hour = splittedTime[0]
        let minute = splittedTime[1]
        // Comprobar el desfase temporal
        if(process.env.REMOTE_DEPLOY == 'Azure') {
            // Restar una hora menos por el desfase temporal
            hour = (parseInt(splittedTime[0]) - 1).toString()
        }
        // Formar la expresión de CRON
        let cronExpr = `${minute} ${hour} * * *`

        // Cancelar la tarea anterior
        let lastTask = this.scheduledTasks[SEND_POSITIVES_NOTIFICATION]
        if(lastTask != null){
            lastTask.stop()
        }
        // Programar la nueva tarea
        let task = cron.schedule(cronExpr, () => {
            this.sendPositivesNotification()
        })
        // Almacenar task
        this.scheduledTasks[SEND_POSITIVES_NOTIFICATION] = task
        console.log(`Nueva tarea programada: Enviar notificaciones de positivos -> ${hour}:${minute}`)
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
        this.positivesRepository.getPositivesNotifiedBetweenDates(
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
                    .then(messageID => console.log("Notificación enviada: N.º de positivos notificados - ", messageID))
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