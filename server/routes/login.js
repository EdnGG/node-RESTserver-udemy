const express = require('express')
const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')

// Schemma
const Usuario = require('../models/usuario.js')

const app = express()

app.post('/login', (req, res) => {
  let body = req.body

  Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      })
    }

    if (!usuarioDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "(User) or Password incorrects"
        }
      })
    }

    if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "User or (Password) incorrects"
        }
      })
    }

    let token = jwt.sign({
      usuario: usuarioDB
    }, process.env.SEED ,{ expiresIn: process.env.CADUCIDAD_TOKEN })

    res.json({
      ok: true,
      usuario: usuarioDB,
      token
    })
  })
})



module.exports = app
