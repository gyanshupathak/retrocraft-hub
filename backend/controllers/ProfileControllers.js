const profileSchema = require("../models/ProfileModels.js");
const { User } = require("../models/UserModels.js");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const ProducerProfile = require("../models/ProducerProfileModels");
const fs = require("fs");
const dir= './images';

module.exports.Profile = async (req, res) => {
  try {
    // Assuming you have a user object stored in req.user during authentication
    const userId = req.params.userId;

    // Fetch the profile for the logged-in user
    const userProfile = await profileSchema
      .findOne({ userId })
      .populate("userId");

    if (userProfile) {
      res
        .status(200)
        .json({
          message: "Profile fetched successfully",
          success: true,
          profile: userProfile,
        });
    } else {
      res.status(404).json({ message: "Profile not found", success: false });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: "Error fetching profile",
        success: false,
        error: error.message,
      });
  }
};

module.exports.updateProfile = async (req, res) => {
  try {
    // Assuming you have a user object stored in req.user during authentication
    const userId = req.user.id;

    // Fetch the profile for the logged-in user
    const userProfile = await profileSchema.findOne({ userId });

    if (userProfile) {
      // Update the profile
      const updatedProfile = await profileSchema.findOneAndUpdate(
        { userId },
        req.body,
        { new: true }
      );

      res
        .status(200)
        .json({
          message: "Profile updated successfully",
          success: true,
          profile: updatedProfile,
        });
    } else {
      res.status(404).json({ message: "Profile not found", success: false });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: "Error updating profile",
        success: false,
        error: error.message,
      });
  }
};

module.exports.getProducerProfile = async (req, res) => {
  try {
    // Assuming you have a user object stored in req.user during authentication
    const userId = req.params.userId;
    const user = await User.findById(userId);
    // Fetch the profile for the logged-in user
    const userProfile = await ProducerProfile
    .findOne({ userId })
    .populate({
      path: 'userId',
      select: 'email' 
    });


    if (userProfile) {
      res
        .status(200)
        .json({
          message: "Profile fetched successfully",
          success: true,
          profile: userProfile,
          email: user.email
        });
    } else {
      res.status(200).json({ message: "ProducerProfile not found", success: true, email: user.email });    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: "Error fetching profile",
        success: false,
        error: error.message,
      });
  }
};


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

  module.exports.ProducerProfile = [upload.single('profileImage'), async (req, res, next) => {
    try {

    const { username, contact ,userId } = req.body;
    const profileImage = req.file ? req.file.path : null;
    if(!username){
      return res.json({message:'Username is required'})
    }

    if(isNaN(contact)){
      return res.json({message:'Contact must be a number'})
    }
    
      const profile = await ProducerProfile.create({ username, contact, profileImage,userId});
      res
      .status(201)
      .json({ message: "User signed in successfully", success: true, profile });
      next();
    } catch (error) {
      console.error(error);
    }
}];













