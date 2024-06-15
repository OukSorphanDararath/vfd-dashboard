import React from "react";
import { CgSpinner } from "react-icons/cg";

const Loading = () => {
  return (
    <div className="flex justify-center items-center w-full h-full">
      <CgSpinner size={40} className="animate-spin text-blue-600" />
    </div>
  );
};

export default Loading;
