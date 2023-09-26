import jwt from 'jsonwebtoken' 


const isAuth = (req, res, next) => {
    const authorization = req.headers.authorization 
    if(authorization) {
      const token = authorization.split(" ")[1]
      jwt.verify(
        token, 
        process.env.JWT, 
        (err, decode) => {
          if(err) {
            res.status(401).send({message: 'Invalid Token'})
          }else {
            req.user = decode, 
            next()
          }
        }
      )
    }else {
      res.status(401).send({message: 'No Token'})
    }
}

export default isAuth