import React ,{useEffect} from "react";
import NavbarProducer from "../../components/navbar/NavbarProducer";
import { useState } from "react";
import axios from "axios";
import styles from "./Dashboard.module.css";
import { FormControl, InputLabel, MenuItem, Select, TextField, Chip, Typography } from '@mui/material';
import { ToastContainer, toast } from "react-toastify";
import { Button, Dialog, DialogTitle,IconButton, DialogContent, Slider } from "@mui/material";
import { FilterList } from "@mui/icons-material";
import ViewApplicants from '../applicants/ViewApplicants';
import { Link } from 'react-router-dom';




const CreateJob = (props) => {
  const [formData, setFormData] = React.useState({
    title: '',
    skills: [],
    jobType: '',
    duration: '',
    salary: '',
    positionsAvailable: '',
    location: '',
  });

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSkillsChange = (skills) => {
    setFormData((prevData) => ({
      ...prevData,
      skills: skills,
    }));
  };

  const handleAddSkill = (newSkill) => {
    if (newSkill.trim() !== '' && !formData.skills.includes(newSkill)) {
      setFormData((prevData) => ({
        ...prevData,
        skills: [...prevData.skills, newSkill.trim()],
      }));
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    const updatedSkills = formData.skills.filter((skill) => skill !== skillToRemove);
    handleSkillsChange(updatedSkills);
  };

 

  const handleError = (err) =>
    toast.error(err, {
      position: "bottom-left",
    });
  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: "bottom-right",
    });

  
    const handleSubmit = async (e) => {
      e.preventDefault();
    
      try {
        const token = sessionStorage.getItem('token');
        const response = await axios.post(
          "http://localhost:8001/jobs/createjob",
          formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        }
        );
        
        console.log(response);
    
        const { success, message } = response.data;
    
        if (success) {
          handleSuccess(message);
          props.addJob(formData);
        } else {
          handleError(message);
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      } finally {
        // Reset form values and close the popup
        setFormData({
          title: "",
          skills: [],
          jobType: "",
          duration: "",
          salary: "",
          positionsAvailable: "",
          location: "",
        });
    
        props.toggle();
      }
    };
    
  return (
      <div className={styles.popup}>
      <div className={styles.popup_inner}>
        <Typography variant="h6">Create Panel</Typography>
        <form onSubmit={handleSubmit}>
          <div>
            <TextField
              label="Title"
              type="text"
              name="title"
              value={formData.title}
              placeholder="Enter Job Title"
              onChange={handleOnChange}
            />
          </div>
          
          <div>
          <div>
            

            {/* Modified TextField for Skills */}
            <TextField
              label="Skills"
              type="text"
              name="skills"
              placeholder="Type and press Enter to add a skill"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill(e.target.value);
                  e.target.value = '';
                }
              }}
            />
            {/* Display chips for each skill */}
            <div className={styles.chipsContainer}>
              {formData.skills.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  onDelete={() => handleRemoveSkill(skill)}
                  className={styles.skillChip}
                />
              ))}
            </div>
          </div>
          </div>
          <div>
            <FormControl>
              <InputLabel htmlFor="jobType">Job Type</InputLabel>
              <Select
                labelId="jobType-label"
                id="jobType"
                value={formData.jobType}
                onChange={handleOnChange}
                label="Job Type"
                name="jobType"
              >
                <MenuItem value="fullTime">Full Time</MenuItem>
                <MenuItem value="partTime">Part Time</MenuItem>
                <MenuItem value="contract">Contract</MenuItem>
                {/* Add more options as needed */}
              </Select>
            </FormControl>
          </div>
          <div>
            <FormControl>
              <InputLabel htmlFor="duration">Duration</InputLabel>
              <Select
                labelId="duration-label"
                id="duration"
                value={formData.duration}
                onChange={handleOnChange}
                label="Duration"
                name="duration"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => (
                  <MenuItem key={month} value={month}>
                    {month} {month === 1 ? 'month' : 'months'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div>
            <TextField
              label="Salary"
              type="number"
              name="salary"
              value={formData.salary}
              placeholder="Enter salary"
              onChange={handleOnChange}
            />
          </div>
          <div>
            <TextField
              label="Positions Available"
              type="number"
              name="positionsAvailable"
              value={formData.positionsAvailable}
              placeholder="Enter positions available"
              onChange={handleOnChange}
            />
          </div>
          <div>
            <FormControl>
              <InputLabel htmlFor="Location">Location</InputLabel>
              <Select
                labelId="location-label"
                id="location"
                value={formData.location}
                onChange={handleOnChange}
                label="Location"
                name="location"
              >
                <MenuItem value="OnSite">On Site</MenuItem>
                <MenuItem value="WorkFromHome">Work From Home </MenuItem>
              </Select>
            </FormControl>
          </div>
          
         
          <Button variant="contained" color="primary" type="submit">
            Create
          </Button>
        </form>
        <Button onClick={props.toggle}>Close</Button>
      </div>
    </div>
  );

};
const DashboardProducer = () => {
  const [seen, setSeen] = useState(false);
  const [jobs, setJobs] = useState([]);
  
  const [filterLocation, setFilterLocation] = useState(null);
  const [filterJobType, setFilterJobType] = useState(null);
  const [filterDuration, setFilterDuration] = useState([1, 12]);
  const [filterSalary, setFilterSalary] = useState([10000, 100000]);
  const [filterVisible, setFilterVisible] = useState(false);
  const [filterTitle, setFilterTitle] = useState(""); 
  const [viewApplicants, setViewApplicants] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  

  const handleSuccess = (msg) => {
    toast.success(msg, {
      position: 'bottom-right',
    });
  };
  
  const handleError = (err) => {
    toast.error(err, {
      position: 'bottom-left',
    });
  };


  const handleDeleteJob = async (jobId) => {
    const token = sessionStorage.getItem('token');

    try {
      const response = await axios.delete(`http://localhost:8001/jobs/deletejob/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });

      const { success, message } = response.data;

      if (success) {
        // Update the jobs state by filtering out the deleted job
        const updatedJobs = jobs.filter((job) => job._id !== jobId);
        setJobs(updatedJobs);
        localStorage.setItem('jobs', JSON.stringify(updatedJobs));

        handleSuccess(message);
      } else {
        handleError(message);
      }
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  // Fetch jobs from the database when the component mounts
  useEffect(() => {
    // Retrieve the token from the session storage
  const token = sessionStorage.getItem('token');
    const fetchJobs = async () => {
      try {
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
        console.log(jobsData);
        if (Array.isArray(jobsData.jobs)) {
          setJobs(jobsData.jobs);
          localStorage.setItem('jobs', JSON.stringify(jobsData.jobs));
        } else {
          console.error('Invalid data received from the API:', jobsData);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };
  
    fetchJobs();
  }, [filterDuration, filterJobType, filterLocation, filterSalary, filterTitle]);
  
  
  
  const togglePop = (index) => {
    setSeen(!seen);
    
  };

  const addJob = (job) => {
    const newJobs = [...jobs, job];
    setJobs(newJobs);
    localStorage.setItem('jobs', JSON.stringify(newJobs));
  
  };
  
  const handleApplyFilters = () => {
    setFilterVisible(false);
  }

  

  return (
    <>
      <NavbarProducer />
      <div className={styles.filterIconContainer}>
        <IconButton onClick={() => setFilterVisible(true)} className={styles.filterIcon}>
          <FilterList />
        </IconButton>
      </div>
      
      <div className={styles.cardsContainer}>
        {jobs && jobs.map((job, index) => (
          
          <div key={index} className={styles.cards}>
            <h3 className={styles.title}> {job.title}</h3>
            <h3>Available Positions: {job.positionsAvailable}</h3>
            <h3>Skills Required: {job.skills}</h3>
            <h3>Job Type: {job.jobType}</h3>
            <h3>Duration: {job.duration}</h3>
            <h3>Location:{job.location}</h3>
            <button className={styles.view} >
            <Link to={`/viewapplicants/${job._id}`}>View Applicants</Link> 
              </button>
            <button className={styles.delete} onClick={() => handleDeleteJob(job._id)} >Delete Job</button>
          </div>
        ))}
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

      <button onClick={() => setSeen(!seen)} className={styles.create}>Create</button>
      {seen ? <CreateJob toggle={togglePop} addJob={addJob} /> : null}

      {viewApplicants && selectedJobId && (
        <ViewApplicants jobId={selectedJobId} />
      )}
      
      <ToastContainer />
    </>
  );
};

export default DashboardProducer;






