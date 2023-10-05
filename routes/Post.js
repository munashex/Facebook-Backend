import express from 'express' 
const post = express.Router() 
import isAuth from '../middlewares/auth.js'  
import upload from '../utils/cloudinary.js' 
import {v2 as cloudinary} from 'cloudinary' 
import Post from '../models/Post.js' 
import fs from 'fs' 
import User from '../models/Users.js'  
import Profile from '../models/Profile.js'


post.post('/', isAuth, upload.single("image"), async(req, res) => {
    try {
     const {caption} = req.body
     
     const results = await cloudinary.uploader.upload(req.file.path, {
        allowed_formats: ['png', 'jpeg'], 
        resource_type: 'image', 
        transformation: [{width: 500, height: 500, crop: "fill"}]
      })

     const post = new Post({
        image: results.secure_url, 
        public_id: results.public_id, 
        user: req.user._id, 
        name: req.user.name,
        caption
     }) 

    const savedImage = await post.save() 
    res.status(200).json({post: savedImage}) 
    fs.unlinkSync(req.file.path)
    }catch(err) {
        console.log(err)
    }
})

post.get('/', isAuth, async(req, res) => {
    try {
     const posts = await Post.find({user: req.user._id}) 
    res.status(200).json({posts: posts})
    }catch(err) {
        console.log(err)
    }
})

post.delete("/:id", isAuth,  async(req, res) => {
    try{
        const imageId = req.params.id
        const image = await Post.findById(imageId)  
    
        if(!image) {
            return res.status(400).json({message: "no image found"}) 
            return  
        }
        await cloudinary.uploader.destroy(image.public_id) 
        await image.deleteOne() 
      res.status(200).json({message: 'image deleted'})
        }catch(err) {
            console.log(err)
        }
})

post.get('/allposts',  async(req, res) => {
    try {
    
    const posts = await Post.find()  
    const user = await User.findOne(posts.user)
    
    res.status(200).json({posts: posts})
    }catch(err) {
     console.log(err)
    }
})



post.post('/like/:id',isAuth,  async(req,res) => {
 try {
    const {id} = req.params 
    const post = await Post.findById(id)  
    
    if(post.likes.includes(req.user._id)) {
        return res.status(400).json({message: 'you already like this posts'})
       }
     
       post.likes.push(req.user._id)
       await post.save() 
       res.status(200).json({post: post})
    
 }catch(err) {
    console.log(err)
 }
})

post.post('/dislike/:id',isAuth, async(req, res) => {
 try {
  const {id} = req.params 
  const post = await Post.findById(id)  

  if(!post.likes.includes(req.user._id)) {
   return res.status(400).json({message: 'like it first'})
  }

  post.likes.pull(req.user._id)
  await post.save() 
  res.status(200).json({post: post})
 }catch(err) {
    console.log(err)
 }
}) 

post.post("/comment/:id", isAuth, async(req, res) => {
    try {
    const {comment} = req.body
    const {id} = req.params 

    const post = await Post.findById(id)  

    if(!post) {
        return res.status(400).json({message: 'post not found'})
    }
    
    post.comments.push({comment: comment, user: req.user._id, name: req.user.name})
    const savedPost = await post.save() 
    res.status(200).json(savedPost)
    }catch(err) {
        console.log(err)
    }
})

post.get('/:id', async(req, res) => {
    try {
     const {id} = req.params
     const post = await Post.findById(id) 

     if(!post) {
        return res.status(400).json({message: 'post not found'})
     }

     res.status(200).json({post})
    }catch(err) {
        console.log(err)
    }
})




export default post