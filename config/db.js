import mongoose  from "mongoose"; 

const connectDB = () => {
 try {
 mongoose.connect(process.env.MONGO_URI) 
 console.log('connected to mongodb')
 }catch(err) {
    console.log(err) 
    process.exit(1)
 }
} 

export default connectDB