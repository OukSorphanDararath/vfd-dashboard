import React from "react";
import { IoClose } from "react-icons/io5";

const Modal = ({ onClose, children }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white w-3/4 h-3/4 p-4 rounded-lg overflow-hidden">
        <button
          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-700"
          onClick={onClose}
        >
          <IoClose size={24} />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
