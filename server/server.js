require('./config/config')

const express = require('express')
const mongoose = require('mongoose')
const path = require('path')

const app = express()

const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// Habilitar carpeta public
app.use(express.static(path.resolve( __dirname , '../public')))
// console.log(path.resolve( __dirname , '../public'))
 
// parse application/json
app.use(bodyParser.json())

// Global Routes Configuration
app.use( require('./routes/index'))
// app.use( require('./routes/usuario.js'))
// app.use( require('./routes/login.js'))

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
}


// Mongo Compass
mongoose.connect(process.env.URLDB  , options, (err, res) => {
  if (err) {
    throw err
  }
  console.log('DB ONLINE')
})

app.listen(process.env.PORT, () => {
  console.log(`Listening on port: ${process.env.PORT}`)
})

