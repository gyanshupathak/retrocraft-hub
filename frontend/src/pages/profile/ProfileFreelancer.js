import React, { useEffect, useState } from 'react';
import Navbar from '../../components/navbar/NavbarFreelancer';
import axios from 'axios';
import styles from './Profile.module.css';

const ProfileFreelancer = () => {
  const [profileData, setProfileData] = useState({});
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [description, setDescription] = useState('');
  const [jobProfile, setJobProfile] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [expectedPaygrade, setExpectedPaygrade] = useState('');
  const [previousJobs, setPreviousJobs] = useState('');
  
  const handleCompleteProfileClick = () => {
    setIsEditing(!isEditing);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const userId = localStorage.getItem('_id');
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:8001/profile/update/${userId}`,
        { jobProfile, portfolio, expectedPaygrade, previousJobs },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        { withCredentials: true }
      );
      if (response.data.success) {
        setIsEditing(false);
        // Refresh profile data
      } else {
        console.error("Server response error:", response.data);
      }
    } catch (error) {
      console.error("Failed to update profile data", error);
    }
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      const userId = localStorage.getItem('_id');
      console.log(userId);
      try {
        const token = sessionStorage.getItem('token');
        const { data } = await axios.get(
          `http://localhost:8001/profile/getprofile/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
          { withCredentials: true }
        );

        const { success, profile } = data;
        console.log(data);
        if (success) {
          setProfileData(profile);
        } else {
          setError("Failed to fetch profile data");
          console.error("Server response error:", data);
        }
      } catch (error) {
        setError("Failed to fetch profile data");
        console.log(error);
      }
    };

    fetchProfileData();
  }, []);

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        {console.log(profileData)}
        {error && <p>{error}</p>}
        {profileData && (
          <div className={styles.profileSection}>
            <div className={styles.PhotoWrapper}>
              <img
                src={profileData && profileData.profileImage ? `http://localhost:8001/${profileData.profileImage.replace(/\\/g, '/')}` : ''}
                alt="Profile"
                className={styles.profilePhoto}
              />
            </div>
            <div className={styles.profileDetails}>
              <p>Name: {profileData.username}</p>
              <p className={styles.line}>-------------------------------------------------------------</p>
              <p>Email: {profileData && profileData.userId && profileData.userId.email}</p>
              <p className={styles.line}>-------------------------------------------------------------</p>

              <p>Contact: {profileData.contact}</p>
              <p className={styles.line}>-------------------------------------------------------------</p>

              <p>About You: {profileData.description}</p>
              <p className={styles.line}>-------------------------------------------------------------</p>

              <p>Job Profile: {profileData.jobProfile} </p>
              <p className={styles.line}>-------------------------------------------------------------</p>

              <p>Portfolio: {profileData.portfolio}</p>
              <p className={styles.line}>-------------------------------------------------------------</p>

              <p>Expected Paygrade: {profileData.expectedPaygrade}</p>
              <p className={styles.line}>-------------------------------------------------------------</p>

              <p>Previous Jobs: {profileData.previousJobs}</p>
              <p className={styles.line}>-------------------------------------------------------------</p>

              {isEditing ? (
                <div className={styles.popupForm}>
                   
                  <form onSubmit={handleFormSubmit}>
                  
                    <label>
                      Job Profile:
                      <input type="text" value={jobProfile} onChange={(e) => setJobProfile(e.target.value)} />
                    </label>
                    <label>
                      Portfolio:
                      <input type="text" value={portfolio} onChange={(e) => setPortfolio(e.target.value)} />
                    </label>
                    <label>
                      Expected Paygrade:
                      <input type="text" value={expectedPaygrade} onChange={(e) => setExpectedPaygrade(e.target.value)} />
                    </label>
                    <label>
                      Previous Jobs:
                      <input type="text" value={previousJobs} onChange={(e) => setPreviousJobs(e.target.value)} />
                    </label>
                    <button className={styles.submitButton} type="submit">Submit</button>
                    <button className={styles.closeButton} onClick={handleCompleteProfileClick}>
                    Close
                  </button>
                  </form>
                </div>
              ) : (
                <button className={styles.editButton} onClick={handleCompleteProfileClick}>Complete Profile</button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ProfileFreelancer;
