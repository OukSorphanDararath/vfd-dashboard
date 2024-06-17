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

const Contact = () => {
  const [contactData, setContactData] = useState();
  const [contactName, setContactName] = useState("");
  const [contactNameError, setContactNameError] = useState("");
  const [newContactName, setNewContactName] = useState("");
  const [newContactNameError, setNewContactNameError] = useState("");
  const [file, setFile] = useState(null);
  const [newFile, setNewFile] = useState(null);
  const [selectedData, setSelectedData] = useState();
  const [openDialog, setOpenDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [clearFile, setClearFile] = useState();
  const [isSummitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [phoneNum, setPhoneNum] = useState("");
  const [phoneNumError, setPhoneNumError] = useState("");
  const [newPhoneNum, setNewPhoneNum] = useState("");
  const [newPhoneNumError, setNewPhoneNumError] = useState("");

  const [telegram, setTelegram] = useState("");
  const [telegramError, setTelegramError] = useState("");
  const [newTelegram, setNewTelegram] = useState("");
  const [newTelegramError, setNewTelegramError] = useState("");

  useEffect(() => {
    getContactData();
  }, []);

  useEffect(() => {
    if (selectedData) {
      setContactName(selectedData?.name);
      setContactNameError("");
      setPhoneNum(selectedData?.phone);
      setPhoneNumError("");
      setTelegram(selectedData?.telegram);
      setTelegramError("");
      setClearFile(new Date());
      setFile(null);
    }
  }, [selectedData]);

  const getContactData = (id, afterRequest) => {
    setIsLoading(true);
    axios
      .get("http://localhost:6600/contacts")
      .then((response) => {
        setContactData(response?.data?.data);
        if (id && afterRequest) {
          setSelectedData(response?.data?.data?.find((x) => x._id === id));
        } else if (!id && afterRequest) {
          setSelectedData(
            response?.data?.data[response?.data?.data.length - 1]
          );
        } else {
          setSelectedData(response?.data?.data[0]);
        }

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

  const handlePhoneNumChange = (event, isNew) => {
    if (isNew) {
      setNewPhoneNum(event.target.value);
    } else {
      setPhoneNum(event.target.value);
      setSelectedData((prev) => ({ ...prev, phone: event.target.value }));
    }
    if (phoneNumError) setPhoneNumError(""); // Clear error when user starts typing
    if (newPhoneNumError) setNewPhoneNumError(""); // Clear error when user starts typing
  };

  const handleTelegramChange = (event, isNew) => {
    if (isNew) {
      setNewTelegram(event.target.value);
    } else {
      setTelegram(event.target.value);
      setSelectedData((prev) => ({ ...prev, telegram: event.target.value }));
    }
    if (telegramError) setTelegramError(""); // Clear error when user starts typing
    if (newTelegramError) setNewTelegramError(""); // Clear error when user starts typing
  };
  const handleContactNameChange = (event, isNew) => {
    if (isNew) {
      setNewContactName(event.target.value);
    } else {
      setContactName(event.target.value);
      setSelectedData((prev) => ({ ...prev, name: event.target.value }));
    }
    if (contactNameError) setContactNameError(""); // Clear error when user starts typing
    if (newContactNameError) setNewContactNameError(""); // Clear error when user starts typing
  };

  const handleDelete = async (id) => {
    try {
      const result = await axios.delete(`http://localhost:6600/contacts/${id}`);

      // console.log("Form delete successfully:", result.data);
      getContactData();
      setShowDeleteDialog(false);
      setSelectedData(contactData.length > 0 ? contactData[0] : null);
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

    // Clear previous errors
    setContactNameError("");
    setNewContactNameError("");
    setPhoneNumError("");
    setNewPhoneNumError("");
    setTelegramError("");
    setNewTelegramError("");

    // Validate fields
    if (!openDialog) {
      if (!contactName.trim()) {
        setContactNameError("Contact name is required.");
        isValid = false;
      }
      if (!phoneNum.trim()) {
        setPhoneNumError("Phone number is required.");
        isValid = false;
      }
      if (!telegram.trim()) {
        setTelegramError("Telegram is required.");
        isValid = false;
      }
    } else {
      if (!newContactName.trim()) {
        setNewContactNameError("Contact name is required.");
        isValid = false;
      }
      if (!newPhoneNum.trim()) {
        setNewPhoneNumError("Phone number is required.");
        isValid = false;
      }
      if (!newTelegram.trim()) {
        setNewTelegramError("Telegram is required.");
        isValid = false;
      }
    }

    if (isValid) {
      // Prepare form data
      const formData = new FormData();
      if (id) {
        formData.append("name", contactName);
        formData.append("phone", phoneNum);
        formData.append("telegram", telegram);
        formData.append("file", file ?? selectedData?.pdf);
      } else {
        formData.append("name", newContactName);
        formData.append("phone", newPhoneNum);
        formData.append("telegram", newTelegram);
        formData.append("file", newFile);
      }

      try {
        let result;
        if (id) {
          // Update existing contact
          result = await axios.put(
            `http://localhost:6600/contacts/${id}`,
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
        } else {
          // Create new contact
          result = await axios.post(
            "http://localhost:6600/contacts",
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
        }

        // Reset the dialog and form fields after successful submission
        setOpenDialog(false);
        setNewContactName("");
        setNewPhoneNum("");
        setNewTelegram("");
        setNewFile(null);
        setNotification({
          message: result?.data?.message || "Successfully added a new contact",
          type: "success",
        });

        // Refresh the contact data
        getContactData(id, true);
      } catch (error) {
        setNotification({ message: "Error saving contact.", type: "error" });
      }
    }
    setIsSubmitting(false);
  };

  return (
    <div className="h-full flex flex-col">
      <h1 className="mb-6 mt-2 font-semibold text-2xl">Contacts</h1>
      <div className="flex h-full gap-6">
        {/* LIST CONTENT */}

        <div className="bg-[#283142] rounded-3xl flex p-4 flex-col w-64">
          {isLoading ? (
            <Loading />
          ) : (
            <>
              <Button
                text={"+ Add New Contact"}
                onClick={() => setOpenDialog(true)}
                className={"w-full"}
              />
              <h6 className="font-semibold mt-6 mb-3 text-lg"></h6>
              <ul className="flex flex-col">
                {contactData?.map((item) => {
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
              {contactData?.length > 0 ? (
                <form
                  onSubmit={(e) => {
                    handleSubmit(e, selectedData._id);
                  }}
                  className="h-full flex flex-col"
                >
                  <Input
                    id="contactName"
                    value={contactName}
                    onChange={handleContactNameChange}
                    error={contactNameError}
                    placeholder={"Enter text..."}
                    label={"Contact Name"}
                    isRequired={true}
                  />

                  <div className="flex gap-4">
                    <Input
                      id="phoneNum"
                      value={phoneNum}
                      onChange={handlePhoneNumChange}
                      error={phoneNumError}
                      placeholder={"Enter text..."}
                      label={"Phone Number"}
                      isRequired={true}
                    />
                    <Input
                      id="contactName"
                      value={telegram}
                      onChange={handleTelegramChange}
                      error={telegramError}
                      placeholder={"Enter text..."}
                      label={"Telegram"}
                      isRequired={true}
                    />
                  </div>

                  <div className="my-4 h-full">
                    <FileUpload
                      filename={selectedData?.image}
                      fileType="image"
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
          title={"Add a New Contact"}
          height={"h-[92%]"}
          subTitle={"Enter a New Contact Name"}
          content={
            <form className="h-full flex flex-col">
              <Input
                id="contactName-new"
                value={newContactName}
                onChange={(e) => handleContactNameChange(e, true)}
                error={newContactNameError}
                placeholder={"Enter name here"}
                label={"Contact Name"}
                isRequired={true}
              />
              <div className="flex gap-4">
                <Input
                  id="phoneNum-new"
                  value={newPhoneNum}
                  onChange={(e) => handlePhoneNumChange(e, true)}
                  error={newPhoneNumError}
                  placeholder={"Enter phone number"}
                  label={"Phone Number"}
                  isRequired={true}
                />
                <Input
                  id="telegram-new"
                  value={newTelegram}
                  onChange={(e) => handleTelegramChange(e, true)}
                  error={newTelegramError}
                  placeholder={"Enter telegram username"}
                  label={"Telegram"}
                  isRequired={true}
                />
              </div>
              <div className="my-4 h-full">
                <FileUpload
                  fileType="image"
                  onFileChange={handleFileChange}
                  allowMultiple={false}
                />
              </div>
            </form>
          }
          onClose={() => {
            setNewContactName("");
            setNewContactNameError("");
            setNewPhoneNum("");
            setNewPhoneNumError("");
            setNewTelegram("");
            setNewTelegramError("");
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

export default Contact;
