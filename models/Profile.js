import mongoose from 'mongoose' 

const ProfileSchema = new mongoose.Schema({
    image: String, 
    public_id: String,
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: "User"
    },
    name: {
        type: mongoose.Schema.Types.String, ref: "user"
    }
})  

const Profile = mongoose.model('Profile', ProfileSchema) 
export default Profile