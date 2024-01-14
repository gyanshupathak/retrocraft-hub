import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/navbar/NavbarFreelancer';
import styles from './Dashboard.module.css';

const DashboardFreelancer = () => {

  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);

 
  useEffect(() => {
    const fetchAcceptedJobs = async () => {
      try {
        const userId = localStorage.getItem('_id'); // Retrieve the user ID from local storage
        console.log(userId);

        // If userId is null, don't make the API request
        if (!userId) {
          setError('User ID not found.');
          return;
        }
        const token = sessionStorage.getItem('token');
        const response = await axios.get(`http://localhost:8001/jobs/accepted?userId=${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true,
        });

        const { success, data, message } = response.data;

        if (success) {
          setJobs(data);
        } else {
          setError(message);
        }
      } catch (error) {
        console.error('Error fetching accepted jobs:', error);
        setError('An error occurred while fetching accepted jobs.');
      }
    };

    fetchAcceptedJobs();
  }, []);


  return (
    <>
    <Navbar />
    <div className={styles.cardsContainer}>
      {jobs.length > 0 ? (
        jobs.map((job) => (
          <div key={job._id} className={styles.cards}>
            <h3 className={styles.title} >{job.title}</h3>
            <h3>Duration: {job.duration}</h3>
            <h3>Salary: {job.salary}</h3>
            <h3>Location: {job.location}</h3>
          </div>
        ))
      ) : (
        <p className={styles.no}>No ongoing jobs!</p>
      )}
      {error && <p>{error}</p>}
    </div>
  </>

  );
};

export default DashboardFreelancer;