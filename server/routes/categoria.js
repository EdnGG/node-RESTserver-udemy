const express = require('express')
let app = express()

let { verificarToken, verificaAdmin_role } = require('../middlewares/autenticacion')



let Categoria = require('../models/categoria')


app.get('/categoria', verificarToken, (req, res) => {
  let categoria = req.categoria
  Categoria.find(categoria)

  Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categorias
            });

        })
})

app.get('/categoria/:id', verificarToken, (req, res) => {
  let id = req.params.id

  Categoria.findById(id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(500).json({
                ok: false,
                err: {
                  message: 'El ID no es correcto',
                  // message: err.message
                  // err: err.message

                }
            });
        }


        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });
})

app.post('/categoria', verificarToken ,(req, res) => {
  // req.usuario._id
  let body = req.body
  
  let categoria = new Categoria({
    descripcion: body.descripcion,
    usuario: req.usuario._id
  })

  categoria.save((err, categoriaDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      })
    }

    if (!categoriaDB) {
      return res.status(400).json({
        ok: false,
        err
      })
    }

    res.json({
      ok: true,
      categoria: categoriaDB
    })


  })
})

app.put('/categoria/:id', verificarToken ,(req, res) => {
let id = req.params.id
  let body = req.body

  let descCategoria = {
    descripcion: body.descripcion
  } 

  Categoria.findByIdAndUpdate(id, descCategoria ,{ new: true, runValidators: true }, (err, categoriaDB) => {
    
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      })
    }

    if (!categoriaDB) {
      return res.status(400).json({
        ok: false,
        err
      })
    }

    res.json({
      ok: true,
      categoria: categoriaDB
    })


  })
})

app.delete('/categoria/:id', [verificarToken, verificaAdmin_role] ,(req, res) => {
  let id = req.params.id

  Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
    
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      })
    }

    if (!categoriaDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "id dosen't exist"
        }
      })
    }

    res.json({
      ok: true,
      message: "Categoria borrada"
    })

  })
})




module.exports = app