// ViewApplicants.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavbarProducer from '../../components/navbar/NavbarProducer';
import styles from './ViewApplicants.module.css';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


  const fetchApplicants = async (jobId, setApplicants, setError) => {
  const token = sessionStorage.getItem('token');
  console.log(jobId);
  try {
    const response = await axios.get(`http://localhost:8001/jobs/applied/${jobId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      withCredentials: true,
    });

    const { success, data, message } = response.data;

    if (success) {
      setApplicants(data);
    } else {
      setError(message);
    }
  } catch (error) {
    console.error('Error fetching applicants:', error);
    setError('An error occurred while fetching applicants.');
  }
};


const ViewApplicants = () => {
  const navigate = useNavigate();
  const { jobId } = useParams();
  console.log(jobId);
  const [applicants, setApplicants] = useState([]);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState({});


  useEffect(() => {
    fetchApplicants(jobId, setApplicants, setError);
  }, [jobId]);

  const handleAccept = async (applicantId) => {
    const token = sessionStorage.getItem('token');
    try {
      const response = await axios.post(`http://localhost:8001/jobs/acceptapplicant/${applicantId}`, 
        {jobId},
        {headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true,
      }
      );

      const { success, message } = response.data;
      console.log(response.data);
  
      if (success) {
        setStatus({ ...status, [applicantId]: 'Accepted'});
        fetchApplicants(jobId, setApplicants, setError); // Add arguments here
      } else {
        console.error(message);
      }
    } catch (error) {
      console.error('Error accepting applicant:', error);
    }
  };

  const handleReject = async (applicantId) => {
    navigate('/dashboardproducer' );
  };

  return (
    <>
      <NavbarProducer />
      <div className={styles.viewApplicantsContainer}>
        {error ? (
          <p className={styles.errorMessage}>{error}</p>
        ) : (
          <div className={styles.applicantsContainer}>
            {applicants && applicants.length > 0 ? (
              <ul>
                 <h2>Applicants for Job</h2>
                {applicants.map((applicant) => (
                  
                  <li key={applicant._id}>
                    <p>{applicant.sopText}</p>
                    <button 
                        className={styles.acceptButton}
                        onClick={() => handleAccept(applicant._id)}
                        disabled={status[applicant._id]} 
                      >
                        {status[applicant._id] === 'Accepted' ? 'Accepted' : 'Accept'}
                      </button>
                      <>        </>
                    <button 
                      className={styles.rejectButton}
                      onClick={() => handleReject(applicant._id)}
                      disabled={status[applicant._id]} 
                    >
                      {status[applicant._id] === 'Rejected' ? 'Rejected' : 'Reject'}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No applicants found for this job.</p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ViewApplicants;
