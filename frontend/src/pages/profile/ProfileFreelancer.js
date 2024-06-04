import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar/NavbarFreelancer";
import axios from "axios";
import styles from "./Profile.module.css";
import Footer from "../../components/Footer/Footer";
import {
  ArtTrack,
  ArtTrackOutlined,
  ArtTrackRounded,
  ContactPage,
  CorporateFare,
  Description,
  DesignServices,
  Email,
  Money,
  People,
  PhotoCameraFrontOutlined,
} from "@mui/icons-material";
import { SliderMarkLabel } from "@mui/material";

const ProfileFreelancer = () => {
  const [profileData, setProfileData] = useState({});
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [description, setDescription] = useState("");
  const [jobProfile, setJobProfile] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [expectedPaygrade, setExpectedPaygrade] = useState("");
  const [previousJobs, setPreviousJobs] = useState("");

  const handleCompleteProfileClick = () => {
    setIsEditing(!isEditing);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const userId = localStorage.getItem("_id");
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:8001/profile/update/${userId}`,
        {  jobProfile, portfolio, expectedPaygrade, previousJobs },
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
      const userId = localStorage.getItem("_id");
      try {
        const token = sessionStorage.getItem("token");
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
      <div className={styles.profileHeader}>HELLO</div>
      <div className={styles.photoWrapper}>
        <img
          src={
            profileData && profileData.profileImage
              ? `http://localhost:8001/${profileData.profileImage.replace(
                  /\\/g,
                  "/"
                )}`
              : ""
          }
          alt="Profile"
          className={styles.profilePhoto}
        />
      </div>

      <div className={styles.container}>
        {error && <p>{error}</p>}
        {profileData && (
          <div className={styles.profileSection}>
            <div className={styles.profileDetails}>
              <p className={styles.username}>{profileData.username}</p>
              <hr className={styles.line} />
              <p>
                <Email />{" "}
                {profileData && profileData.userId && profileData.userId.email}
              </p>
              <hr className={styles.line}></hr>

              <p>
                <ContactPage /> {profileData.contact}
              </p>
              <hr className={styles.line}></hr>

              <p>
                <Description /> {profileData.description}
              </p>
              <hr className={styles.line}></hr>

              <p>
                <DesignServices />
                Job Profile :{profileData.jobProfile}{" "}
              </p>
              <hr className={styles.line}></hr>

              <p>
                <PhotoCameraFrontOutlined /> Portfolio : {profileData.portfolio}
              </p>
              <hr className={styles.line}></hr>

              <p>
                <Money /> Expected Paygrade : {profileData.expectedPaygrade}
              </p>
              <hr className={styles.line}></hr>

              <p>
                <People /> Previous Jobs : {profileData.previousJobs}
              </p>
              <hr className={styles.line}></hr>
              <button
                  className={styles.editButton}
                  onClick={handleCompleteProfileClick}
                >
                  Complete Profile
                </button>

              {isEditing && (
                <div className={styles.popupForm}>
                  <form onSubmit={handleFormSubmit}>
                  
                    <label>
                      Job Profile:
                      <input
                        type="text"
                        value={jobProfile}
                        onChange={(e) => setJobProfile(e.target.value)}
                      />
                    </label>
                    <label>
                      Portfolio:
                      <input
                        type="text"
                        value={portfolio}
                        onChange={(e) => setPortfolio(e.target.value)}
                      />
                    </label>
                    <label>
                      Expected Paygrade:
                      <input
                        type="text"
                        value={expectedPaygrade}
                        onChange={(e) => setExpectedPaygrade(e.target.value)}
                      />
                    </label>
                    <label>
                      Previous Jobs:
                      <input
                        type="text"
                        value={previousJobs}
                        onChange={(e) => setPreviousJobs(e.target.value)}
                      />
                    </label>
                    <button className={styles.submitButton} type="submit">
                      Submit
                    </button>
                    <button
                      className={styles.closeButton}
                      onClick={handleCompleteProfileClick}
                    >
                      Close
                    </button>
                  </form>
                </div>
              ) }
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default ProfileFreelancer;
