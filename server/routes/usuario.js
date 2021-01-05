const express = require('express')
const bcrypt = require('bcrypt')
const _ = require('underscore')

const Usuario = require('../models/usuario.js')
const { verificarToken, verificaAdmin_role} = require('../middlewares/autenticacion')

const app = express()

app.get('/usuario', verificarToken, (req, res) => {
  
  // return res.json({
  //   usuario: req.usuario,
  //   nombre: req.usuario.nombre,
  //   email: req.usuario.email
  // })


  let desde = req.query.desde || 0
  desde = Number(desde)

  let limite = req.query.limite || 5
  limite = Number(limite)

  Usuario.find({ estado: true }, 'nombre email rol estado google')
    .skip(desde)
    .limit(limite)
    .exec((err, usuarios) => {
        if (err) {
          return res.status(400).json({
          ok: false,
          err
          })
        }
      // Esta es la respuesta del servicio
      Usuario.count({ estado: true }, (err, conteo) => {
      // handler Error

        if (err) {
          return res.status(400).json({
          ok: false,
          err
          })
        }
        // handle response
        res.json({
          ok: true,
          usuarios,
          cantidad: conteo
        })

      })
        
      
    })
    // next()
  // res.send('Get usuario')
})

app.post('/usuario', [verificarToken, verificaAdmin_role] ,(req, res) => {
  let body = req.body

  let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    // img: body.img
    role: body.role

  })

  usuario.save((err, usuarioDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      })
    }

  // usuarioDB.password = null

    res.json({
      ok: true,
      usuario: usuarioDB
    })
  })

})

app.put('/usuario/:id', [verificarToken, verificaAdmin_role] ,(req, res) => {
  let id = req.params.id
  // las propiedades de arreglo vienen del Schema
  let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado'])

  // delete body.password
  // delete body.google

  Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true },(err, usuarioDB) => {
    
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      })
    }

    res.json({
      ok: true,
      usuario: usuarioDB
    })

  
  })

})

// Ya no se acostumbra borrar registro en DB
// Lo que se hace es deshabilitar para que el registro siempre quede
app.delete('/usuario/:id', [verificarToken, verificaAdmin_role] ,(req, res) => {
  // res.send('Delete usuario')
  let id = req.params.id
  let handleState = {
    estado: false
  }

  Usuario.findByIdAndUpdate(id, handleState, { new: false }, (err, usuarioBorrado) => {
  // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      })
    }
    if (!usuarioBorrado) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'User not found'
        }
      })
    }
    res.json({
      ok: true,
      usuario: usuarioBorrado
    })
  })
})


module.exports = app


// test7@gmail.com es ADMIN_ROLE