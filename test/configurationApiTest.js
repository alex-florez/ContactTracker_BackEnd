// Dependencias de test
let chai = require('chai')
let chaiHttp = require('chai-http')
let app = require('../app.js')
let should = chai.should() // Tipo de aserción: Should

chai.use(chaiHttp) // Usar plugin Chai-http

describe('Configuration API', () => {
    // Before Each
    beforeEach((done) => {
        console.log('Antes de cada test...')
        done()
    })
    // Test de prueba
    describe('/GET configuration', () => {
        it('debería devolver la configuración de notificación de positivos', (done) => {
            chai.request(app)
                .get('/config/notify-config')
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    res.body.should.have.property('infectivityPeriod').equal(3)
                    res.body.should.have.property('notifyWaitTime').equal(5)
                    done()
                })
        })
    })
})