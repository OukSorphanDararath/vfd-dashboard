import { useState, useEffect } from "react";
import FileUpload from "../components/FileUpload"; // Adjust the path as necessary
import axios from "axios";

const Schedule = () => {
  const [schedulesData, setSchedulesData] = useState();
  const [shiftName, setShiftName] = useState("");
  const [shiftNameError, setShiftNameError] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState();
  const [isEditMode, setIsEditMode] = useState();

  useEffect(() => {
    getScheduleData();
  }, []);

  useEffect(() => {
    if (isEditMode === undefined || isEditMode === false) {
      setShiftName("");
      setFile(null);
      setFileName(null);
      setShiftNameError("");
    }
  }, [isEditMode]);

  const getScheduleData = () => {
    axios
      .get("http://localhost:6600/schedules")
      .then((response) => {
        setSchedulesData(response?.data?.data);
      })
      .catch((error) => {
        alert(error);
      });
  };

  // Handle file change
  const handleFileChange = (uploadedFile) => {
    setFile(uploadedFile);
  };

  // Handle input change and clear error if present
  const handleShiftNameChange = (event) => {
    setShiftName(event.target.value);
    if (shiftNameError) {
      setShiftNameError(""); // Clear error when user starts typing
    }
  };

  // const handleDelete = async (id) => {
  //   try {
  //     const result = await axios.delete("http://localhost:6600/schedules");

  //     console.log("Form submitted successfully:", result.data);
  //   } catch (error) {
  //     console.error("Error creating post:", error);
  //   }
  // };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    let isValid = true;

    if (!shiftName.trim()) {
      setShiftNameError("Shift name is required.");
      isValid = false;
    }

    if (isValid) {
      // Log form data; files are optional
      // console.log("Form submitted successfully:", { name, file });
      const formData = new FormData();
      formData.append("name", shiftName);
      formData.append("file", file);

      try {
        const result = await axios.post(
          "http://localhost:6600/schedules",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        console.log("Form submitted successfully:", result.data);
      } catch (error) {
        console.error("Error creating post:", error);
      }
    }
  };

  const handleItemClick = (item) => {
    setIsEditMode(true);
    setFileName(item?.pdf);
    setShiftName(item?.name);
    // setSelectedData(item);
  };

  return (
    <div className="h-full flex flex-col">
      <h1 className="mb-4">Schedule</h1>
      <div className="flex h-full gap-4">
        {/* LIST CONTENT */}
        <div className="border flex p-4 flex-col w-64">
          <button className="border p-2" onClick={() => setIsEditMode(false)}>
            +Add New Shift
          </button>
          <div>
            <h6 className="font-semibold mt-8">Shift</h6>
            <ul className="flex flex-col gap-2">
              {schedulesData?.map((item) => (
                <li
                  className="border p-2"
                  key={item?.id}
                  onClick={() => handleItemClick(item)}
                >
                  {item?.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* EDIT CONTENT */}
        <div className="border flex-1 p-4">
          {isEditMode !== undefined && (
            <form onSubmit={handleSubmit} className="h-full flex flex-col">
              <div className="mb-4">
                <label htmlFor="shiftName" className="block">
                  Shift Name:
                </label>
                <input
                  type="text"
                  id="shiftName"
                  value={shiftName}
                  onChange={handleShiftNameChange}
                  className={`mt-2 p-2 border ${
                    shiftNameError ? "bg-red-500/30" : "bg-transparent"
                  } rounded-md w-full`}
                />
                {shiftNameError && (
                  <p className="text-red-500 text-sm mt-1">{shiftNameError}</p>
                )}
              </div>

              <div className="mb-4">
                <FileUpload
                  filename={fileName}
                  fileType="pdf"
                  onFileChange={handleFileChange}
                  allowMultiple={false}
                />
              </div>

              <div
                className={`flex mt-auto ${
                  isEditMode ? "justify-between" : "justify-end"
                }`}
              >
                {isEditMode && (
                  <button
                    type="button"
                    className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700"
                    onClick={() => {
                      setShiftName("");
                      setFile(null);
                      setShiftNameError(""); // Clear the shift name error if any
                    }}
                  >
                    Delete
                  </button>
                )}
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                  >
                    {isEditMode ? "Update" : "Add"}
                  </button>
                  <button
                    type="button"
                    className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700"
                    onClick={() => {
                      // Clear the shift name error if any
                      setIsEditMode(undefined);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Schedule;
