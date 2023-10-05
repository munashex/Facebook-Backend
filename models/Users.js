import mongoose from 'mongoose' 

const UserModel = new mongoose.Schema({
    name: String, 
    password: String, 
    email: String,  
}) 

const  User = mongoose.model("User", UserModel) 
export default User