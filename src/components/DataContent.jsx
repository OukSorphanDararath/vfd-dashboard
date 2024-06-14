import React, { useState } from "react";
import FileUpload from "../components/FileUpload";

const DataContent = ({dataSource, title, addButtonTitle, editMode}) => {
  const shiftData = [
    { id: 0, title: "Morning" },
    { id: 1, title: "Afternoon" },
    { id: 2, title: "Evening" },
    { id: 3, title: "Graduated Programs" },
  ];

  const [shiftName, setShiftName] = useState("");
  const [shiftNameError, setShiftNameError] = useState("");
  const [files, setFiles] = useState([]);
  const [fileError, setFileError] = useState("");

  const handleFileChange = (uploadedFiles) => {
    setFiles(uploadedFiles);
    if (uploadedFiles.length > 0) {
      setFileError("");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let isValid = true;

    if (!shiftName.trim()) {
      setShiftNameError("Shift name is required.");
      isValid = false;
    } else {
      setShiftNameError("");
    }

    if (files.length === 0) {
      setFileError("At least one file is required.");
      isValid = false;
    } else {
      setFileError("");
    }

    if (isValid) {
      // Submit the form data
      console.log("Form submitted successfully:", { shiftName, files });
    }
  };

  return (
    <div className="h-full flex flex-col">
      <h1 className="mb-4">Schedule</h1>
      <div className="flex h-full gap-4">
        {/* LIST CONTENT */}
        <div className="border flex p-4 flex-col w-64">
          <button className="border p-2">+Add New Shift</button>
          <div>
            <h6 className="font-semibold mt-8">Shift</h6>
            <ul className="flex flex-col gap-2">
              {shiftData.map((item) => (
                <li className="border p-2" key={item.id}>
                  {item.title}
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* EDIT CONTENT */}
        <div className="border flex-1 p-4">
          <form onSubmit={handleSubmit} className="h-full flex flex-col">
            <div className="mb-4">
              <label htmlFor="shiftName" className="block">
                Shift Name:
              </label>
              <input
                type="text"
                id="shiftName"
                value={shiftName}
                onChange={(e) => setShiftName(e.target.value)}
                className={`mt-2 p-2 border ${
                  shiftNameError ? "border-red-500" : "border-gray-300"
                } rounded-md w-full`}
              />
              {shiftNameError && (
                <p className="text-red-500 text-sm mt-1">{shiftNameError}</p>
              )}
            </div>

            <div className="mb-4">
              <FileUpload
                onFilesChange={handleFileChange}
                isRequired={true}
                error={fileError}
              />
            </div>

            <div className="flex justify-between mt-auto">
              <button className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700">
                Delete
              </button>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                  Submit
                </button>
                <button className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700">
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DataContent;
