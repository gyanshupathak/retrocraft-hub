const mongoose = require("mongoose");
const User = require("./UserModels");

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
  },
  username: {
    type: String,
    required: [true, "your username is required"],
    unique: true,
  },
  description: {
    type: String,
  },
  profileImage: {
    type: String,
    default: "",
  },
  portfolio: {
    type: String,
    default: "",
  },
  contact:{
    type:Number,
    default:""
  },
  jobProfile :{
    type:String,
    default:""
  },
  previousJobs:{
    type:String,
    default:""
  },
  expectedPaygrade:{
    type:String,
    default:""
  },
  
  
});

module.exports = mongoose.model("Profile" , profileSchema);

