const express = require('express');
// const fileUpload = require('express-fileupload');
const app = express();

const { verificarToken, verificaTokenImg} = require('../middlewares/autenticacion')

// const Usuario = require('../models/usuario')
// const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');


app.get('/imagen/:tipo/:img', verificaTokenImg , (req, res) => {
  let tipo = req.params.tipo
  let img = req.params.img

  // let pathImg = `./uploads/${tipo}/${img}`

  let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`) 

  if (fs.existsSync(pathImagen)) {
    res.sendFile(pathImagen)
  } else {
    let noImagepath = path.resolve(__dirname, '../assets/no-image.jpg')
    res.sendFile(noImagepath)
  }

})


module.exports = app