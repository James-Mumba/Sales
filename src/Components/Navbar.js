import { faBell, faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  collection,
  deleteDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { app, db } from "../Firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const auth = getAuth(app);
  const navigate = useNavigate();
  const [showNoty, setShowNoty] = useState(false);
  const notyRef = useRef(null);
  const [notifications, setNotifications] = useState([]);
  const [newNotification, setNewNotification] = useState(false);

  const toggleNotyDisplay = () => {
    setShowNoty((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (notyRef.current && !notyRef.current.contains(event.target)) {
      setShowNoty(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      setShowNoty(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Fetch user
  const [user, setUser] = useState([]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const userId = user.uid;
        console.log(userId);

        const fetchData = async () => {
          const q = query(
            collection(db, "clients-Data"),
            where("userId", "==", userId)
          );
          let clientsNames = [];
          const querySnapshot = await getDocs(q);

          querySnapshot.forEach((clientsDoc) => {
            clientsNames.push({
              id: clientsDoc.id,
              ...clientsDoc.data(),
            });
          });
          setUser(clientsNames); // Update after loop
        };
        fetchData();
      }
    });
  }, [auth]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const notificationRef = collection(db, "inventory-notifications");
      const querySnapshot = await getDocs(notificationRef);
      const fetchedNotifications = [];
      querySnapshot.forEach((doc) => {
        fetchedNotifications.push({ id: doc.id, ...doc.data() });
      });
      setNotifications(fetchedNotifications);
      setNewNotification(fetchedNotifications.length > 0); // Set new notification flag
    };
    fetchNotifications();
  }, []);

  // Function to clear all notifications permanently
  const clearNotifications = async () => {
    const notificationRef = collection(db, "inventory-notifications");
    const querySnapshot = await getDocs(notificationRef);
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref); // Delete each notification document
    });
    setNotifications([]); // Clear the local state
    setNewNotification(false); // Reset the new notification flag
  };

  // Function to handle navigation when a notification is clicked
  const handleNotificationClick = (notif) => {
    if (notif.item === "Broccoli") {
      navigate("/Inventory"); // Example condition for navigation
    }
    // Add more conditions here based on the notification type or item
  };

  return (
    <div className="navbar">
      <div className="tafuta">
        <input
          type="search"
          disabled
          name=""
          id="search"
          placeholder="Search here"
        />

        <button disabled className="search" type="submit">
          search
        </button>
      </div>

      <div className="buttons">
        {/* Bell icon with conditional red color if there’s a new notification */}
        <button
          className="notification"
          onClick={toggleNotyDisplay}
          style={{ color: newNotification ? "red" : "black" }} // Change color if there’s a new notification
        >
          <FontAwesomeIcon className="log" icon={faBell} />
        </button>

        {/* Notifications dropdown display */}
        {showNoty && (
          <div className="noty-display" ref={notyRef}>
            <h6>Notifications</h6>
            <div className="noty-content">
              {/* Mapping through notifications to display each */}
              {notifications.map((notif) => (
                <div
                  className="box-1-noty"
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)} // Redirect on click
                >
                  <p>{notif.title}</p>
                  <p>
                    {notif.item} - {notif.soldQuantity || notif.pieces} pieces
                  </p>
                </div>
              ))}
            </div>
            {/* Clear button to delete all notifications */}
            <button className="clear" onClick={clearNotifications}>
              clear
            </button>
          </div>
        )}

        {/* Settings button */}
        <button className="settings">
          <FontAwesomeIcon className="log" icon={faGear} />
        </button>
      </div>
      <div className="profileP">
        <div className="pic"></div>
        <p className="userName">
          {user.length > 0 ? user[0].user : "No user found"}
        </p>
      </div>
    </div>
  );
}

export default Navbar;
