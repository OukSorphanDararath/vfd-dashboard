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
  const [selectedData, setSelectedData] = useState();
  const [openDialog, setOpenDialog] = useState(false);

  console.log(selectedData);

  useEffect(() => {
    getScheduleData();
  }, []);

  useEffect(() => {
    if (schedulesData) setSelectedData(schedulesData[0]);
  }, [schedulesData]);

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
  //     const result = await axios.delete(`http://localhost:6600/schedules/${id}`);

  //     console.log("Form delete successfully:", result.data);
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
    // setIsEditMode(true);
    setSelectedData(item);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <div className="h-full flex flex-col">
      <h1 className="mb-6 mt-2 font-semibold text-2xl">Schedule</h1>
      <div className="flex h-full gap-6">
        {/* LIST CONTENT */}
        <div className="bg-[#283142] rounded-3xl flex p-4 flex-col w-64">
          <Button
            text={"+ Add New Shift"}
            onClick={() => setOpenDialog(true)}
            className={"w-full"}
          />
          <h6 className="font-semibold mt-6 mb-3 text-lg">Shifts</h6>
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
        </div>
        {/* EDIT CONTENT */}
        <div className="bg-[#283142] flex-1 p-10 rounded-3xl">
          <form onSubmit={handleSubmit} className="h-full flex flex-col gap-2">
            <Input
              id="shiftName"
              value={selectedData?.name}
              onChange={handleShiftNameChange}
              error={shiftNameError}
              placeholder={"Enter text..."}
              label={"Shift Name"}
              isRequired={true}
            />

            <div className="mb-4 h-full">
              <FileUpload
                filename={selectedData?.pdf}
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
        </div>
      </div>

      {openDialog && (
        <Dialog
          title={"Add a New Shift"}
          subTitle={"Enter a New Shift Name"}
          content={
            <form
              onSubmit={handleSubmit}
              className="h-full flex flex-col gap-2"
            >
              <Input
                id="shiftName"
                // value={selectedData?.name}
                onChange={handleShiftNameChange}
                error={shiftNameError}
                placeholder={"Enter a name here"}
                isRequired={true}
              />

              <div className="mb-4 h-full">
                <FileUpload
                  // filename={selectedData?.pdf}
                  fileType="pdf"
                  onFileChange={handleFileChange}
                  allowMultiple={false}
                />
              </div>
            </form>
          }
          onClose={handleCloseDialog}
        />
      )}
    </div>
  );
};

export default Schedule;
