const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const Profile = require("../models/ProfileModels");
const fs = require("fs");
const dir= './images';

if (!fs.existsSync(dir)){
  fs.mkdirSync(dir);
}

 //ADD PROFILE PHOTO LOGIC
 const storage = multer.diskStorage({
  
    destination: (req, file, cb) => {
      cb(null,'images');
    },
    filename: (req, file, cb) => {
      cb(null, uuidv4() + '-' + Date.now() + path.extname(file.originalname));
    }
   });
   const fileFilter = (req, file, cb) => {
    const allowedFileTypes =[ 'image/jpeg', 'image/jpg', 'image/png'];
    if(allowedFileTypes.includes(file.mimetype)){
      cb(null, true);
    } else {
      cb(null, false);
    }
   }
  
   let upload = multer({ storage, fileFilter });

  module.exports.Description = [upload.single('profileImage'), async (req, res, next) => {
    try {

    const { username, description , contact ,userId } = req.body;

    const profileImage = req.file ? req.file.path : null;

    if(!username){
      return res.json({message:'Username is required'})
    }

    if(isNaN(contact)){
      return res.json({message:'Contact must be a number'})
    }
    
      const profile = await Profile.create({ username, description, contact , profileImage , userId});
      res
      .status(201)
      .json({ message: "User signed in successfully", success: true, profile });
      next();
    } catch (error) {
      console.error(error);
    }
}];