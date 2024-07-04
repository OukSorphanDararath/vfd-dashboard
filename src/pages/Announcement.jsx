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

const Announcement = () => {
  const [announcementData, setAnnouncementData] = useState([]);
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [clearFile, setClearFile] = useState();
  const [selectedData, setSelectedData] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getContactData();
  }, []);

  useEffect(() => {
    if (selectedData) {
      setTitle(selectedData?.title || "");
      setContent(selectedData?.content || "");
      setClearFile(new Date());
      setFile(null); // Clear file state when switching between contacts
    }
  }, [selectedData]);

  const getContactData = (id, afterRequest) => {
    setIsLoading(true);
    axios
      .get(`${apiBaseUrl}/announcements`)
      .then((response) => {
        const data = response?.data?.data || [];
        setAnnouncementData(data);
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
        setNotification({
          message: "Error fetching announcements",
          type: "error",
        });
        setIsLoading(false);
      });
  };

  const handleFileChange = (uploadedFile) => {
    if (openDialog) {
      setFile(uploadedFile);
    } else {
      setFile(uploadedFile);
    }
  };

  const handleTitleChange = (event, isNew) => {
    if (isNew) {
      setTitle(event.target.value);
    } else {
      setTitle(event.target.value);
    }
    if (titleError) setTitleError("");
  };

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  const handleDelete = async (id) => {
    try {
      const result = await axios.delete(`${apiBaseUrl}/announcements/${id}`);
      getContactData();
      setShowDeleteDialog(false);
      setSelectedData(announcementData.length > 0 ? announcementData[0] : null);
      setNotification({
        message: result.data.message,
        type: "success",
      });
    } catch (error) {
      setNotification({
        message: "Error deleting announcements.",
        type: "error",
      });
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
    setTitleError("");

    // Validate fields
    if (!openDialog) {
      if (!title.trim()) {
        setTitleError("Title is required.");
        isValid = false;
      }
    }

    if (isValid) {
      try {
        let filePath = selectedData?.image || null;

        // Upload new file to Firebase if it's a new file
        if (openDialog && file) {
          filePath = await uploadFileToFirebase(file, "announcements");
        }

        // Construct the contact data to send to the server
        const announcementData = {
          title: openDialog ? title : selectedData.title,
          content: openDialog ? content : selectedData.content,
          image: filePath, // URL or path of the uploaded image
        };

        let result;
        if (id) {
          // Update existing contact
          result = await axios.put(
            `${apiBaseUrl}/announcements/${id}`,
            announcementData
          );
        } else {
          // Create new contact
          result = await axios.post(
            `${apiBaseUrl}/announcements`,
            announcementData
          );
        }

        // Handle successful submission
        setOpenDialog(false);
        setTitle("");
        setContent("");
        setFile(null);
        setNotification({
          message:
            result?.data?.message || "Successfully added a new announcements",
          type: "success",
        });

        getContactData(id, true);
      } catch (error) {
        setNotification({ message: "Error saving contact.", type: "error" });
      }
    }
    setIsSubmitting(false);
  };

  return (
    <div className="h-full flex flex-col">
      <h1 className="mb-6 mt-2 font-semibold text-2xl">Announcements</h1>
      <div className="flex h-full gap-6">
        {/* LIST CONTENT */}
        <div className="bg-[#283142] rounded-3xl flex p-4 flex-col w-64">
          {isLoading ? (
            <Loading />
          ) : (
            <>
              <Button
                text={"+ Add Announcements"}
                onClick={() => setOpenDialog(true)}
                className={"w-full"}
              />
              <h6 className="font-semibold mt-6 mb-3 text-lg"></h6>
              <ul className="flex flex-col">
                {announcementData?.map((item) => {
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
                      {item?.title}{" "}
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
              {announcementData?.length > 0 ? (
                <form
                  onSubmit={(e) => {
                    handleSubmit(e, selectedData?._id);
                  }}
                  className="h-full flex flex-col"
                >
                  <Input
                    id="contactTitle"
                    value={title}
                    onChange={handleTitleChange}
                    error={titleError}
                    placeholder={"Enter title..."}
                    label={"Title"}
                    isRequired={true}
                  />
                  <textarea
                    id="contactContent"
                    value={content}
                    onChange={handleContentChange}
                    placeholder={"Enter content..."}
                    className="py-2 px-4 font-normal rounded-xl border-2 border-transparent focus:ring-2 focus:ring-white/10 outline-none h-40 bg-[#323D4E]"
                  />
                  <div className="my-4 h-full">
                    <FileUpload
                      filename={selectedData?.image}
                      fileType="image"
                      onFileChange={handleFileChange}
                      allowMultiple={false}
                      onClearFile={clearFile}
                      filePreview={selectedData?.image}
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
                  No announcement data. Please add a new announcement.
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {openDialog && (
        <Dialog
          title={"Add a New Announcement"}
          height={"h-[92%]"}
          subTitle={"Enter a New Announcement Title"}
          content={
            <form className="h-full flex flex-col">
              <Input
                id="newContactTitle"
                value={title}
                onChange={(e) => handleTitleChange(e, true)}
                error={titleError}
                placeholder={"Enter title here"}
                label={"Title"}
                isRequired={true}
              />
              <textarea
                id="newContactContent"
                value={content}
                onChange={handleContentChange}
                placeholder={"Enter content..."}
                className="py-2 px-4 font-normal rounded-xl border-2 border-transparent focus:ring-2 focus:ring-white/10 outline-none h-40 bg-[#323D4E]"
              />
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
            setTitle("");
            setContent("");
            setFile(null);
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
          onDelete={() => handleDelete(selectedData?._id)}
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

export default Announcement;
