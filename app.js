const express = require('express')
const app = express()

const port = process.env.port || 8080
const hostname = 'localhost'

app.get('/', (req, res) => {
    res.send("Hello World!! from Node.js Server")
})

app.listen(port, () => {
    console.log(`Server listening at http://${hostname}:${port}`)
})
