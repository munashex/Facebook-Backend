import mongoose from 'mongoose' 

const PostSchema = new mongoose.Schema({
    image: String, 
    public_id: String, 
    caption: String, 
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User"
    }, 
    name: {
        type: mongoose.Schema.Types.String, 
        ref: "User"
    },
    likes: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}], 

    comments: [{
        user: {type: mongoose.Schema.Types.ObjectId}, 
        comment: String, 
        name: {type: mongoose.Schema.Types.String}
    }]

}, {timestamps: true}) 

const Post = mongoose.model('Post', PostSchema)  
export default Post
