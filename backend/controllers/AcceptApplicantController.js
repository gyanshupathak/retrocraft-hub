const AppliedJobModel = require('../models/AppliedJobModels');
const CreateJobModel = require('../models/CreateJobModels');



module.exports.AcceptApplicant = async (req, res) => {
    const { applicantId } = req.params;
    const { jobId } = req.body;
  
    try {
      // Find the application and update its status
      const application = await AppliedJobModel.findOneAndUpdate(
        { _id: applicantId, jobId },
        { status: 'Accepted' },
        { new: true }
      );
  
      // Find the job and add the applicant to its list of freelancers
      const job = await CreateJobModel.findByIdAndUpdate(
        jobId,
        { $push: { freelancers: applicantId } },
        { new: true }
      );
      if (!job) {
        res.json({ success: false, message: 'Job not found.' });
        return;
      }
      res.json({ success: true, message: 'Applicant accepted successfully.' });
    } catch (error) {
      console.error('Error accepting applicant:', error);
      res.json({ success: false, message: 'An error occurred while accepting the applicant.' });
    }
  };



  module.exports.GetAcceptedJobs = async (req, res) => {
    const { userId } = req.query; // assuming the query parameter is named 'userId'
    try {
      const applications = await AppliedJobModel.find({ freelancerId: userId, status: 'Accepted' }).populate('jobId');
      // Extract the job details from each application
      const jobs = applications.map(application => application.jobId);
  
      res.json({ success: true, data: jobs });
    } catch (error) {
      console.error('Error fetching accepted jobs:', error);
      res.json({ success: false, message: 'An error occurred while fetching accepted jobs.' });
    }
  };