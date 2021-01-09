const jwt = require('jsonwebtoken')


/*************************
Verificar token
**************************/
let verificarToken = (req, res, next) => {
  let token = req.get('token')

  console.log(token)
  
  jwt.verify(token, process.env.SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err: {
          message: 'Invalid token'
        }
      })
    }
    req.usuario = decoded.usuario
    next()

  })


}

/*************************
Verificar adminRole
**************************/

let verificaAdmin_role = (req, res, next) => {

  let usuario = req.usuario
  
  if (usuario.role === 'ADMIN_ROLE' ) {
    next()
    return
  } else {
    return res.json({
    ok: false,
    err: {
      message: 'User is not an Admin'
    }
  })

  }
  
}

/*************************
Verificar token para imagen
**************************/

let verificaTokenImg = (req, res, next) => {
  
  let token = req.query.token

  jwt.verify(token, process.env.SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err: {
          message: 'Invalid token'
        }
      })
    }
    req.usuario = decoded.usuario
    next()

  })

}

module.exports = {
  verificarToken,
  verificaAdmin_role,
  verificaTokenImg
}