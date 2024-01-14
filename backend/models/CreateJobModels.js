const mongoose = require("mongoose");

const createJobSchema = new mongoose.Schema( {
   
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    positionsAvailable: {
      type: Number,
    },
    dateOfPosting: {
      type: Date,
      default: Date.now,
    },
    
    skills: [String],
    jobType: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      min: 0,
      
    },
    salary: {
      type: Number,
      min: 0,
    },
    location:{
        type: String,
        required: true,
    },
    
   
  },
);


module.exports = mongoose.model("createJob", createJobSchema);