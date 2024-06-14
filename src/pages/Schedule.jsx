import { useState, useEffect } from "react";
import FileUpload from "../components/FileUpload"; // Adjust the path as necessary
import axios from "axios";
import Button from "../components/Button";
import Dialog from "../components/Dialog";
import Input from "../components/Input";

const Schedule = () => {
  const [schedulesData, setSchedulesData] = useState();
  const [shiftName, setShiftName] = useState("");
  const [shiftNameError, setShiftNameError] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState();
  const [isEditMode, setIsEditMode] = useState();
  const [selectedData, setSelectedData] = useState();

  console.log(selectedData);

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
    setSelectedData(item);
  };

  return (
    <div className="h-full flex flex-col">
      {/* <Dialog /> */}
      <h1 className="mb-6 mt-2 font-semibold text-2xl">Schedule</h1>
      <div className="flex h-full gap-6">
        {/* LIST CONTENT */}
        <div className="bg-[#283142] rounded-3xl flex p-4 flex-col w-64">
          <Button
            text={"+ Add New Shift"}
            onClick={() => setIsEditMode(false)}
            className={"w-full "}
          />
          <>
            <h6 className="font-semibold mt-8 mb-2 text-lg">Shift</h6>
            <ul className="flex flex-col">
              {schedulesData?.map((item) => {
                return (
                  <li
                    className={`border rounded-2xl px-5 py-2 ${
                      item?._id == selectedData?._id
                        ? "bg-blue-700/30  border-white/10 text-blue-300"
                        : "border-transparent"
                    }`}
                    key={item?._id}
                    onClick={() => handleItemClick(item)}
                  >
                    {item?.name}
                  </li>
                );
              })}
            </ul>
          </>
        </div>
        {/* EDIT CONTENT */}
        <div className="bg-[#283142] flex-1 p-10 rounded-3xl">
          {isEditMode !== undefined && (
            <form
              onSubmit={handleSubmit}
              className="h-full flex flex-col gap-2"
            >
              <Input
                id="shiftName"
                value={shiftName}
                onChange={handleShiftNameChange}
                error={shiftNameError}
                placeholder={"Enter text..."}
                label={"Shift Name"}
                isRequired={true}
              />

              <div className="mb-4 h-full">
                <FileUpload
                  filename={fileName}
                  fileType="pdf"
                  onFileChange={handleFileChange}
                  allowMultiple={false}
                />
              </div>

              <div
                className={`flex mt-auto justify-end
                `}
              >
                <Button
                  text={"Update"}
                  type="submit"
                  className={"w-52 border-2 border-white/20"}
                />
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Schedule;
