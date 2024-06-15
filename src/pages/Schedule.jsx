import { useState, useEffect } from "react";
import FileUpload from "../components/FileUpload";
import axios from "axios";
import Button from "../components/Button";
import Dialog from "../components/Dialog";
import Input from "../components/Input";
import { RiDeleteBin6Line } from "react-icons/ri";
import DeleteDialog from "../components/DeleteDialog";
import Notify from "../components/Notify";

const Schedule = () => {
  const [schedulesData, setSchedulesData] = useState();
  const [shiftName, setShiftName] = useState("");
  const [shiftNameError, setShiftNameError] = useState("");
  const [file, setFile] = useState(null);
  const [selectedData, setSelectedData] = useState();
  const [openDialog, setOpenDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isInitialRender, setIsInitailRender] = useState(false);
  const [notify, setNotify] = useState(false);
  const [notifyError, setNotifyError] = useState();

  useEffect(() => {
    getScheduleData();
  }, []);

  useEffect(() => {
    if (selectedData) {
      setShiftName(selectedData?.name);
    }
  }, [selectedData]);

  useEffect(() => {
    if (schedulesData?.length > 0 && !isInitialRender) {
      setSelectedData(schedulesData[0]);
      setIsInitailRender(true);
    }
  }, [schedulesData]);

  const getScheduleData = () => {
    axios
      .get("http://localhost:6600/schedules")
      .then((response) => {
        setSchedulesData(response?.data?.data);
      })
      .catch((error) => {
        console.log(error);
        setNotifyError("error");
        setNotify(true);
      });
  };

  const handleFileChange = (uploadedFile) => {
    if (uploadedFile === null)
      setSelectedData((prev) => ({ ...prev, pdf: null }));
    setFile(uploadedFile);
  };

  const handleShiftNameChange = (event) => {
    setShiftName(event.target.value);
    if (shiftNameError) {
      setShiftNameError(""); // Clear error when user starts typing
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await axios.delete(
        `http://localhost:6600/schedules/${id}`
      );

      console.log("Form delete successfully:", result.data);
      getScheduleData();
      setShowDeleteDialog(false);
      setIsInitailRender(false);
      setNotify(true);
      // setSelectedData(schedulesData[0]);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  // Handle form submission
  const handleSubmit = async (event, id) => {
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

      let result = {};

      try {
        if (id) {
          result = await axios.put(
            `http://localhost:6600/schedules/${id}`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );
        } else {
          result = await axios.post(
            "http://localhost:6600/schedules",
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );
        }

        console.log("Form submitted successfully:", result.data);
        setOpenDialog(false);
        getScheduleData();
        setNotify(true);
      } catch (error) {
        console.error("Error creating post:", error);
      }
    }
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
                  className={`border relative rounded-2xl px-5 py-2 ${
                    item?._id == selectedData?._id
                      ? "bg-blue-700/30  border-white/10 text-blue-300"
                      : "border-transparent"
                  }`}
                  key={item?._id}
                  onClick={() => setSelectedData(item)}
                >
                  {item?.name}{" "}
                  <button
                    onClick={() => setShowDeleteDialog(true)}
                    className="absolute right-3 top-2 p-1 rounded-full hover:bg-white/10 hover:text-red-400 "
                  >
                    <RiDeleteBin6Line />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        {/* EDIT CONTENT */}
        <div className="bg-[#283142] flex-1 p-10 rounded-3xl">
          {schedulesData?.length > 0 ? (
            <form
              onSubmit={(e) => {
                handleSubmit(e, selectedData._id);
              }}
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
                  filename={selectedData?.pdf}
                  fileType="pdf"
                  onFileChange={handleFileChange}
                  allowMultiple={false}
                />
              </div>

              <div className={`flex mt-auto justify-end`}>
                <Button
                  text={"Update"}
                  type="submit"
                  className={"w-52 border-2 border-white/20"}
                />
              </div>
            </form>
          ) : (
            <div className="flex justify-center w-full h-full items-center">
              No schedule data. Please add a new data.
            </div>
          )}
        </div>
      </div>

      {openDialog && (
        <Dialog
          title={"Add a New Shift"}
          subTitle={"Enter a New Shift Name"}
          content={
            <form className="h-full flex flex-col gap-2">
              <Input
                id="shiftName"
                onChange={handleShiftNameChange}
                error={shiftNameError}
                placeholder={"Enter a name here"}
                isRequired={true}
              />

              <div className="mb-4 h-full">
                <FileUpload
                  fileType="pdf"
                  onFileChange={handleFileChange}
                  allowMultiple={false}
                />
              </div>
            </form>
          }
          onClose={() => setOpenDialog(false)}
          onFormSubmit={(e) => {
            handleSubmit(e);
          }}
        />
      )}

      {showDeleteDialog && (
        <DeleteDialog
          onCancel={() => setShowDeleteDialog(false)}
          onDelete={() => handleDelete(selectedData._id)}
        />
      )}

      {notify && (
        <Notify
          message={
            notifyError
              ? "Error Fetching Data !"
              : "Your request was successful!"
          }
          type={notifyError}
          duration={2000}
          onDismiss={() => setNotify(false)}
        />
      )}
    </div>
  );
};

export default Schedule;
