import {v2 as cloudinary} from 'cloudinary' 
import multer from 'multer' 


cloudinary.config({
    cloud_name: "ditls34gp", 
    api_key: "272555834672159", 
    api_secret: "4DmUvkz9Ej5UpDEcIwv4X0ovalY"
})

const upload = multer({dest: 'uploads/'}) 

export default upload