import mongoose from 'mongoose' 

const UserModel = new mongoose.Schema({
    name: String, 
    password: String, 
    email: String,
    followers: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    following: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}]   
}) 

const  User = mongoose.model("User", UserModel) 
export default User