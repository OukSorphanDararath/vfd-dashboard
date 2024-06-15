import React, { useState, useEffect } from "react";
import Button from "./Button";
import Backdrop from "./Backdrop";
import { FaTimes } from "react-icons/fa";

const Dialog = ({ content, title, subTitle, onClose, onFormSubmit }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger the visibility state after the component mounts to start the transition
    setIsVisible(true);
  }, []);

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-30`}>
      {/* Backdrop */}
      <Backdrop />

      {/* Dialog Container */}
      <div
        className={`bg-[#283142] relative border-2 border-white/10 w-7/12 h-5/6 z-50 mx-auto rounded-3xl overflow-hidden flex flex-col py-6 px-8 gap-3
        transition-all duration-500 transform ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <button
          className="rounded-full bg-white/30 p-2 text-whtie absolute top-4 right-4 hover:text-red-700 hover:bg-red-200/50"
          onClick={onClose}
        >
          <FaTimes />
        </button>
        {/* HEADER CONTENT */}
        <div className="w-full text-center space-y-2 my-6">
          <h1 className="text-4xl font-semibold">{title}</h1>
          <p className="text-sm font-light">{subTitle}</p>
        </div>
        {/* MAIN CONTENT */}
        {content}
        {/* FOOTER BUTTON */}
        <div className="mt-auto flex justify-end gap-4">
          <Button
            text={"Cancel"}
            className={`bg-[#283142] w-40 border-2 border-white/20 hover:bg-[#1b2531]`}
            onClick={onClose}
          />
          <Button
            text={"Save"}
            className={`w-40 border-2 border-white/20`}
            onClick={onFormSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default Dialog;
