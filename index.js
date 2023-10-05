import express from 'express' 
import dotenv from 'dotenv' 
import cors from 'cors'  
dotenv.config()
import connectDB from './config/db.js' 
connectDB() 

import register from './routes/Register.js' 
import user from './routes/User.js' 
import post from './routes/Post.js'


const app = express() 
const PORT = process.env.PORT || 3002

app.use(express.json())  
app.use(cors())
app.use('/api', register)  
app.use('/user', user) 
app.use('/post', post)



app.listen(PORT , () => console.log(`server is running on port ${PORT}`))
