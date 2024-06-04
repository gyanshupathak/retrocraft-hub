import React, { useEffect, useState } from "react";
import axios from "axios";
import NavbarProducer from "../../components/navbar/NavbarProducer";
import styles from "./People.module.css";
import { FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const People = () => {
  const [people, setPeople] = useState([]);
  const navigate = useNavigate();

  const handleMessage = (people) => {
    navigate("/messages", { state: { people } });
  };

  // Fetch people from the database when the component mounts
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const fetchpeople = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8001/people/getpeople",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        const peopleData = response.data;

        if (Array.isArray(peopleData.people)) {
          setPeople(peopleData.people);
          localStorage.setItem("people", JSON.stringify(peopleData.people));
        } else {
          console.error("Invalid data received from the API:", peopleData);
        }
      } catch (error) {
        console.error("Error fetching people:", error);
      }
    };

    fetchpeople();
  }, []);

  return (
    <>
      <NavbarProducer />

      <div className={styles.cardsContainer}>
        {people &&
          people.map((people, index) => (
            <div key={index} className={styles.cards}>
              
                
              <div className={styles.PhotoWrapper}>
                
                  <img
                    src={
                      people && people.profileImage
                        ? `http://localhost:8001/${people.profileImage.replace(
                            /\\/g,
                            "/"
                          )}`
                        : ""
                    }
                    alt="Profile"
                   
                  />
              </div>
              
              <div>
                <h3>Username: {people.username}</h3>
                <h3>{people.skills}</h3>
                <h3>About: {people.description}</h3>
                <h3>Expected Paygrade : ₹{people.expectedPaygrade}</h3>
                <h3>Portfolio: {people.portfolio} </h3>
                <h3>Previous Jobs: {people.previousJobs}</h3>
                <h3>Contact: {people.contact}</h3>
                <h3>Job Profile: {people.jobProfile}</h3>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default People;
