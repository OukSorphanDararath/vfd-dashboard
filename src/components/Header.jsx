import React, { useState, useEffect } from "react";
import PopupCall from "./PopupCall";
import { firestore } from "../firebase"; // Adjust the import path if needed
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { useHistory, useLocation } from "react-router-dom";

const Header = () => {
  const [callId, setCallId] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const history = useHistory();
  const location = useLocation();

  const handleCancel = async () => {
    try {
      const docRef = doc(firestore, "shared", "callId");
      await deleteDoc(docRef);
      setCallId("");
      setShowPopup(false); // Close the popup after canceling
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  };

  const handlePickup = async () => {
    history.push("/admin"); // Redirect to /admin
    setShowPopup(false); // Close the popup after picking up
  };

  useEffect(() => {
    const fetchCallId = async () => {
      try {
        // Reference to the document in Firestore
        const docRef = doc(firestore, "shared", "callId");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.id) {
            setCallId(data.id);
            if (location.pathname === "/admin") {
              setShowPopup(false); // Close the popup if navigating to /admin
            } else {
              setShowPopup(true); // Show popup if id exists
            }
          } else {
            setCallId("");
            setShowPopup(false); // Hide popup if id doesn't exist
          }
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document: ", error);
      }
    };

    // Initial fetch
    fetchCallId();

    // Set interval to fetch the ID every 3 seconds (adjust as needed)
    const interval = setInterval(fetchCallId, 3000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [location.pathname]);

  return (
    <div className="bg-[rgb(40,49,66)] relative h-20">
      {showPopup && (
        <PopupCall onCancel={handleCancel} onPickUpCall={handlePickup} />
      )}
    </div>
  );
};

export default Header;
