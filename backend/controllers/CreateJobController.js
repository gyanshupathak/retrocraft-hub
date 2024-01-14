const createJobSchema = require('../models/CreateJobModels');

module.exports.CreateJob = async (req, res) => {
    try{
        const { title, positionsAvailable, dateOfPosting, skills, jobType, duration, salary , location } = req.body;
        const userId = req.user.id;
        const job = await createJobSchema.create({userId, title, positionsAvailable , dateOfPosting, skills, jobType, duration, salary, location });
        res.status(201).json({ message: "Job created successfully", success: true, job });

    }
    catch(error){
        console.error(error);
        res.status(500).json({ message: "Error creating job", success: false, error: error.message });
    }
}