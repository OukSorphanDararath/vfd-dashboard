import React from "react";
import { LuLoader2 } from "react-icons/lu";

const Button = ({ onClick, text, className, type, isLoading }) => {
  const hasBackgroundClass = className
    ?.split(" ")
    .some((cls) => cls.startsWith("bg-"));

  return (
    <button
      className={`p-3 rounded-2xl disabled:bg-[#4860a4] ${
        hasBackgroundClass ? "" : "bg-[#032ea2] hover:bg-[#05216f]"
      } ${className}`}
      onClick={onClick}
      type={type}
      disabled={isLoading}
    >
      <div className="relative">
        {isLoading && <LuLoader2 className="animate-spin absolute left-5 top-0.5 opacity-50" size={20} />}
        {text}
      </div>
    </button>
  );
};

export default Button;
