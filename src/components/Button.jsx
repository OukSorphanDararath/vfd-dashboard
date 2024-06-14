import React from "react";

const Button = ({ onClick, text, className, type }) => {
  const hasBackgroundClass = className
    .split(" ")
    .some((cls) => cls.startsWith("bg-"));

  return (
    <button
      className={`p-3 rounded-2xl ${className} ${
        hasBackgroundClass ? "" : "bg-[#032ea2] hover:bg-[#05216f]"
      }`}
      onClick={onClick}
      type={type}
    >
      {text}
    </button>
  );
};

export default Button;
