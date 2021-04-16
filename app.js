const express = require('express')
const app = express()

const port = process.env.port || 8080
// const hostname = process.env.WEBSITE_HOSTNAME || 'localhost'

const hostname = 'localhost'

app.get('/', (req, res) => {
    res.send("Hello World!! from Node.js Server 2.1")
})

app.get('/hola', (req, res) => {
    res.send("Hola mundo!")
})

app.get('/res/:id', (req, res) => {
    res.send(`Accediendo al recurso ${req.params.id}`)
})


app.get('/getPositivo', (req,res) => {
    console.log("get prueba invocado")
    // res.json({
    //     positiveID: '199',
    //     prueba: "esto es una prueba"
    // })
    res.status(404).send({
        code: 405,
        message: "No existe el recurso.",
        timestamp: Date.now()
    })
})

app.listen(port, () => {
    console.log(`Server listening at http://${hostname}:${port}`)
})
