import express from 'express' 
const register = express.Router() 
import User from '../models/Users.js' 
import bcrypt from 'bcrypt'  
import jwt from 'jsonwebtoken'

const generateToken = (user) => {
    return jwt.sign({name: user.name, _id: user._id}, process.env.JWT, {expiresIn: '30d'})
}


register.post('/signup', async(req, res) => {
    try {
     const {name, email, password} = req.body 

     const user = await User.findOne({email}) 
     
     if(user) {
        res.status(400).json({message: 'user already exists'}) 
        return 
     }
  
     const saveUser = new User({
        name, 
        email, 
        password: bcrypt.hashSync(password, 12)
     })

     const results = await saveUser.save() 
     res.status(200).json({token: generateToken(results)})
    }catch(err) {
        console.log(err)
    }
})

register.post('/signin', async(req, res) => {
    try {
    const {email, password} = req.body 

    const user = await User.findOne({email}) 

    if(!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(400).json({message: 'user not found'})
    }

    res.status(200).json({token: generateToken(user)})
    
    }catch(err) {
     console.log(err)
    }
})

export default register