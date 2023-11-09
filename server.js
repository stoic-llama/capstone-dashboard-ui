
require('dotenv').config()

const express = require('express')
const app = express()

app.use(express.static('public'))

const port = process.env.PORT || 9999

app.listen(port, () => {
  console.log(`Capstone Metrics Dashboard listening on port ${port}`)
})