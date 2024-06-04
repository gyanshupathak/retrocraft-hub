const mongoose = require("mongoose");
const User = require("./UserModels");

const producerProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
  },
  
  username: {
    type: String,
    required: [true, "your username is required"],
    unique: true,
  },
 
  profileImage: {
    type: String,
    default: "",
  },
  
  contact:{
    type:Number,
    default:""
  },
  
  
});

module.exports = mongoose.model("ProducerProfile" , producerProfileSchema);

