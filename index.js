import express from 'express' 
import dotenv from 'dotenv' 
import cors from 'cors'  
dotenv.config()
import connectDB from './config/db.js'


const app = express() 
app.use(express.json()) 
connectDB()