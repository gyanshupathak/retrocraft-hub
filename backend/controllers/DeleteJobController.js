const createJobSchema = require('../models/CreateJobModels');
const mongoose = require('mongoose');

module.exports.DeleteJob = async (req, res) => {
    const id = req.params.jobId;

    try {
      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ success: false, message: 'Invalid Job ID format' });
      }

      const job = await createJobSchema.findById(id);
      if (!job) {
        return res.status(404).json({ success: false, message: 'Job not found' });
      }
      
      await createJobSchema.findByIdAndDelete(id);
    
      return res.json({ success: true, message: 'Job deleted successfully' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
}
