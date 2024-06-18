import { useState, useEffect } from "react";
import axios from "axios";
import Button from "../components/Button";
import Dialog from "../components/Dialog";
import Input from "../components/Input";
import FileUpload from "../components/FileUpload";
import { RiDeleteBin6Line } from "react-icons/ri";
import DeleteDialog from "../components/DeleteDialog";
import Notify from "../components/Notify";
import Loading from "../components/Loading";

const apiBaseUrl = import.meta.env.VITE_API_KEY;

const Faculties = () => {
  const [facultiesData, setFacultiesData] = useState([]);
  const [facultyName, setFacultyName] = useState("");
  const [facultyImage, setFacultyImage] = useState(null);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [majors, setMajors] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFacultiesData();
  }, []);

  useEffect(() => {
    if (selectedFaculty) {
      setFacultyName(selectedFaculty.facultiesName);
      setFacultyImage(selectedFaculty.img);
      setMajors(selectedFaculty.majors || []);
    }
  }, [selectedFaculty]);

  const fetchFacultiesData = () => {
    setIsLoading(true);
    axios
      .get(`${apiBaseUrl}/faculties`)
      .then((response) => {
        setFacultiesData(response.data);
        setSelectedFaculty(response.data[0] || null);
        setIsLoading(false);
      })
      .catch(() => {
        setNotification({ message: "Error fetching faculties", type: "error" });
        setIsLoading(false);
      });
  };

  const handleFacultyNameChange = (e) => {
    setFacultyName(e.target.value);
  };

  const handleFacultyImageChange = (file) => {
    setFacultyImage(file);
  };

  const handleMajorChange = (index, field, value) => {
    const updatedMajors = majors.map((major, i) =>
      i === index ? { ...major, [field]: value } : major
    );
    setMajors(updatedMajors);
  };

  const addMajorRow = (e) => {
    e.preventDefault();
    setMajors([...majors, { majorName: "", pdf: null }]);
  };

  const removeMajorRow = (index) => {
    setMajors(majors.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();

    formData.append("facultiesName", facultyName);
    formData.append("img", facultyImage);

    majors.forEach((major, index) => {
      formData.append(`majors[${index}][majorName]`, major.majorName);
      formData.append(`majors[${index}][pdf]`, major.pdf);
    });

    try {
      let result;
      if (selectedFaculty?._id) {
        result = await axios.put(
          `${apiBaseUrl}/faculties/${selectedFaculty._id}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        result = await axios.post(`${apiBaseUrl}/faculties`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setNotification({ message: result.data.message, type: "success" });
      fetchFacultiesData();
      setIsDialogOpen(false);
    } catch (error) {
      setNotification({ message: "Error saving faculty", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await axios.delete(
        `${apiBaseUrl}/faculties/${id}`
      );
      setNotification({ message: result.data.message, type: "success" });
      fetchFacultiesData();
      setIsDeleteDialogOpen(false);
    } catch (error) {
      setNotification({ message: "Error deleting faculty", type: "error" });
    }
  };

  return (
    <div className="h-full flex flex-col">
      <h1 className="mb-6 mt-2 font-semibold text-2xl">Faculties</h1>
      <div className="flex h-full gap-6">
        {/* LIST CONTENT */}
        <div className="bg-[#283142] rounded-3xl flex p-4 flex-col w-64">
          {isLoading ? (
            <Loading />
          ) : (
            <>
              <Button
                text={"+ Add New Faculty"}
                onClick={() => {
                  setSelectedFaculty(null);
                  setFacultyName("");
                  setFacultyImage(null);
                  setMajors([]);
                  setIsDialogOpen(true);
                }}
                className={"w-full"}
              />
              <h6 className="font-semibold mt-6 mb-3 text-lg">Faculties</h6>
              <ul className="flex flex-col">
                {facultiesData?.map((item) => (
                  <li
                    className={`border relative rounded-2xl px-5 py-2 cursor-pointer ${
                      item?._id === selectedFaculty?._id
                        ? "bg-blue-700/30 border-white/10 text-blue-300"
                        : "border-transparent"
                    }`}
                    key={item?._id}
                    onClick={() => setSelectedFaculty(item)}
                  >
                    {item?.facultiesName}
                    <button
                      onClick={() => setIsDeleteDialogOpen(true)}
                      className="absolute right-3 top-2 p-1 rounded-full hover:bg-white/10 hover:text-red-400 "
                    >
                      <RiDeleteBin6Line />
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
        {/* EDIT CONTENT */}
        <div className="bg-[#283142] flex-1 p-10 rounded-3xl ">
          {isLoading ? (
            <Loading />
          ) : (
            <>
              {selectedFaculty ? (
                <form
                  onSubmit={handleSubmit}
                  className="h-full flex flex-col gap-4 "
                >
                  <Input
                    id="facultyName"
                    value={facultyName}
                    onChange={handleFacultyNameChange}
                    placeholder={"Enter faculty name..."}
                    label={"Faculty Name"}
                    isRequired={true}
                  />
                  <FileUpload
                    onFileChange={handleFacultyImageChange}
                    fileType="image"
                    allowMultiple={false}
                    currentFile={facultyImage}
                    label={"Upload Faculty Image"}
                  />
                  <div className="mt-4">
                    {/* <h3 className="font-semibold mb-2">Majors</h3> */}
                    <table className="w-full text-left">
                      <thead>
                        <tr>
                          <th className="py-2">Major Name</th>
                          <th className="py-2">PDF File</th>
                          <th className="py-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {majors.map((major, index) => (
                          <tr key={index} className="border-b border-gray-600">
                            <td className="py-2">
                              <Input
                                value={major.majorName}
                                onChange={(e) =>
                                  handleMajorChange(
                                    index,
                                    "majorName",
                                    e.target.value
                                  )
                                }
                                placeholder={"Enter major name..."}
                              />
                            </td>
                            <td className="py-2">
                              <FileUpload
                                onFileChange={(file) =>
                                  handleMajorChange(index, "pdf", file)
                                }
                                fileType="application/pdf"
                                allowMultiple={false}
                                currentFile={major.pdf}
                              />
                            </td>
                            <td className="py-2">
                              <Button
                                text={"Remove"}
                                onClick={() => removeMajorRow(index)}
                                className={"ml-4"}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <Button
                      text={"Add Major"}
                      onClick={addMajorRow}
                      className={"mt-4"}
                    />
                  </div>
                  <div className="flex mt-auto justify-end">
                    <Button
                      text={"Update"}
                      type="submit"
                      className={"w-52 border-2 border-white/20"}
                      isLoading={isSubmitting}
                    />
                  </div>
                </form>
              ) : (
                <div className="flex justify-center w-full h-full items-center">
                  No faculty selected. Please add a new faculty.
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {isDialogOpen && (
        <Dialog
          title={"Add a New Faculty"}
          subTitle={"Enter Faculty Details"}
          content={
            <form className="h-full flex flex-col gap-4">
              <Input
                id="facultyName"
                value={facultyName}
                onChange={handleFacultyNameChange}
                placeholder={"Enter faculty name..."}
                isRequired={true}
              />
              <FileUpload
                onFileChange={handleFacultyImageChange}
                fileType="image"
                allowMultiple={false}
                label={"Upload Faculty Image"}
              />
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Add Majors</h3>
                <table className="w-full text-left">
                  <thead>
                    <tr>
                      <th className="py-2">Major Name</th>
                      <th className="py-2">PDF File</th>
                      <th className="py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {majors.map((major, index) => (
                      <tr key={index} className="border-b border-gray-600">
                        <td className="py-2">
                          <Input
                            value={major.majorName}
                            onChange={(e) =>
                              handleMajorChange(
                                index,
                                "majorName",
                                e.target.value
                              )
                            }
                            placeholder={"Enter major name..."}
                          />
                        </td>
                        <td className="py-2">
                          <FileUpload
                            onFileChange={(file) =>
                              handleMajorChange(index, "pdf", file)
                            }
                            fileType="application/pdf"
                            allowMultiple={false}
                          />
                        </td>
                        <td className="py-2">
                          <Button
                            text={"Remove"}
                            onClick={() => removeMajorRow(index)}
                            className={"ml-4"}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Button
                  text={"Add Major"}
                  onClick={addMajorRow}
                  className={"mt-4"}
                />
              </div>
            </form>
          }
          onClose={() => {
            setFacultyName("");
            setFacultyImage(null);
            setMajors([]);
            setIsDialogOpen(false);
          }}
          onFormSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      )}

      {isDeleteDialogOpen && (
        <DeleteDialog
          onCancel={() => setIsDeleteDialogOpen(false)}
          onDelete={() => handleDelete(selectedFaculty._id)}
        />
      )}

      {notification.message && (
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

export default Faculties;
