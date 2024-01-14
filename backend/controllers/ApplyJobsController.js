
const AppliedJobModel = require('../models/AppliedJobModels');
const CreateJobModel = require('../models/CreateJobModels'); 

module.exports.ApplyJobs = async (req, res) => {
  try {
    if (!req.user || !req.body) {
      return res.status(400).json({ message: "Request is missing user or body", success: false });
    }
    const { jobId, sopText } = req.body;
    const freelancerId = req.user.id; // use req.user.id as the freelancerId

    // Check if the job exists
    const job = await CreateJobModel.findById(jobId);
    if (!job) {
      return res.status(400).json({ message: "Job not found", success: false });
    }

    // Check if the user has already applied
    const existingApplication = await AppliedJobModel.findOne({ freelancerId, jobId });
    if (existingApplication) {

      return res.status(400).json({ message: "You have already applied for this job", success: false });
    }

    // Create a new applied job entry
    const appliedJob = new AppliedJobModel({ jobId, sopText, freelancerId });
    await appliedJob.save();

    res.status(200).json({ message: "Job applied successfully", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error applying for job", success: false, error: error.message });
  }
};



  module.exports.AppliedJobs = async (req, res) => {
    try {
      const jobId  = req.params.jobId; // assuming the jobId is sent as a URL parameter
      if (!jobId) {
        return res.status(400).json({ message: "Job ID is required", success: false });
      }
  
      // Find the applied jobs for the given job ID
      const appliedJobs = await AppliedJobModel.find({ jobId });
  
      res.status(200).json({ message: "Applied jobs fetched successfully", success: true, data: appliedJobs });
    } catch (error) {
      console.error('Error fetching applicants:', error);
      res.status(500).json({ message: "Error fetching applicants", success: false, error: error.message });
    }
  };


