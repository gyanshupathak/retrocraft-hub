import React from 'react';
import {useState} from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import styles from './Profile.module.css';
import Navbar from '../../components/navbar/NavbarProducer';
import Avatar from '@mui/material/Avatar';

const ProfileProducer = () => {
    const [profileData, setProfileData] = useState({});
    const [producerProfileData, setProducerProfileData] = useState({});
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [username, setusername] = useState('');
    const [contact, setcontact] = useState('');
    const [profilePhoto, setProfilePhoto] = useState('');
    const [inputValue, setInputValue] = useState({
    
      username: "",
      profileImage: null,
      contact:"",
    });

      const handleCompleteProfileClick = () => {
        setIsEditing(!isEditing);
      };

      const handleFormSubmit = async (event) => {
        event.preventDefault();

        try {
          const token = sessionStorage.getItem('token');
          const response = await axios.post(
            `http://localhost:8001/profile/createproducerprofile`,
            { username , contact , profilePhoto   },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
    
            { withCredentials: true }
          );
          console.log(response);
          if (response.data.success) {
            setIsEditing(false);


            await fetchProducerProfile();
            // Refresh profile data
          } else {
            console.error("Server response error:", response.data);
          }
        } catch (error) {
          console.error("Failed to update profile data", error);
        }
      };


      const fetchProducerProfile = async () => {
        console.log("Fetching producer profile...");
        const userId = localStorage.getItem('_id');
        try {
          const token = sessionStorage.getItem('token');
          console.log(token); 
          const response = await axios.put(
            `http://localhost:8001/profile/updateproducerprofile/${userId}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
            { withCredentials: true }
          );
      
          if (response.data.success) {
            console.log("Fetched producer profile successfully:", response.data);
            const producerProfileData = response.data.profile; // Adjust the property name based on your API response
          } else {
            console.error("Server response error:", response.data);
          }
        } catch (error) {
          console.error("Failed to fetch producer profile", error);
        }
      };
      


      useEffect(() => {
        const fetchProfileData = async () => {
          const userId = localStorage.getItem('_id');
          try {
            const token = sessionStorage.getItem('token');
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
              setProfileData(profile);
              setProducerProfileData(profile); // Set the producer profile data
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
      

      const handlePhoto = () => {
        // Create a hidden input element
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*"; // Specify accepted file types (e.g., images)
        input.style.display = "none";
      
        // Attach an event listener to handle file selection
        input.addEventListener("change", () => {
          const selectedFile = input.files[0];
      
          if (selectedFile) {
            setInputValue({
              ...inputValue,
              profileImage: selectedFile,
            });
          }
        });
      
        // Trigger a click event on the hidden input
        document.body.appendChild(input); // Append input to the DOM
        input.click(); // Trigger the click event
      
        // Remove the input element from the DOM after the user selects a file
        input.remove();
      };

      
      return (
        <>
          <Navbar />
          <div className={styles.container}>
            {error && <p>{error}</p>}
            {profileData && (
              <div className={styles.profileSection}>
                {console.log(producerProfileData)}
                 
                <div className={styles.profileDetails}>
                <p>{producerProfileData.profileImage}</p>
                <p>Email: { profileData.email}</p>
                <p>UserName: {producerProfileData.username}</p>
                <p>Contact: {producerProfileData.contact}</p>

                {isEditing ? (
                <div className={styles.popupForm}>
                   
                  <form onSubmit={handleFormSubmit}>
                    <label>
                        <img
                          src={producerProfileData.profileImage}
                          alt="Profile"
                          className={styles.profilePhoto}
                        />
                    </label>
                    <label>
                      Contact:
                      <input type="text" value={contact} onChange={(e) => setcontact(e.target.value)} />
                    </label>
                    <label>
                      Username:
                      <input type="text" value={username} onChange={(e) => setusername(e.target.value)} />
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
    };


export default ProfileProducer;
