import React, { useState, useEffect } from "react";

const Notify = ({ message, type = "success", duration = 3000, onDismiss }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show notification with fade-in effect
    setVisible(true);

    // Set a timer to auto-dismiss the notification
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        if (onDismiss) onDismiss();
      }, 300); // Wait for the fade-out transition to complete before calling onDismiss
    }, duration);

    // Cleanup timer on component unmount
    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  // Handle click to manually dismiss the notification
  const handleClick = () => {
    setVisible(false);
    setTimeout(() => {
      if (onDismiss) onDismiss();
    }, 300); // Wait for the fade-out transition to complete before calling onDismiss
  };

  // Determine the background color based on the type
  const backgroundColor = type === "error" ? "bg-red-500" : "bg-green-500";

  return (
    <div
      className={`fixed top-0 left-1/2 transform shadow-xl -translate-x-1/2 p-4 ${backgroundColor} text-white rounded-2xl shadow-lg transition-all duration-300 ease-in-out ${
        visible ? "opacity-100 translate-y-4" : "opacity-0 -translate-y-0"
      }`}
      onClick={handleClick}
    >
      {message}
    </div>
  );
};

export default Notify;
