require('./config/config')

const express = require('express')
const app = express()

const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())


app.get('/usuario', (req, res) => {
  res.send('Get usuario')
})

app.post('/usuario', (req, res) => {
  let body = req.body
  if (body.nombre === undefined) {
    res.status(400).json({
      ok: false,
      mensaje: 'Name is required'
    })
  } else {
    res.json({
      persona: body
    })
  }
})

app.put('/usuario/:id', (req, res) => {
  let id = req.params.id
  // res.send('Put usuario')
  res.json({
    id
  })
})

// Ya no se acostumbra borrar registro en DB
// Lo que se hace es deshabilitar para que el registro siempre quede
app.delete('/usuario', (req, res) => {
  res.send('Delete usuario')
})

app.listen(process.env.PORT, () => {
  console.log(`Listening on port: 3000`)
})