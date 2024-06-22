import React from "react";
import { FaTimes, FaCamera } from "react-icons/fa";

const PopupCall = () => {
  return (
    <div
      className="w-96 h-32 py-4 flex justify-evenly items-center bg-gray-400  bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-10 border-2 border-gray-400
rounded-3xl absolute right-6 top-20"
    >
      <div className="flex flex-col">
        <span className="text-sm font-extralight">Incoming Call</span>
        <span className="text-2xl font-semibold">South Campus</span>
      </div>
      <div className="self-end flex gap-2">
        <button className="p-2 bg-red-600 rounded-full w-14 h-10 flex justify-center items-center shadow-md hover:bg-red-700">
          <FaTimes />
        </button>
        <button className="p-2 bg-green-600 rounded-full w-14 h-10 flex justify-center items-center shadow-md hover:bg-green-700">
          <FaCamera />
        </button>
      </div>
    </div>
  );
};

export default PopupCall;
