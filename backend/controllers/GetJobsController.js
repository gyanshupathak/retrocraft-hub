const createJobSchema = require('../models/CreateJobModels');
const jwt = require('jsonwebtoken'); 
const AppliedJobSchema = require('../models/AppliedJobModels');

module.exports.GetJobs = async (req, res) => {
    const {_id , location , jobType , salary , duration ,title} = req.query;

    const TOKEN_KEY = process.env.TOKEN_KEY;
    const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
    if (!token) {
      // Handle the case when the token is not provided
      return res.status(401).json({ message: "Authorization token not provided", success: false });
    }
    let decoded;
    try {
      decoded = jwt.verify(token, TOKEN_KEY);
    } catch (err) {
      return res.status(401).json({ message: "Invalid token", success: false });
    }

    const userId = decoded.id;
    const userRole = decoded.role;

    try{
         // Construct a query object based on the specified filters
    let query = {};
    if (userRole === 'producer') {
        query.userId = userId;
    }
    if (jobType) {
      query.jobType = jobType;
    }
    if (duration) {
      query.duration = { $gte: parseInt(duration[0], 10), $lte: parseInt(duration[1], 10) }; 
    }
    if (salary) {
      query.salary = { $gte: parseInt(salary[0], 10), $lte: parseInt(salary[1], 10) };
    }
    if (title && title.trim() !== '') {
      query.title = { $regex: new RegExp(title, 'i') };
    }
    if (location && location.trim() !== '') {
      query.location = { $regex: new RegExp(location, 'i') };
    }
    // Use the query object in the database find operation
    const jobs = await createJobSchema.find(query);
        res.status(201).json({ message: "Jobs fetched successfully", success: true, jobs });

    }
    catch(error){
        console.error('Error executing query:', error);
        res.status(500).json({ message: "Error fetching jobs", success: false, error: error.message });
    }
}


module.exports.GetAppliedJobs = async (req, res) => {
    const TOKEN_KEY = process.env.TOKEN_KEY;
    const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
    if (!token) {
      // Handle the case when the token is not provided
      return res.status(401).json({ message: "Authorization token not provided", success: false });
    }
    let decoded;
    try {
      decoded = jwt.verify(token, TOKEN_KEY);
    } catch (err) {
      return res.status(401).json({ message: "Invalid token", success: false });
    }
    const userId = decoded.id;
  
    try {
      const appliedJobs = await AppliedJobSchema.find({ userId });
      const appliedJobIds = appliedJobs.map((appliedJob) => appliedJob.jobId.toString());

      const jobs = await AppliedJobSchema.find();
      const jobsWithAppliedStatus = jobs.map((job) => ({
        ...job._doc,
        isApplied: appliedJobIds.includes(job._id.toString()),
      }));


      res.status(200).json({ message: "Applied jobs fetched successfully", success: true, jobsWithAppliedStatus });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching applied jobs", success: false, error: error.message });
    }
  };