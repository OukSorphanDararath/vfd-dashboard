import React, { useState, useEffect } from "react";
import Button from "./Button";
import Backdrop from "./Backdrop";

const Dialog = ({ content, submitButtonTitle = "Create", title }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger the visibility state after the component mounts to start the transition
    setIsVisible(true);
  }, []);

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-30`}>
      {/* Backdrop */}
      <Backdrop />

      {/* Popup Container */}
      <div
        className={`bg-[#283142] border-2 border-white/10 w-6/12 h-4/6 z-50 mx-auto rounded-3xl overflow-hidden flex flex-col p-6 gap-6
        transition-all duration-500 transform ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {/* HEADER CONTENT */}
        {/* <div className="border">Update {title}</div> */}
        {/* MAIN CONTENT */}
        {content}
        {/* FOOTER BUTTON */}
        <div className="mt-auto flex justify-end gap-4">
          <Button
            text={submitButtonTitle}
            className={`w-40 border-2 border-white/20`}
          />
          <Button
            text={"Cancel"}
            className={`bg-[#283142] w-40 border-2 border-white/20 hover:bg-[#1b2531]`}
          />
        </div>
      </div>
    </div>
  );
};

export default Dialog;
