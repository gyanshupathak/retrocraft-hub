const mongoose = require("mongoose");

const AppliedJobSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "createJob",
    required: true,
  },
  freelancerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
  },
  sopText: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'Pending', // the status is 'Pending' when the application is first created
  },
});

module.exports = mongoose.model("AppliedJob", AppliedJobSchema);