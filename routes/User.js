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
    image: results.secure_url, 
    public_id: results.public_id, 
    user: req.user._id, 
    name: req.user.name
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

  const userToFollow = await User.findById(id)  
  const currentUser = await User.findById(req.user._id)
 

  if(!userToFollow || !currentUser) {
    return res.status(400).json({message: 'user not found'})
  }

  if(userToFollow.followers.includes(req.user._id)) {
    return res.status(400).json({message: 'you follow this user'})
  }

   userToFollow.followers.push(req.user._id) 
   currentUser.following.push(userToFollow._id)
   await userToFollow.save() 
   await currentUser.save() 
   res.status(200).json({user: currentUser})
})

user.post('/unfollow/:id', isAuth, async(req, res) => {
 
  const {id} = req.params 

  const userToFollow = await User.findById(id)  
  const currentUser = await User.findById(req.user._id)
 

  if(!userToFollow || !currentUser) {
    return res.status(400).json({message: 'user not found'})
  }

  if(!userToFollow.followers.includes(req.user._id)) {
    return res.status(400).json({message: 'you do not follow this user'})
  }

   userToFollow.followers.pull(req.user._id) 
   currentUser.following.pull(userToFollow._id)
   await userToFollow.save() 
   await currentUser.save() 
   res.status(200).json({user: currentUser})
})


user.get('/singleUser/:id', async(req, res) => {
  const user = await User.findById(req.params.id)   

  if(!user) {
    return res.status(400).json({message: 'user not found'})
  }
  
  res.status(200).json(user)
}) 

user.get('/followers/:id', async(req, res) => {
  const {id} = req.params
  const user = await User.findById(id)  
  const  followers = await Profile.find({user: user.followers})

  res.status(200).json({followers: followers})
})

user.get('/following/:id', async(req, res) => {
  const {id} = req.params
  const user = await User.findById(id)  
  const  following = await Profile.find({user: user.following})

  res.status(200).json({following: following})
})

user.get('/search/:name', async(req, res) => {
  try {
  const {name} = req.params 
  
  const user = await Profile.findOne({name: name}) 

  
  if(!user){
    res.status(400).json({message: "User not found"}) 
    return 
  } 

  res.status(200).json({user: user})
  }catch(err) { 
    console.log(err)
  }
})


export default user