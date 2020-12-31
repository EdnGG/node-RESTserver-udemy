require('./config/config')

const express = require('express')
const mongoose = require('mongoose')

const app = express()

const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())


app.use( require('./routes/usuario.js'))

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
}

mongoose.connect('mongodb://localhost:27017/cafe', options, (err, res) => {
  if (err) {
    throw err
    console.log('DB Offline')
  }
  console.log('DB ONLINE')
})

app.listen(process.env.PORT, () => {
  console.log(`Listening on port: 3000`)
})