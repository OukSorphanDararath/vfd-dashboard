import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { IoIosRemove } from "react-icons/io";
import Modal from "./Modal.jsx";
import { BsFiletypePdf } from "react-icons/bs";
import { SiMicrosoftexcel } from "react-icons/si";

const FileUpload = ({
  filename,
  filePreview,
  fileType,
  onFileChange,
  allowMultiple = false,
}) => {
  const [file, setFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");

  // useEffect(() => {
  //   if (onClearFile) setFile(null);
  // }, [onClearFile]);

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      // Check for any rejected files and display error if needed
      if (rejectedFiles.length > 0) {
        setError(
          `Only ${
            fileType === "image"
              ? "image files"
              : fileType === "pdf"
              ? "PDF files"
              : "Excel files"
          } are allowed.`
        );
        return;
      }

      const newFile = acceptedFiles[0]; // Handle only the first accepted file
      if (newFile) {
        if (fileType === "pdf" && newFile.type !== "application/pdf") {
          setError("Only PDF files are allowed.");
          return;
        }

        if (fileType === "image" && !newFile.type.startsWith("image/")) {
          setError("Only image files are allowed.");
          return;
        }

        if (
          fileType === "excel" &&
          !(
            newFile.type ===
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
            newFile.type === "application/vnd.ms-excel"
          )
        ) {
          setError("Only Excel files are allowed.");
          return;
        }

        const updatedFile = Object.assign(newFile, {
          preview: URL.createObjectURL(newFile),
        });
        setFile(updatedFile);
        setError(""); // Clear any previous error
        onFileChange(updatedFile); // Notify parent about the uploaded file
      }
    },
    [fileType, onFileChange]
  );

  const removeFile = (event) => {
    event.preventDefault(); // Prevent default form submission
    if (file) URL.revokeObjectURL(file?.preview);
    setFile(null);
    setError(""); // Clear error when file is removed
    onFileChange(null); // Notify parent about the file removal
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept:
      fileType === "image"
        ? "image/*"
        : fileType === "pdf"
        ? "application/pdf"
        : ".xlsx, .xls",
    multiple: allowMultiple,
  });

  useEffect(() => {
    // Clean up the preview URL when the component is unmounted or the file is removed
    return () => {
      if (file) {
        URL.revokeObjectURL(file.preview);
      }
    };
  }, [file]);

  return (
    <div className="w-full h-full mx-auto">
      {!file && !filename ? (
        // Show the upload form if no file is uploaded
        <div
          {...getRootProps()}
          className={`border-2 bg-[#323D4E] h-full flex flex-col justify-center items-center border-dashed p-6 rounded-xl cursor-pointer ${
            error
              ? "border-red-500 hover:border-red-700"
              : "border-gray-400 hover:border-blue-500"
          }`}
        >
          <input {...getInputProps()} />
          <p>
            Drag & drop a{" "}
            {fileType === "image"
              ? "image"
              : fileType === "pdf"
              ? "PDF"
              : "Excel"}{" "}
            file here, or click to select one
          </p>
          <em>
            (Only{" "}
            {fileType === "image"
              ? "image files"
              : fileType === "pdf"
              ? "PDF files"
              : "Excel files"}{" "}
            will be accepted)
          </em>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      ) : (
        // Show the preview of the uploaded file
        <div className="relative mt-4 rounded-xl bg-[#323D4E]">
          <div className=" overflow-hidden">
            {fileType === "image" ? (
              <img
                src={file?.preview ?? filePreview}
                alt={file?.name ?? filename}
                className="w-full overflow-hidden max-h-36 object-contain"
                onDoubleClick={openModal}
              />
            ) : fileType === "pdf" ? (
              <div
                className="text-sm p-4 flex items-center gap-2"
                onDoubleClick={openModal}
              >
                <BsFiletypePdf size={20} /> {filename ?? file.name}
              </div>
            ) : (
              <div
                className="text-sm p-4 flex items-center gap-2"
                onDoubleClick={openModal}
              >
                <SiMicrosoftexcel size={20} /> {filename ?? file.name}
              </div>
            )}
          </div>
          <button
            className="absolute top-3 right-3 bg-red-500 text-white p-1 rounded-full hover:bg-red-700"
            onClick={removeFile}
          >
            <IoIosRemove size={20} />
          </button>
        </div>
      )}

      {isModalOpen && (file || filePreview) && (
        <Modal onClose={closeModal}>
          {fileType === "pdf" ? (
            <iframe
              src={file?.preview ?? filePreview}
              className="w-full h-full"
              title={filePreview ?? file?.name ?? ""}
            />
          ) : fileType === "image" ? (
            <img
              src={file?.preview ?? filePreview}
              alt={file?.name ?? filename}
              className="w-full h-auto object-cover"
            />
          ) : (
            <div className="text-center p-4">
              <SiMicrosoftexcel size={50} />
              <p>{filename ?? file.name}</p>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

export default FileUpload;
