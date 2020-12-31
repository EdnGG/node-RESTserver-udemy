const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

let rolesValidos = {
  values: ['ADMIN-ROLE', 'USER_ROLE'],
  message: '{VALUE} no es un rol valido',
}

let Schema = mongoose.Schema

let usuarioSchema = new Schema({
  nombre: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Email is required'],
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  img: {
    type: String,
    required: false
  },
  role: {
    type: String,
    default: 'USER_ROLE',
    enum: rolesValidos
  },
  estado: {
    // Boolean: true
    type: Boolean,
    default: true,
  },
  google: {
    type: Boolean,
    default: false,
  }
})

usuarioSchema.methods.toJSON = function () {
  let user = this
  let userObject = user.toObject()
  delete userObject.password
  
  return userObject
  
  
  // const obj = this.toObject()
  // delete obj.pass
  // return obj
}

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico'})

module.exports = mongoose.model('Usuario', usuarioSchema)



