import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import rightImage from "../../assets/images/home/rightImage.png";
import Avatar from '@mui/material/Avatar';

const Description = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    username: "",
    description: "",
    profileImage: null,
    contact:"",
  });

  const { username, description, profileImage ,contact} = inputValue;
  
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
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

      input.remove();

    });
  
    // Trigger a click event on the hidden input
    document.body.appendChild(input); // Append input to the DOM
    input.click(); // Trigger the click event
  
  };

  

  const handleError = (err) =>
    toast.error(err, {
      position: "bottom-left",
    });
  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: "bottom-left",
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(inputValue).forEach((key) => {
        formData.append(key, inputValue[key]);
      });

      // Get userId from local storage or wherever you're storing it
    const userId = localStorage.getItem('_id');
    if (!userId) {
      throw new Error('User is not authenticated');
    }

    // Append userId to formData
    formData.append('userId', userId);

      const token = sessionStorage.getItem('token');
      const { data } = await axios.post(
        "http://localhost:8001/description",
        formData,{
          headers: {
            Authorization: `Bearer ${token}`
          },
        },
        { withCredentials: true }
      );

      const { success, message } = data;
      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate("/dashboardfreelancer");
        }, 1000);
      } else {
        handleError(message);
      }
    } catch (error) {
      console.log(error);
    }

    setInputValue({
      username: "",
      description: "",
      profileImage: null,
      contact:"",

    });
  };

  return (
    <>
      <div>
        <img src={rightImage} alt="home" className="right-Image" />
      </div>
      <div className="form_container">
      <Avatar alt="User Profile"  style={{ marginLeft:'120px' ,width: '55px', height: '55px' }} onClick={handlePhoto}/>
        <h2 className="login-account">Describe Yourself</h2>
        <form onSubmit={handleSubmit}>
          {profileImage && (
            <div>
              <img
                src={URL.createObjectURL(profileImage)}
                alt="selected-profile"
                className="selected-profile-image"
              />
            </div>
          )}

        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            value={username}
            placeholder="Enter your Username"
            onChange={handleOnChange}
          />
        </div>

        <div>
          <label htmlFor="description">About You</label>
          <input
            type="text"
            name="description"
            value={description}
            placeholder="Enter a brief about yourself"
            onChange={handleOnChange}
          />
        </div>
        <div>
          <label htmlFor="number">Your Contact Number</label>
          <input
            type="text"
            name="contact"
            value={contact}
            placeholder="Enter your Contact Number"
            onChange={handleOnChange}
          />
        </div>
        

        <button type="submit">Submit</button>
      </form>
      <ToastContainer />
    </div>
    </>
    
  );
};

export default Description;
