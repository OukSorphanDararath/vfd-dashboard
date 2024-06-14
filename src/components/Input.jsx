import React from "react";

const Input = ({
  id,
  value,
  onChange,
  placeholder,
  error,
  className = "",
  isRequired,
  label,
  ...props
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={id} className="inline-block font-semibold mb-2">
          <span className={`text-red-600 ${isRequired ? "" : "hidden"}`}>
            *
          </span>
          {label}:
        </label>
      )}
      <input
        type="text"
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`py-2 px-4 font-normal rounded-xl border-2 border-transparent focus:ring-2 focus:ring-white/10 outline-none ${
          error ? "bg-red-500/30" : "bg-[#323D4E]"
        } ${className} rounded-md w-full`}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Input;
