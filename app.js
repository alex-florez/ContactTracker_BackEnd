const express = require('express')
const app = express()

const port = process.env.port || 8080
const hostname = process.env.WEBSITE_HOSTNAME || 'localhost'

app.get('/', (req, res) => {
    res.send("Hello World!!!!")
})

app.listen(port, () => {
    console.log(`Server listening at http://${hostname}:${port}`)
})