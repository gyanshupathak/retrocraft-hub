const mongoose = require("mongoose");
const User = require("./UserModels");

const producerProfileSchema = new mongoose.Schema({
  email: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
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
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Reference to the User model
},
  
});

module.exports = mongoose.model("ProducerProfile" , producerProfileSchema);

