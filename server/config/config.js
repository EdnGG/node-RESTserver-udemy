// // PORT
process.env.PORT = process.env.PORT || 3000

// /*************************** 
// Entorno Esta variable la establece heroku
// ****************************/
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

// /*************************** 
// Vencimiento del token
// ****************************/
// 60 seg * 60 * min * 24 horas * 30 dias
process.env.CADUCIDAD_TOKEN = process.env.CADUCIDAD_TOKEN || 60 * 60* 24 * 30


// /*************************** 
// SEED de autenticacion
// ****************************/
process.env.SEED = process.env.SEED || 'seed-desarrollo' 


// /*************************** 
// Base de datos
// *****************************/
let urlDB

if (process.env.NODE_ENV === 'dev') {
  urlDB = 'mongodb://localhost:27017/cafe'
} else {
  urlDB = process.env.MONGO_URI
}

process.env.URLDB = urlDB

// Recuerden los comandos de Heroku para crear las variables de entorno

//     heroku config:set MONGO_URI="XXXXXXX"
 
//     heroku config:get nombre
//     heroku config:unset nombre
//     heroku config:set nombre="Fernando"
// SEED = 'seed-produccion'


