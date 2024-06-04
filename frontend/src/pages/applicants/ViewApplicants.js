// ViewApplicants.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import NavbarProducer from "../../components/navbar/NavbarProducer";
import styles from "./ViewApplicants.module.css";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import noData from "../../assets/images/home/nodata.jpg";

const ViewApplicants = () => {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [profileData, setProfileData] = useState({});
  const [error, setError] = useState(null);
  const [status, setStatus] = useState({});

  const fetchProfileData = async (freelancerId) => {
    try {
      const token = sessionStorage.getItem("token");
      const { data } = await axios.get(
        `http://localhost:8001/profile/getprofile/${freelancerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        { withCredentials: true }
      );
      const { success, profile } = data;
      if (success) {
        setProfileData((prevProfileData) => ({
          ...prevProfileData,
          [freelancerId]: profile,
        }));
      } else {
        setError("Failed to fetch profile data");
        console.error("Server response error:", data);
      }
    } catch (error) {
      setError("Failed to fetch profile data");
      console.log(error);
    }
  };

  const fetchApplicants = async (jobId, setApplicants, setError) => {
    const token = sessionStorage.getItem("token");
    try {
      const response = await axios.get(
        `http://localhost:8001/jobs/applied/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      const { success, data, message } = response.data;

      if (success) {
        setApplicants(data);

        // Iterate over the applicants array and fetch the profile data for each applicant
        data.forEach((applicant) => {
          const freelancerId = applicant.freelancerId;
          fetchProfileData(freelancerId);
        });
      } else {
        setError(message);
      }
    } catch (error) {
      console.error("Error fetching applicants:", error);
      setError("An error occurred while fetching applicants.");
    }
  };

  useEffect(() => {
    fetchApplicants(jobId, setApplicants, setError);
  }, [jobId]);

  const handleAccept = async (applicantId) => {
    const token = sessionStorage.getItem("token");
    try {
      const response = await axios.post(
        `http://localhost:8001/jobs/acceptapplicant/${applicantId}`,
        { jobId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      const { success, message } = response.data;

      if (success) {
        setStatus({ ...status, [applicantId]: "Accepted" });
        fetchApplicants(jobId, setApplicants, setError);
      } else {
        console.error(message);
      }
    } catch (error) {
      console.error("Error accepting applicant:", error);
    }
  };

  const handleReject = async (applicantId) => {
    const token = sessionStorage.getItem("token");

    try {
      const response = await axios.post(
        `http://localhost:8001/jobs/rejectapplicant/${applicantId}`,
        {jobId},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      const { success, message } = response.data;

      if (success) {
        setStatus({ ...status, [applicantId]: "Rejected" });
        fetchApplicants(jobId, setApplicants, setError);
      } else {
        console.error(message);
      }
    } catch (error) {
      console.error("Error rejecting applicant:", error);
    }
  };

  return (
    <>
      <NavbarProducer />
      <div>
        {applicants.length > 0 ? (
          <div className={styles.viewApplicantsContainer}>
            {error ? (
              <p className={styles.errorMessage}>{error}</p>
            ) : (
              <div className={styles.applicantsContainer}>
                {applicants.map((applicant) => {
                  const freelancerId = applicant.freelancerId;
                  return (
                    <div key={applicant._id} className={styles.applicantData}>
                      <div className={styles.photoWrapper}>                   
                        <img
                          src={
                            profileData &&
                            profileData[freelancerId] &&
                            profileData[freelancerId].profileImage
                              ? `http://localhost:8001/${profileData[
                                  freelancerId
                                ].profileImage.replace(/\\/g, "/")}`
                              : ""
                          }
                          alt="Profile"
                          className={styles.profilePhoto}
                        />
                      </div>
                      <div className={styles.specs}>
                        <h3>{applicant.sopText}</h3>
                        <h3>
                          Username : {profileData[freelancerId]?.username}
                        </h3>
                        <h3>
                          Portfolio : {profileData[freelancerId]?.portfolio}
                        </h3>
                        <h3>Email : {profileData[freelancerId]?.email}</h3>
                        <h3>Contact : {profileData[freelancerId]?.contact}</h3>
                        <h3>
                          Previous Job :
                          {profileData[freelancerId]?.previousJobs}
                        </h3>
                        <h3>
                          Expected Pay :
                          {profileData[freelancerId]?.expectedPaygrade}
                        </h3>
                      </div>
                      <div className={styles.buttons}>
                        <button
                          className={styles.acceptButton}
                          onClick={() => handleAccept(applicant._id)}
                          disabled={status[applicant._id]}
                        >
                          {status[applicant._id] === "Accepted"
                            ? "Accepted"
                            : "Accept"}
                        </button>

                        <button
                          className={styles.rejectButton}
                          onClick={() => handleReject(applicant._id)}
                          disabled={status[applicant._id]}
                        >
                          {status[applicant._id] === "Rejected"
                            ? "Rejected"
                            : "Reject"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <img src={noData} className={styles.noData} />
        )}
      </div>
      <Footer />
    </>
  );
};

export default ViewApplicants;
