import React, { useEffect, useState } from "react";

const Backdrop = ({ onClick }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className={`fixed inset-0 bg-black z-20 transition-all duration-200 transform ${
        isVisible ? "opacity-60" : "opacity-0 "
      }`}
      onClick={onClick}
    ></div>
  );
};

export default Backdrop;
