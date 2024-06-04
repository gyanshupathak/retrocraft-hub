import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom"; // If you are using React Router
import styles from "./Navbar.module.css";
import { FaEnvelope, FaBell, FaDeviantart } from "react-icons/fa";
import axios from "axios";
import { useEffect } from "react";
import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Link } from "react-router-dom";
import { BellIcon, ChatBubbleLeftIcon } from "@heroicons/react/24/outline";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Navbar = () => {
  const [profileData, setProfileData] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogout = () => {
    // Remove the JWT from local storage
    localStorage.removeItem("jwtToken");

    // Update the state to reflect that the user is logged out
    setIsAuthenticated(false);

    // Redirect the user to the login page or any other page
    navigate("/login"); // Replace '/login' with the appropriate path
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
    <div className={styles.navbar}>
      <Link to="/dashboardproducer" className={styles.logo}>
        RetroCraft Hub
      </Link>
      <div className="display-flex justify-content:space-between inset-y-0  flex items-center mr-8 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
        <button
          type="button"
          className="relative rounded-full  p-1 text-white hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
        >
          <span className="absolute -inset-1.5" />
          <span className="sr-only">View notifications</span>
          <BellIcon className="h-6 w-6" aria-hidden="true" />
        </button>

        <button
          type="button"
          className="relative rounded-full p-1 text-white hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
        >
          <span className="absolute -inset-1.5" />
          <span className="sr-only">View Messages</span>
          <ChatBubbleLeftIcon className="h-6 w-6" aria-hidden="true" />
        </button>

        <Menu as="div" className="relative ml-3">
          <div>
            <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
              <span className="absolute -inset-1.5" />
              <span className="sr-only">Open user menu</span>
              <img
                className="h-10 w-10 rounded-full border-2 border-white "
                src={
                  profileData && profileData.profileImage
                    ? `http://localhost:8001/${profileData.profileImage.replace(
                        /\\/g,
                        "/"
                      )}`
                    : ""
                }
                alt=""
              />
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <Menu.Item>
                {({ active }) => (
                  <Link
                    to="/profileproducer"
                    activeclassname={styles.active}
                    className={classNames(
                      active ? "bg-gray-100" : "",
                      "block px-4 py-2 text-sm text-gray-700"
                    )}
                  >
                    Your Profile
                  </Link>
                )}
              </Menu.Item>
              {/* <Menu.Item>
                {({ active }) => (
                  <Link
                    to="/jobs"
                    className={classNames(
                      active ? "bg-gray-100" : "",
                      "block px-4 py-2 text-sm text-gray-700"
                    )}
                  >
                    Jobs
                  </Link>
                )}
              </Menu.Item> */}
              <Menu.Item>
                {({ active }) => (
                  <Link
                    to="/people"
                    className={classNames(
                      active ? "bg-gray-100" : "",
                      "block px-4 py-2 text-sm text-gray-700"
                    )}
                  >
                    People
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item onClick={handleLogout}>
                {({ active }) => (
                  <div
                    className={classNames(
                      active ? "bg-gray-100" : "",
                      "block px-4 py-2 text-sm text-gray-700"
                    )}
                  >
                    Sign out
                  </div>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </div>
  );
};

export default Navbar;
