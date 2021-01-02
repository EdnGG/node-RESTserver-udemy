// // PORT
process.env.PORT = process.env.PORT || 3000

// /*************************** 
// Entorno Esta variable la establece heroku
// ****************************/
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'


// /*************************** 
// Base de datos
// *****************************/
let urlDB

if (process.env.NODE_ENV === 'dev') {
  urlDB = 'mongodb://localhost:27017/cafe'
} else {
  urlDB = 'mongodb+srv://eden-udemy-node:b1oFF21lkvpUul1m@cluster0.xku6e.mongodb.net/test'
}

process.env.URLDB = urlDB


