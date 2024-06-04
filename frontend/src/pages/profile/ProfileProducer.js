import React from "react";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import styles from "./Profile.module.css";
import Navbar from "../../components/navbar/NavbarProducer";
import Footer from "../../components/Footer/Footer";
import Avatar from "@mui/material/Avatar";
import profile from "../../assets/images/home/profile.png";
import { Email, ContactPage } from "@mui/icons-material";

const ProfileProducer = () => {
  const [profileData, setProfileData] = useState({});
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [inputValue, setInputValue] = useState({
    username: "",
    email: "",
    profileImage: null,
    contact: "",
  });

  const handleCompleteProfileClick = () => {
    setIsEditing(!isEditing);
  };

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

  useEffect(() => {
    const fetchProfileData = async () => {
      const userId = localStorage.getItem("_id");
      try {
        const token = sessionStorage.getItem("token");
        const { data } = await axios.get(
          `http://localhost:8001/profile/getproducerprofile/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
          { withCredentials: true }
        );

        const { success, profile, email } = data;
        if (success) {
          setProfileData(profile);
          setEmail(email);
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

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const userId = localStorage.getItem("_id");
    const profileImage = inputValue.profileImage;

    const formData = new FormData();
    formData.append("username", username);
    formData.append("contact", contact);
    formData.append("userId", userId);


    formData.append('profileImage', profileImage);

    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:8001/profile/producerprofile/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data', 
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

  return (
    <>
      <Navbar />
      <div className={styles.profileHeader}></div>
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
                <Email /> Email : {email}
              </p>
              <hr className={styles.line}></hr>
              <p>
                <ContactPage /> Contact : {profileData.contact}
              </p>
              <hr className={styles.line}></hr>
            </div>
          </div>
        )}
        {!profileData && (
          <div className={styles.profileSection}>
            <div className={styles.profileDetails}>
              <p>
                <Email /> Email : {email}
              </p>
              <hr className={styles.line}></hr>
              <button
                className={styles.editButton}
                onClick={handleCompleteProfileClick}
              >
                Complete Profile
              </button>
              {isEditing && (
                <div className={styles.popupFormProducer}>
                  <Avatar
                    alt="User Profile"
                    className={styles.photo}
                    onClick={handlePhoto}
                  />

                  <form onSubmit={handleFormSubmit}>
                    <label>
                      {inputValue.profileImage && (
                        <div>
                          <img
                            src={URL.createObjectURL(inputValue.profileImage)}
                            alt="photoo"
                            className={styles.photoProfile}
                          />
                        </div>
                      )}
                    </label>

                    <label>
                      Username
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </label>
                    <label>
                      Contact :
                      <input
                        type="text"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                      />
                    </label>

                    <div className={styles.buttons}>
                      <button className={styles.submitButton} type="submit">
                        Submit
                      </button>
                      <button
                        className={styles.closeButton}
                        onClick={handleCompleteProfileClick}
                      >
                        Close
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default ProfileProducer;
