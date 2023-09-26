import mongoose from 'mongoose' 

const ProfileSchema = new mongoose.Schema({
    image: String, 
    public_id: String, 
    bio: String, 
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: "User"
    }
})  

const Profile = mongoose.model('Profile', ProfileSchema) 
export default Profile