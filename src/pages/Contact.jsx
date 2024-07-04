import { useState, useEffect } from "react";
import axios from "axios";
import Button from "../components/Button";
import Dialog from "../components/Dialog";
import Input from "../components/Input";
import { RiDeleteBin6Line } from "react-icons/ri";
import DeleteDialog from "../components/DeleteDialog";
import Notify from "../components/Notify";
import Loading from "../components/Loading";
import { storage } from "../firebase";
import FileUpload from "../components/FileUpload";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const apiBaseUrl = import.meta.env.VITE_API_KEY;

const Contact = () => {
  const [contactData, setContactData] = useState([]);
  const [contactName, setContactName] = useState("");
  const [contactNameError, setContactNameError] = useState("");
  const [newContactName, setNewContactName] = useState("");
  const [newContactNameError, setNewContactNameError] = useState("");
  const [file, setFile] = useState(null);
  const [newFile, setNewFile] = useState(null);
  const [clearFile, setClearFile] = useState();
  const [selectedData, setSelectedData] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      setContactName(selectedData?.name || "");
      setPhoneNum(selectedData?.phone || "");
      setTelegram(selectedData?.telegram || "");
      setClearFile(new Date());
      setFile(null); // Clear file state when switching between contacts
    }
  }, [selectedData]);

  const getContactData = (id, afterRequest) => {
    setIsLoading(true);
    axios
      .get(`${apiBaseUrl}/contacts`)
      .then((response) => {
        const data = response?.data?.data || [];
        setContactData(data);
        if (id && afterRequest) {
          setSelectedData(data.find((x) => x._id === id));
        } else if (!id && afterRequest) {
          setSelectedData(data[data.length - 1]);
        } else {
          setSelectedData(data[0]);
        }
        setIsLoading(false);
      })
      .catch(() => {
        setNotification({ message: "Error fetching contacts", type: "error" });
        setIsLoading(false);
      });
  };

  const handleFileChange = (uploadedFile) => {
    if (openDialog) {
      setNewFile(uploadedFile);
    } else {
      setFile(uploadedFile);
      if (!uploadedFile) {
        setSelectedData((prev) => ({ ...prev, img: uploadedFile }));
      }
    }
  };

  const handlePhoneNumChange = (event, isNew) => {
    if (isNew) {
      setNewPhoneNum(event.target.value);
    } else {
      setPhoneNum(event.target.value);
    }
    if (phoneNumError) setPhoneNumError("");
    if (newPhoneNumError) setNewPhoneNumError("");
  };

  const handleTelegramChange = (event, isNew) => {
    if (isNew) {
      setNewTelegram(event.target.value);
    } else {
      setTelegram(event.target.value);
    }
    if (telegramError) setTelegramError("");
    if (newTelegramError) setNewTelegramError("");
  };

  const handleContactNameChange = (event, isNew) => {
    if (isNew) {
      setNewContactName(event.target.value);
    } else {
      setContactName(event.target.value);
    }
    if (contactNameError) setContactNameError("");
    if (newContactNameError) setNewContactNameError("");
  };

  const handleDelete = async (id) => {
    try {
      const result = await axios.delete(`${apiBaseUrl}/contacts/${id}`);
      getContactData();
      setShowDeleteDialog(false);
      setSelectedData(contactData.length > 0 ? contactData[0] : null);
      setNotification({
        message: result.data.message,
        type: "success",
      });
    } catch (error) {
      setNotification({ message: "Error deleting contact.", type: "error" });
    }
  };

  const uploadFileToFirebase = async (file, path) => {
    if (!file) return null;

    try {
      const storageRef = ref(storage, `${path}/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      console.log("File uploaded to Firebase:", {
        path: downloadURL,
        name: file.name,
      });
      return downloadURL;
    } catch (error) {
      console.error("Error uploading file to Firebase:", error);
      throw error;
    }
  };

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
      try {
        let filePath = selectedData?.img || null;

        // Upload new file to Firebase if it's a new file
        if (openDialog) {
          filePath = await uploadFileToFirebase(newFile, "contacts");
        } else {
          filePath = await uploadFileToFirebase(file, "contacts");
        }

        // Construct the contact data to send to the server
        const contactData = {
          name: openDialog ? newContactName : contactName,
          phone: openDialog ? newPhoneNum : phoneNum,
          telegram: openDialog ? newTelegram : telegram,
          img: filePath ?? selectedData?.img, // URL or path of the uploaded image
        };

        let result;
        if (id) {
          // Update existing contact
          result = await axios.put(`${apiBaseUrl}/contacts/${id}`, contactData);
        } else {
          // Create new contact
          result = await axios.post(`${apiBaseUrl}/contacts`, contactData);
        }

        // Handle successful submission
        setOpenDialog(false);
        resetNewContactForm(); // Reset the form after submission
        setNotification({
          message: result?.data?.message || "Successfully added a new contact",
          type: "success",
        });

        getContactData(id, true);
      } catch (error) {
        setNotification({ message: "Error saving contact.", type: "error" });
      }
    }
    setIsSubmitting(false);
  };

  const resetNewContactForm = () => {
    setNewContactName("");
    setNewPhoneNum("");
    setNewTelegram("");
    setNewFile(null);
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
                      id="telegram"
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
                      filename={selectedData?.img}
                      fileType="image"
                      onFileChange={handleFileChange}
                      allowMultiple={false}
                      onClearFile={clearFile}
                      filePreview={selectedData?.img}
                    />
                  </div>

                  <div className={`flex mt-auto justify-end`}>
                    <Button
                      text={"Update"}
                      type="submit"
                      className={"w-52 border-2 border-white/20"}
                      isLoading={!openDialog && isSubmitting}
                    />
                  </div>
                </form>
              ) : (
                <div className="flex justify-center w-full h-full items-center">
                  No contact data. Please add a new contact.
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
            resetNewContactForm(); // Reset form on close
            setOpenDialog(false);
          }}
          onFormSubmit={(e) => {
            handleSubmit(e);
          }}
          isSubmitting={isSubmitting}
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
