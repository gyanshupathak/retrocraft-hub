const express = require("express");
const router = express.Router();
const { CreateJob } = require ("../controllers/CreateJobController");
const { DeleteJob } = require ("../controllers/DeleteJobController");
const { GetJobs, GetAppliedJobs } = require ("../controllers/GetJobsController");
const {userVerification} = require("../middleawares/AuthMiddleWare")
const { ApplyJobs ,AppliedJobs } = require ("../controllers/ApplyJobsController");
const { AcceptApplicant , GetAcceptedJobs } = require ("../controllers/AcceptApplicantController");


router.post("/createjob", userVerification , CreateJob);
router.get("/getjobs", userVerification , GetJobs);
router.post("/apply", userVerification , ApplyJobs);
router.get("/applied/:jobId", userVerification , AppliedJobs);
router.post("/acceptapplicant/:applicantId", userVerification , AcceptApplicant);
router.get("/accepted", userVerification , GetAcceptedJobs);
router.get("/appliedJobsForUser/:userId", userVerification , GetAppliedJobs);

router.delete("/deletejob/:jobId", userVerification  , DeleteJob);
module.exports = router;