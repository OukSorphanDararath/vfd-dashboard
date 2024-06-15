import React, { useState, useEffect } from "react";
import Button from "./Button";
import Backdrop from "./Backdrop";
import { PiWarningBold } from "react-icons/pi";

const DeleteDialog = ({ deleteTitle, onCancel, onDelete }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger the visibility state after the component mounts to start the transition
    setIsVisible(true);
  }, []);

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-30`}>
      <Backdrop />
      <div
        className={`bg-[#283142] relative  w-3/12 h-[22rem] z-50 mx-auto rounded-3xl overflow-hidden flex flex-col p-5 gap-3
        transition-all duration-300 transform ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="flex-1 flex flex-col text-center gap-3">
          <PiWarningBold className="mx-auto text-red-500 mt-3" size={60} />
          <h1 className="font-semibold text-3xl">Delete {deleteTitle} ?</h1>
          <p className="font-light text-sm">
            Action can not be undone. All value will be lost forever.
          </p>
        </div>
        <div className="flex flex-col mt-auto gap-3">
          <Button
            text="Delete"
            className={"w-full bg-red-600 hover:bg-red-700"}
            onClick={onDelete}
          />
          <Button
            text="Cancel"
            className={
              "w-full bg-[#232b39] border-2 border-white/20 hover:bg-[#1b2531]"
            }
            onClick={onCancel}
          />
        </div>
      </div>
    </div>
  );
};

export default DeleteDialog;
