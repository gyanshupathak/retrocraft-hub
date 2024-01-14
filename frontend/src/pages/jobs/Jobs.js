import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/navbar/NavbarFreelancer';
import styles from './Jobs.module.css';
import { FilterList } from "@mui/icons-material";
import { Button, Dialog, DialogTitle,IconButton, DialogContent, Slider } from "@mui/material";
import { FormControl, InputLabel, MenuItem, Select, TextField,  Typography } from '@mui/material';
import Chip from '@material-ui/core/Chip';




const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [filterLocation, setFilterLocation] = useState(null);
  const [filterJobType, setFilterJobType] = useState(null);
  const [filterDuration, setFilterDuration] = useState([1, 12]);
  const [filterSalary, setFilterSalary] = useState([10000, 100000]);
  const [filterVisible, setFilterVisible] = useState(false);
  const [filterTitle, setFilterTitle] = useState(""); 
  const [sopText, setSopText] = useState(""); // New state for SOP text
  const [sopDialogVisible, setSopDialogVisible] = useState(false); // State to control SOP dialog visibility
  const [jobAppliedStatus, setJobAppliedStatus] = useState({});

  const [sopJobIndex, setSopJobIndex] = useState(null);


// Fetch applied jobs when component mounts
useEffect(() => {
  const token = sessionStorage.getItem('token');
  const userId = localStorage.getItem('_id');
  const fetchAppliedJobs = async () => {
    try {
      const response = await axios.get(`http://localhost:8001/jobs/appliedJobsForUser/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });

      if (Array.isArray(response.data.jobsWithAppliedStatus)) {
        const storedJobAppliedStatus = JSON.parse(localStorage.getItem('jobAppliedStatus')) || {};
        setJobAppliedStatus(storedJobAppliedStatus);

        const jobsWithAppliedStatus = response.data.jobsWithAppliedStatus.map((job) => ({
          ...job,
          isApplied: String(job._id) in storedJobAppliedStatus ? storedJobAppliedStatus[String(job._id)] : false,
        }));

        setAppliedJobs(jobsWithAppliedStatus);
      } else {
        console.error('Invalid data received from the API:', response.data);
      }
    } catch (error) {
      console.error("Error fetching applied jobs:", error.response || error);    }
  };

  fetchAppliedJobs();
}, []);
  
  // Fetch jobs from the database when the component mounts
 // Fetch jobs from the database when the component mounts or when filters change
useEffect(() => {
  const fetchJobs = async () => {
    try {
      const token = sessionStorage.getItem('token');

      const response = await axios.get("http://localhost:8001/jobs/getjobs", {
        params: {
          jobType: filterJobType,
          duration: filterDuration,
          salary: filterSalary,
          title: filterTitle,
          location: filterLocation,
        },
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });

      const jobsData = response.data;

      if (Array.isArray(jobsData.jobs)) {
        // Retrieve the current jobAppliedStatus from localStorage
        const storedJobAppliedStatus = JSON.parse(localStorage.getItem('jobAppliedStatus')) || {};

        // Initialize jobAppliedStatus with the stored data from localStorage
        setJobAppliedStatus(storedJobAppliedStatus);

        // Update jobs array to include applied status
        const jobsWithAppliedStatus = jobsData.jobs.map((job) => ({
          ...job,
          isApplied: job._id in jobAppliedStatus ? jobAppliedStatus[job._id] : false,
        }));

        // Update jobs array with the applied status
        setJobs(jobsWithAppliedStatus);
        // Save the updated jobs array to localStorage
        localStorage.setItem('jobs', JSON.stringify(jobsWithAppliedStatus));

      // Save the updated applied status in localStorage
      localStorage.setItem('jobAppliedStatus', JSON.stringify(jobAppliedStatus));

      } else {
        console.error('Invalid data received from the API:', jobsData);
      }
    } catch (error) {
      console.error("Error fetching applied jobs:", error.response || error);
    }
  };

  fetchJobs();
}, [filterDuration, filterJobType, filterLocation, filterSalary, filterTitle]);

  
  
  
 



  const handleApply = async (jobIndex) => {
    // Check if the job is in the applied jobs list
    const job = jobs[jobIndex];
    const isApplied = appliedJobs.some(appliedJob => appliedJob._id === job._id);
  
    // If the job is not already applied for, update the applied status and open the SOP dialog
    if (!isApplied) {
      setJobAppliedStatus((prevStatus) => ({
        ...prevStatus,
        [job._id]: true, // Use job._id as the key for jobAppliedStatus
      }));
      setSopDialogVisible(true);
      setSopJobIndex(jobIndex);
    }
  };

  const handleApplySop = async () => {
    try {
      
      // Close the SOP dialog
      setSopDialogVisible(false);
  
      // Get the job index for which the user is applying
      const jobIndex = sopJobIndex;
      const token = sessionStorage.getItem('token');


      console.log("jobIndex:", jobIndex);
      console.log("jobs[jobIndex]._id:", jobs[jobIndex]._id);

      // Apply for the job
      const response = await axios.post("http://localhost:8001/jobs/apply", {
        sopText: sopText,
        jobId: jobs[jobIndex]._id,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });

  
      // If the request was successful, update the applied status for the corresponding job
      if (response.status === 200) {
        // Update the applied jobs list
        setAppliedJobs(prevJobs => [...prevJobs, jobs[jobIndex]]);
        
        // Update the applied status for the corresponding job
        setJobAppliedStatus((prevStatus) => ({
          ...prevStatus,
          [jobIndex]: true,
        }));
        
         // Trigger a re-render to reflect the updated applied status
        // This will update the button text from "Apply" to "Applied"
        setJobs((prevJobs) => {
          const updatedJobs = [...prevJobs];
          updatedJobs[jobIndex].isApplied = true;
          return updatedJobs;
        });

 // Log the updated jobAppliedStatus
 console.log("Updated jobAppliedStatus:", {
  ...jobAppliedStatus,
  [jobIndex]: true,
});
        // Store the updated applied status in localStorage
        localStorage.setItem('jobAppliedStatus', JSON.stringify({
          ...jobAppliedStatus,
          [jobIndex]: true,
        }));
        console.log("jobAppliedStatus:", jobAppliedStatus);
        console.log("Local Storage jobAppliedStatus:", localStorage.getItem('jobAppliedStatus'));

  
        console.log("Job application successful");
      } else {
        console.error("Job application failed:", response.data);
      }
    } catch (error) {
      console.error("Error applying for job:", error);
    }
  };
  


  useEffect(() => {
    const fetchJobs = async () => {
      const token = sessionStorage.getItem('token');
    
      try {
        const response = await axios.get("http://localhost:8001/jobs/getjobs", {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        });

        const jobsData = response.data;


        if (Array.isArray(jobsData.jobs)) {
          setJobs(jobsData.jobs);
        } else {
          console.error('Invalid data received from the API:', jobsData);
        }
      } catch (error) {
        console.error("Error fetching applied jobs:", error.response || error);      }
    };

    fetchJobs();
  }, []);



  const handleApplyFilters = () => {
    setFilterVisible(false);
  }



  return (
    <>
    <Navbar />
    <div className={styles.filterIconContainer}>
        <IconButton onClick={() => setFilterVisible(true)} className={styles.filterIcon}>
          <FilterList />
        </IconButton>
    </div>
    <div className={styles.cardsContainer}>
        {jobs && jobs.map((job, index) => {
            const isApplied = appliedJobs.some(appliedJob => appliedJob._id === job._id);
            const formattedLocation = job && job.location ? job.location.replace(/([a-z])([A-Z])/g, '$1 $2') : '';
            
            return (
              <div key={index} className={styles.cards}>
                <h3 className={styles.title}> {job.title}</h3>
                <h3>Available Positions :{job.positionsAvailable}</h3>
                <h3>Skills Required :     {job.skills}</h3>
                <h3>Job Type : {job.jobType}</h3>
                <h3>Duration : {job.duration}</h3>
                <h3>Salary : {job.salary}</h3>
                <h3>Location :{formattedLocation}</h3>

                <button
                className={`${styles.apply} ${isApplied ? styles.appliedButton : ''}`}
                onClick={() => handleApply(index)}
                disabled={isApplied}
                >
                  {isApplied ? "Applied" : "Apply"}
                </button>       
              </div>
            );
        })}
    </div>

      {/* Filter Popup */}
      <Dialog open={filterVisible} onClose={() => setFilterVisible(false)} className={styles.dialogContainer}>
        <div className={styles.filterContainer}>
        <DialogTitle>Filter Options</DialogTitle>
        <DialogContent className={styles.dialogContent}>

        <Typography variant="h6">Location</Typography>
          <FormControl  className={styles.formElement}>
            <InputLabel htmlFor="filterLocation">Select Location Type</InputLabel>
            <Select
              labelId="filterLocation-label"
              id="filterLocation"
              value={filterLocation || ""}
              onChange={(e) => setFilterLocation(e.target.value)}
              label="Select Location"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="onSite">On Site</MenuItem>
              <MenuItem value="workFromHome">Work From Home</MenuItem>
            </Select>
          </FormControl>
          


          {/* Job Type Filter */}
          <Typography variant="h6">Job Type</Typography>
          <FormControl  className={styles.formElement}>
            <InputLabel htmlFor="filterJobType">Select Job Type</InputLabel>
            <Select
              labelId="filterJobType-label"
              id="filterJobType"
              value={filterJobType || ""}
              onChange={(e) => setFilterJobType(e.target.value)}
              label="Select Job Type"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="fullTime">Full Time</MenuItem>
              <MenuItem value="partTime">Part Time</MenuItem>
              <MenuItem value="contract">Contract</MenuItem>
            </Select>
          </FormControl>

          {/* Salary Filter */}
          <Typography variant="h6">Salary</Typography>
          <div className={styles.sliderContainer}>
          <Slider
            value={filterSalary}
            onChange={(event, newValue) => setFilterSalary(newValue)}
            valueLabelDisplay="auto"
            min={10000}
            max={100000}
            step={10000}
          />
          </div>


           {/* Duration Filter */}
           <Typography variant="h6">Duration</Typography>
          <div className={styles.sliderContainer}>
          <Slider
            value={filterDuration}
            onChange={(event, newValue) => setFilterDuration(newValue)}
            valueLabelDisplay="auto"
            min={1}
            max={12}
            step={1}
          />
          </div>
         

          {/* Title Filter */}
          <Typography variant="h6">Title</Typography>
          <div className={styles.formElement}>
          <TextField
            label="Select Title"
            select
            value={filterTitle || ""}
            onChange={(e) => setFilterTitle(e.target.value)}
            variant="outlined"
            fullWidth
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Video Editor">Video Editor</MenuItem>
            <MenuItem value="Graphic Designer">Designer</MenuItem>
            <MenuItem value="Sound Engineer">Sound Engineer</MenuItem>
            {/* Add more titles as needed */}
          </TextField>
          </div>
         

          {/* Add other filters as needed */}
        </DialogContent>
        </div>
        
        <div className={styles.applyButtonContainer}>
        <Button variant="contained" color="primary" onClick={handleApplyFilters}>
          Apply
        </Button>
      </div>     
      </Dialog>


      {/* SOP Dialog */}
      <Dialog
        open={sopDialogVisible}
        onClose={() => setSopDialogVisible(false)}
        className={styles.dialogContainer}
      >
        <div className={styles.filterContainer}>
          <DialogTitle>Write Your Statement of Purpose (SOP)</DialogTitle>
          <DialogContent className={styles.dialogContent}>
            <TextField
              label="SOP"
              multiline
              rows={4}
              variant="outlined"
              fullWidth
              value={sopText}
              onChange={(e) => setSopText(e.target.value)}
            />
          </DialogContent>
        </div>

        <div className={styles.applyButtonContainer}>
          <Button variant="contained" color="primary" onClick={handleApplySop}>
            Apply
          </Button>
        </div>
      </Dialog>


    </>
    
  );
};

export default Jobs;