import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/navbar/NavbarFreelancer";
import Footer from "../../components/Footer/Footer";
import noData from "../../assets/images/home/nodata.jpg";
import styles from "./Dashboard.module.css";

const DashboardFreelancer = () => {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState({});

  useEffect(() => {
    const fetchAcceptedJobs = async () => {
      try {
        const userId = localStorage.getItem("_id");

        // If userId is null, don't make the API request
        if (!userId) {
          setError("User ID not found.");
          return;
        }
        const token = sessionStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:8001/jobs/accepted?userId=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        const { success, data, message } = response.data;

        if (success) {
          setJobs(data);
          // Fetch profile data for each job's producer
          const profileData = {};
          for (const job of data) {
            const producerId = job.userId;
            const profileResponse = await axios.get(
              `http://localhost:8001/profile/getproducerprofile/${producerId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
              { withCredentials: true }
            );

            const { success: profileSuccess, profile } = profileResponse.data;
            if (profileSuccess) {
              profileData[producerId] = profile;
            } else {
              console.error(
                "Failed to fetch profile data:",
                profileResponse.data
              );
            }
          }

          setProfileData(profileData);
        } else {
          setError(message);
        }
      } catch (error) {
        console.error("Error fetching accepted jobs:", error);
        setError("An error occurred while fetching accepted jobs.");
      }
    };

    fetchAcceptedJobs();
  }, []);

  return (
    <>
      <Navbar />
      <div className={styles.cardsContainer}>
        {jobs.length > 0 ? (
          jobs.map((job) => {
            const producerId = job.userId;

            return (
              <div key={job._id} className={styles.Jobcards}>
                <div className={styles.photoWrapper}>
                  <img
                    src={
                      profileData &&
                      profileData[producerId] &&
                      profileData[producerId].profileImage
                        ? `http://localhost:8001/${profileData[
                            producerId
                          ].profileImage.replace(/\\/g, "/")}`
                        : ""
                    }
                    alt="Profile"
                    className={styles.profilePhoto}
                  />
                  <h3 className={styles.by}>
                    {" "}
                    -
                    {profileData[producerId] &&
                      profileData[producerId].username}{" "}
                  </h3>
                </div>
                <div>
                  <h3 className={styles.title}>{job.title}</h3>
                  <h3>Duration: {job.duration}</h3>
                  <h3>Salary: {job.salary}</h3>
                  <h3>Jobtype : {job.jobType}</h3>
                  <h3>Location: {job.location}</h3>
                </div>
              </div>
            );
          })
        ) : (
          <img src={noData} className="w-1/2" />
        )}
        {error && <p>{error}</p>}
      </div>
      <Footer />
    </>
  );
};

export default DashboardFreelancer;
