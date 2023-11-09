require('dotenv').config()

const express = require('express')
const app = express()

app.use(express.static('public'))

app.listen( () => {
  console.log(`Capstone Metrics Dashboard listening on port ${process.env.PORT}`)
})