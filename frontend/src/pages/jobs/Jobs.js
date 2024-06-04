import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/navbar/NavbarFreelancer";
import styles from "./Jobs.module.css";
import { FilterList } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
  Slider,
} from "@mui/material";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Chip from "@material-ui/core/Chip";
import Footer from "../../components/Footer/Footer";
import noData from "../../assets/images/home/nodata.jpg";

const Jobs = () => {
  const [profileData, setProfileData] = useState({});
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

  // Set jobAppliedStatus state with data from localStorage when component mounts
  useEffect(() => {
    // Retrieve jobAppliedStatus from localStorage
    const storedJobAppliedStatus =
      JSON.parse(localStorage.getItem("jobAppliedStatus")) || {};

    // Set the jobAppliedStatus state
    setJobAppliedStatus(storedJobAppliedStatus);
  }, []); // Empty dependency array ensures this runs only once when component mounts

  
  // Fetch jobs from the database when the component mounts or when filters change
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = sessionStorage.getItem("token");

        const response = await axios.get("http://localhost:8001/jobs/getjobs", {
          params: {
            jobType: filterJobType,
            duration: filterDuration,
            salary: filterSalary,
            title: filterTitle,
            location: filterLocation,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        const jobsData = response.data;

        if (Array.isArray(jobsData.jobs)) {
          // Retrieve the current jobAppliedStatus from localStorage
          const storedJobAppliedStatus =
            JSON.parse(localStorage.getItem("jobAppliedStatus")) || {};

         

          // Update jobs array to include applied status
          const jobsWithAppliedStatus = jobsData.jobs.map((job) => ({
            ...job,
            isApplied:
              job._id in storedJobAppliedStatus
                ? storedJobAppliedStatus[job._id]
                : false,
          }));

          // Update jobs array with the applied status
          setJobs(jobsWithAppliedStatus);
          // Save the updated jobs array to localStorage
          localStorage.setItem("jobs", JSON.stringify(jobsWithAppliedStatus));

           // Initialize jobAppliedStatus with the stored data from localStorage
           setJobAppliedStatus(storedJobAppliedStatus);
        } else {
          console.error("Invalid data received from the API:", jobsData);
        }
      } catch (error) {
        console.error("Error fetching applied jobs:", error.response || error);
      }
    };

    fetchJobs();
  }, [
    filterDuration,
    filterJobType,
    filterLocation,
    filterSalary,
    filterTitle,
  ]);

  const handleApply = async (jobIndex) => {
    // Check if the job is in the applied jobs list
    const job = jobs[jobIndex];
    const isApplied = appliedJobs.some(
      (appliedJob) => appliedJob._id === job._id
    );

   // If the job is not already applied for, update the applied status and open the SOP dialog
  if (!isApplied) {
    setJobAppliedStatus((prevStatus) => {
      const updatedStatus = {
        ...prevStatus,
        [job._id]: true, // Use job._id as the key for jobAppliedStatus
      };

      // Update the jobs state
      setJobs((prevJobs) => {
        const updatedJobs = [...prevJobs];
        updatedJobs[jobIndex] = {
          ...updatedJobs[jobIndex],
          isApplied: true,
        };
        return updatedJobs;
      });

      return updatedStatus;
    });
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
      const token = sessionStorage.getItem("token");

      // Apply for the job
      const response = await axios.post(
        "http://localhost:8001/jobs/apply",
        {
          sopText: sopText,
          jobId: jobs[jobIndex]._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      // If the request was successful, update the applied status for the corresponding job
      if (response.status === 200) {
        const jobId = jobs[jobIndex]._id;
        // Update the applied jobs list
        setAppliedJobs((prevJobs) => [...prevJobs, jobs[jobIndex]]);

        // Update the applied status for the corresponding job
        setJobAppliedStatus((prevStatus) => {
          const updatedStatus = { ...prevStatus, [jobId]: true };
        
          // Store the updated applied status in localStorage
          localStorage.setItem("jobAppliedStatus", JSON.stringify(updatedStatus));
        
          // Return the updated status to update the state
          return updatedStatus;
        });

        // This will update the button text from "Apply" to "Applied"
        setJobs((prevJobs) => {
          const updatedJobs = [...prevJobs];
          updatedJobs[jobIndex].isApplied = true;
          return updatedJobs;
        });
        
      } else {
        console.error("Job application failed:", response.data);
      }
    } catch (error) {
      console.error("Error applying for job:", error);
    }
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      const token = sessionStorage.getItem("token");

      try {
        // Fetch jobs
        const response = await axios.get("http://localhost:8001/jobs/getjobs", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        const jobsData = response.data;

        if (Array.isArray(jobsData.jobs)) {
          setJobs(jobsData.jobs);

          // Fetch profile data for each job's producer
          const profileData = {};
          for (const job of jobsData.jobs) {
            const userId = job.userId;
            const { data } = await axios.get(
              `http://localhost:8001/profile/getproducerprofile/${userId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
              { withCredentials: true }
            );

            const { success, profile } = data;
            if (success) {
              profileData[userId] = profile;
            } else {
              console.error("Failed to fetch profile data:", data);
            }
          }

          setProfileData(profileData);
        } else {
          console.error("Invalid data received from the API:", jobsData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchProfileData();
  }, []);

  const handleApplyFilters = () => {
    setFilterVisible(false);
  };

  return (
    <>
      <Navbar />
      <div className={styles.Jobs}>
        {jobs.length > 0 ? (
          <div>
            <div className={styles.filterIconContainer}>
              <IconButton
                onClick={() => setFilterVisible(true)}
                className={styles.filterIcon}
              >
                <FilterList />
              </IconButton>
            </div>
            <div className={styles.cardsContainer}>
              {jobs &&
                jobs.map((job, index) => {
                  const userId = job.userId;
                  const isApplied = appliedJobs.some(
                    (appliedJob) => appliedJob._id === job._id
                  );
                  const formattedLocation =
                    job && job.location
                      ? job.location.replace(/([a-z])([A-Z])/g, "$1 $2")
                      : "";

                  return (
                    <div key={index} className={styles.jobCards}>
                      <div className={styles.photoWrapper}>
                        <img
                          src={
                            profileData &&
                            profileData[userId] &&
                            profileData[userId].profileImage
                              ? `http://localhost:8001/${profileData[
                                  userId
                                ].profileImage.replace(/\\/g, "/")}`
                              : ""
                          }
                          alt="Profile"
                        />
                        <h3 className={styles.by}>
                          {" "}
                          -{profileData[userId] &&
                            profileData[userId].username}{" "}
                        </h3>
                      </div>
                      <div className={styles.jobSpecs}>
                        <h3 className={styles.title}> {job.title}</h3>
                        <h3>Available Positions :{job.positionsAvailable}</h3>
                        <h3 className={styles.specs}>
                          Skills Required:{" "}
                          {job.skills.map((skill, index) => (
                            <Chip
                              key={index}
                              label={skill}
                              className={styles.chip}
                            />
                          ))}
                        </h3>{" "}
                        <h3>Job Type : {job.jobType}</h3>
                        <h3>Duration : {job.duration}</h3>
                        <h3>Salary : {job.salary}</h3>
                        <h3>Location :{formattedLocation}</h3>
                        <button
                          className={`${styles.apply} ${
                            isApplied ? styles.appliedButton : ""
                          }`}
                          onClick={() => handleApply(index)}
                          disabled={job.isApplied}
                        >
                          {job.isApplied ? "Applied" : "Apply"}
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
            {/* Filter Popup */}
            <Dialog
              open={filterVisible}
              onClose={() => setFilterVisible(false)}
              className={styles.dialogContainer}
            >
              <div className={styles.filterContainer}>
                <DialogTitle>Filter Options</DialogTitle>
                <DialogContent className={styles.dialogContent}>
                  <Typography variant="h6">Location</Typography>
                  <FormControl className={styles.formElement}>
                    <InputLabel htmlFor="filterLocation">
                      Select Location Type
                    </InputLabel>
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
                  <FormControl className={styles.formElement}>
                    <InputLabel htmlFor="filterJobType">
                      Select Job Type
                    </InputLabel>
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
                      onChange={(event, newValue) =>
                        setFilterDuration(newValue)
                      }
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
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleApplyFilters}
                >
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
                <Button
                  variant="contained"
                  className={styles.sop}
                  onClick={handleApplySop}
                >
                  Apply
                </Button>
              </div>
            </Dialog>
          </div>
        ) : (
          <img src={noData} className={styles.noData}/>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Jobs;
