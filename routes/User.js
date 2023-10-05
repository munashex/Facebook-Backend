import express from 'express' 
import isAuth from '../middlewares/auth.js'
const user  = express.Router() 
import User from '../models/Users.js'   
import {v2 as cloudinary} from 'cloudinary' 
import upload from '../utils/cloudinary.js' 
import fs from 'fs'
import Profile from '../models/Profile.js'
import Post from '../models/Post.js'



user.get('/currentUser', isAuth, async(req, res) => {
   try {
    const user = await User.findById(req.user._id) 
    if(!user) {
      return res.status(401).json({message: "use not found"})
    } 
    res.status(200).json({user: user})
   }catch(err) {
      console.log(err)
   }
}) 

user.post('/profile', isAuth, upload.single("image"), async(req, res) => {
   try {
    if(!req.file) {
      return res.status(400).json({message: 'please provide image'})
    }

    const results = await cloudinary.uploader.upload(req.file.path, {
      allowed_formats: ['png', 'jpeg'], 
      resource_type: 'image', 
      transformation: [{width: 200, height: 200, crop: "fill"}]
    })

    const profile = new Profile({
      image: results.secure_url,
      public_id: results.public_id, 
      user: req.user._id, 
      name: req.user.name
    })

   const savedImage = await profile.save() 
   res.status(200).json({profile: savedImage}) 
   fs.unlinkSync(req.file.path)
   }catch(err) {
    console.log(err)
   }
})

user.get('/profile', isAuth, async(req, res) => {
  try {
  const profile = await Profile.findOne({user: req.user._id}) 

  if(!profile) {
    res.status(404).json({message: 'no profile'})
    return
  }

  res.status(200).json({profile: profile})
  }catch(err) {
  console.log(err)
  }
})

user.post('/editprofile', upload.single('image'), isAuth,  async(req, res) => {
 try {
  const {bio} = req.body 
  const profile = await Profile.findOne({user: req.user._id}) 
  
  if(profile) {
  await profile.deleteOne() 
  } 

  const results = await cloudinary.uploader.upload(req.file.path, {
    allowed_formats: ['png', 'jpeg'], 
    resource_type: 'image', 
    transformation: [{width: 500, height: 500, crop: "fit"}]
  })

  const profilePic = new Profile({
    bio, 
    image: results.secure_url, 
    public_id: results.public_id, 
    user: req.user._id
  })

const savedProfile = await profilePic.save() 
res.status(200).json({profile: savedProfile})
fs.unlinkSync(req.file.path)
 }catch(err) {
  console.log(err)
 }
})



user.get('/:id', async(req, res) => {
  try {
  const {id} = req.params
   const user = await Profile.findOne({user: id}) 
   const post = await Post.find({user: id}) 

   if(!user || !post) {
    return res.status(400).json({message: 'user not found'})
   }

   res.status(200).json({user: user, post: post})
  }catch(err) {
    console.log(err)
  }
})

user.post('/follow/:id', isAuth, async(req, res) => {
const {id} = req.params 
const userToFollow = await Profile.findOne({user: id}) 
const currentUser = await Profile.findOne({user: req.user._id}) 

if(!userToFollow) {
  return res.status(400).json({message: "user not found"})
}

if(!currentUser) {
  return res.status(400).json({message: "user not found"})
}

if(currentUser.following.includes(userToFollow.user)) {
  res.status(400).json({message: "you follow this user"}) 
  return
}


userToFollow.followers.push(req.params.id) 
currentUser.following.push(userToFollow.user) 

await userToFollow.save() 
await currentUser.save() 
res.status(200).json(currentUser)
})


  

export default user