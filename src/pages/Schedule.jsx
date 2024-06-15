import { useState, useEffect } from "react";
import FileUpload from "../components/FileUpload";
import axios from "axios";
import Button from "../components/Button";
import Dialog from "../components/Dialog";
import Input from "../components/Input";
import { RiDeleteBin6Line } from "react-icons/ri";
import DeleteDialog from "../components/DeleteDialog";
import Notify from "../components/Notify";
import Loading from "../components/Loading";

const Schedule = () => {
  const [schedulesData, setSchedulesData] = useState();
  const [shiftName, setShiftName] = useState("");
  const [newShiftName, setNewShiftName] = useState("");
  const [shiftNameError, setShiftNameError] = useState("");
  const [newShiftNameError, setNewShiftNameError] = useState("");
  const [file, setFile] = useState(null);
  const [newFile, setNewFile] = useState(null);
  const [selectedData, setSelectedData] = useState();
  const [openDialog, setOpenDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isInitialRender, setIsInitailRender] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [clearFile, setClearFile] = useState();
  const [isSummitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getScheduleData();
  }, []);

  useEffect(() => {
    if (selectedData) {
      setShiftName(selectedData?.name);
      setShiftNameError("");
      setClearFile(new Date());
      setFile(null);
    }
  }, [selectedData]);

  useEffect(() => {
    if (schedulesData?.length > 0 && !isInitialRender) {
      setSelectedData(schedulesData[0]);
      setIsInitailRender(true);
    }
  }, [schedulesData]);

  const getScheduleData = (isAddNewData) => {
    setIsLoading(true);
    axios
      .get("http://localhost:6600/schedules")
      .then((response) => {
        setSchedulesData(response?.data?.data);
        if (isAddNewData)
          setSelectedData(
            response?.data?.data[response?.data?.data.length - 1]
          );
        setIsLoading(false);
      })
      .catch(() => {
        setNotification({ message: "Error fetching schedules", type: "error" });
        setIsLoading(false);
      });
  };

  const handleFileChange = (uploadedFile) => {
    if (uploadedFile === null)
      setSelectedData((prev) => ({ ...prev, pdf: null }));
    if (openDialog) {
      setNewFile(uploadedFile);
    } else {
      setFile(uploadedFile);
    }
  };

  const handleShiftNameChange = (event, isNew) => {
    if (isNew) {
      setNewShiftName(event.target.value);
    } else {
      setShiftName(event.target.value);
    }
    if (shiftNameError) setShiftNameError(""); // Clear error when user starts typing
    if (newShiftNameError) setNewShiftNameError(""); // Clear error when user starts typing
  };

  const handleDelete = async (id) => {
    try {
      const result = await axios.delete(
        `http://localhost:6600/schedules/${id}`
      );

      // console.log("Form delete successfully:", result.data);
      getScheduleData();
      setShowDeleteDialog(false);
      setSelectedData(schedulesData.length > 0 ? schedulesData[0] : null);
      setNotification({
        message: result.data.message,
        type: "success",
      });
    } catch (error) {
      setNotification({ message: "Error deleting schedule.", type: "error" });
    }
  };

  // Handle form submission
  const handleSubmit = async (event, id) => {
    event.preventDefault();
    setIsSubmitting(true);
    let isValid = true;

    if (!shiftName.trim()) {
      setShiftNameError("Shift name is required.");
      isValid = false;
    } else if (!newShiftName.trim() && openDialog) {
      setNewShiftNameError("Shift name is required.");
      isValid = false;
    }

    if (isValid) {
      // Log form data; files are optional
      // console.log("Form submitted successfully:", { name, file });
      const formData = new FormData();
      if (id) {
        formData.append("name", shiftName);
        formData.append("file", file);
      } else {
        formData.append("name", newShiftName);
        formData.append("file", newFile);
      }

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

        setOpenDialog(false);
        setNewShiftName("");
        setNotification({
          message: result?.data?.message ?? "Successfully added a new shift",
          type: "success",
        });
        getScheduleData(id === undefined);
        setIsSubmitting(false);
      } catch (error) {
        setNotification({ message: "Error saving schedule.", type: "error" });
      }
    }
    setIsSubmitting(false);
  };

  return (
    <div className="h-full flex flex-col">
      <h1 className="mb-6 mt-2 font-semibold text-2xl">Schedule</h1>
      <div className="flex h-full gap-6">
        {/* LIST CONTENT */}

        <div className="bg-[#283142] rounded-3xl flex p-4 flex-col w-64">
          {isLoading ? (
            <Loading />
          ) : (
            <>
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
                      className={`border relative rounded-2xl px-5 py-2 cursor-pointer ${
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
            </>
          )}
        </div>
        {/* EDIT CONTENT */}
        <div className="bg-[#283142] flex-1 p-10 rounded-3xl">
          {isLoading ? (
            <Loading />
          ) : (
            <>
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
                      onClearFile={clearFile}
                    />
                  </div>

                  <div className={`flex mt-auto justify-end`}>
                    <Button
                      text={"Update"}
                      type="submit"
                      className={"w-52 border-2 border-white/20"}
                      isLoading={!openDialog && isSummitting}
                    />
                  </div>
                </form>
              ) : (
                <div className="flex justify-center w-full h-full items-center">
                  No schedule data. Please add a new data.
                </div>
              )}
            </>
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
                value={newShiftName}
                onChange={(e) => handleShiftNameChange(e, true)}
                error={newShiftNameError}
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
          onClose={() => {
            setNewShiftName("");
            setNewShiftNameError("");
            setNewFile(null);
            setOpenDialog(false);
          }}
          onFormSubmit={(e) => {
            handleSubmit(e);
          }}
          isSubmitting={isSummitting}
        />
      )}

      {showDeleteDialog && (
        <DeleteDialog
          onCancel={() => setShowDeleteDialog(false)}
          onDelete={() => handleDelete(selectedData._id)}
        />
      )}

      {notification?.message && (
        <Notify
          message={notification.message}
          type={notification.type}
          duration={2000}
          onDismiss={() => setNotification({ message: "", type: "" })}
        />
      )}
    </div>
  );
};

export default Schedule;
