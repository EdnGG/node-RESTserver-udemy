const express = require('express')

const { verificarToken} = require('../middlewares/autenticacion')

const app = express()

let Producto = require('../models/producto')

/********************************
OBTENER productos
****************************** */
app.get('/producto', verificarToken, (req, res) => {
  let desde = req.query.desde || 0
  desde = Number(desde)

  let limite = req.query.limite || 5
  limite = Number(limite)

  Producto.find(
    { disponible: true },
    // 'nombre precioUni descripcion disponible categoria usuario'
  )
    .skip(desde)
    .limit(limite)
    .populate('usuario', 'nombre email')
    .populate('categoria', 'descripcion')
    .exec((err, productos) => {
        if (err) {
          return res.status(400).json({
          ok: false,
          err
          })
        }
      
      res.json({
          ok: true,
          productos,
          // cantidad: conteo
        })
      
      
      // Esta es la respuesta del servicio
      // Productos.count({ disponible: true }, (err, conteo) => {
      // // handler Error

      //   if (err) {
      //     return res.status(400).json({
      //     ok: false,
      //     err
      //     })
      //   }
      //   // handle response
      //   res.json({
      //     ok: true,
      //     usuarios,
      //     cantidad: conteo
      //   })

      // })
        
      
    })
  
})

/********************************
OBTENER producto ID
****************************** */
app.get('/producto/:id', verificarToken, (req, res) => {
  let id = req.params.id

  Producto.findById(id) 
    .populate('usuario', 'nombre email')
    .populate('categoria', 'nombre')
    .exec((err, productoDB) => {
      

    
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                  message: 'El Producto no existe',
                }
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        });
  });
})

/********************************
BUSCAR producto 
****************************** */
app.get('/producto/buscar/:termino', verificarToken ,(req, res) => {
  
  let termino = req.params.termino
  // 'i' significa insencible a mayusculas y minusculas
  let regex = new RegExp(termino, 'i')

  Producto.find({ nombre: regex })
    .populate('categoria', 'nombre')
    .exec((err, producto) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        })
      }
      res.status(201).json({
        ok: true,
        producto
      })
    })
  
})

/********************************
CREAR producto 
****************************** */
app.post('/producto', verificarToken ,(req, res) => {
  // req.usuario._id
  let body = req.body
  
  let producto = new Producto({
    usuario: req.usuario._id,
    nombre: body.nombre,
    precioUni: body.precioUni,
    descripcion: body.descripcion,
    disponible: body.disponible,
    categoria: body.categoria,
    usuario: body.usuario,
  })

  producto.save((err, productoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      })
    }

    if (!productoDB) {
      return res.status(400).json({
        ok: false,
        err
      })
    }

    res.status(201).json({
      ok: true,
      producto: productoDB
    })
  })
})

/********************************
ACTUALIZAR producto 
****************************** */
app.put('/producto/:id', verificarToken ,(req, res) => {
  let id = req.params.id
  let body = req.body

  let descProducto = {
    nombre: body.nombre,
    precioUni: body.precioUni,
    descripcion: body.descripcion,
    disponible: body.disponible,
    categoria: body.categoria
  } 

  Producto.findByIdAndUpdate(id, descProducto ,{ new: true, runValidators: true }, (err, productoDB) => {
    
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      })
    }

    if (!productoDB) {
      return res.status(400).json({
        ok: false,
        err
      })
    }

    res.json({
      ok: true,
      producto: productoDB
    })


  })
})

/********************************
BORRAR producto 
****************************** */
app.delete('/producto/:id', verificarToken ,(req, res) => {
  let id = req.params.id

  Producto.findById(id, (err, productoDB) => {
    
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      })
    }

    if (!productoDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "Product dosen't exist"
        }
      })
    }

    productoDB.disponible = false

    productoDB.save((err, productoBorrado) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        })
      }
      
      res.json({
        ok: true,
        producto: productoBorrado,
        message: "Producto borrado"
      })

    })

    

  })
})


module.exports = app