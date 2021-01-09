const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario')
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');


// Default Options
app.use( fileUpload({ useTempFiles: true }) )
// app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {

  let tipo = req.params.tipo
  let id = req.params.id


  if (!req.files) {
    return res.status(400)
      .json({
        ok: false,
        err: {
          message: 'No files were selected'
        }
      })
  }

  // Valida tipo
  let tiposValidos = ['productos', 'usuarios']
  if (tiposValidos.indexOf(tipo) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: 'Allowed types are: ' + tiposValidos.join(', '),
        // ext: extension
      }
    })
  }



  let sample = req.files.sample
  // separara el nombre del archivo en cuanto encuentre un punto '.'
  let nombreArchivoCortado = sample.name.split('.')
  // Obtenemos la ultima posicion del arreglo
  let extension = nombreArchivoCortado[nombreArchivoCortado.length -1]
  // console.log(nombreArchivo)
  // console.log(extension)



  // Extensiones permitidas
  let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg']

  // Valida si "extension" esta en alguna posicion index del areglo 'extencionesValidas'
  if (extensionesValidas.indexOf(extension) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        // Si se manda el error de esta forma todo queda junto
        // message: 'Allowed extensions are: ' + extencionesValidas
        
        // Si se manda el error de esta forma todo queda separado
        message: 'Allowed extensions are: ' + extensionesValidas.join(', '),
        ext: extension
      }
    })

  }

  // CAMBIAR NOMBRE ARCHIVO
  let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`

  sample.mv(`uploads/${tipo}/${nombreArchivo}`, function(err) {
    
    if (err) {
      return res.status(500).json({
        ok: false,
        err: err.message
      })
    }

  // Imagen ya cargada
    // Aplicar condicion 
    // let tipo = req.params.tipo
    if (req.params.tipo === 'usuarios') {
      return imagenUsuario(id, res, nombreArchivo)
    } else  {
      return imagenProducto(id, res, nombreArchivo)
    }
    
    
  })
})

function imagenUsuario(id, res, nombreArchivo) {
  Usuario.findById(id, (err, usuarioDB) => {
    
    if (err) {

    borrArchivo(nombreArchivo, 'usuarios')

      return res.status(500).json({
        ok: false,
        err: err
      })
    }

    if (!usuarioDB) {

      borrArchivo(nombreArchivo, 'usuarios')

      return res.status(400).json({
        ok: false,
        err: {
          message: 'Usuario no existente'
        }
      })
    }

    borrArchivo(usuarioDB.img, 'usuarios')


    usuarioDB.img = nombreArchivo

    usuarioDB.save((err, usuarioGuardado) => {
      console.log(usuarioGuardado)
      if (err) {
        return res.status(400).json({
          ok: false,
          err: {
          message: 'Usuario no existe'
          }
        })
      }

      res.json({
        ok: true,
        usuario: usuarioGuardado,
        img: nombreArchivo
      })
    })

  })
}

function borrArchivo(nombreImagen, tipo) {
  let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`) 
    if (fs.existsSync(pathImagen)) {
      fs.unlinkSync(pathImagen)
    }
}

function imagenProducto(id, res, nombreArchivo) {
  Producto.findById(id, (err, productoDB) => {
    
    if (err) {

    borrArchivo(nombreArchivo, 'productos')

      return res.status(500).json({
        ok: false,
        err: err
      })
    }

    if (!productoDB) {

      borrArchivo(nombreArchivo, 'productos')

      return res.status(400).json({
        ok: false,
        err: {
          message: 'Producto no existente 1'
        }
      })
    }


    borrArchivo(productoDB.img, 'producto')

    productoDB.img = nombreArchivo

    productoDB.save((err, productoGuardado) => {
      console.log(productoGuardado)
      if (err) {
        return res.status(400).json({
          ok: false,
          err: {
          message: 'Producto no existe 2'
          }
        })
      }

      res.json({
        ok: true,
        producto: productoGuardado,
        img: nombreArchivo
      })
    })

  })
}

module.exports = app 

// user test2@gmail.com USER_ROLE 123123
// Checar permisos con admin y user, admin no asocia la imagen
// user si lo hace