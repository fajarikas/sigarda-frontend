import React, { useState } from "react";
import api from "../../../API/api";
import { MdOutlineClose } from "react-icons/md";
import SmallIconButton from "../../Button/SmallIconButton";
import Select from "react-select";
import Swal from "sweetalert2";

const AddProjectModal = ({ onClose, onAddProject }) => {
  const [projectName, setProjectName] = useState("");
  const [projectDate, setProjectDate] = useState("");
  const [projectStatus, setProjectStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const newProject = {
        name: projectName,
        start: projectDate,
        status: projectStatus.value,
      };

      console.log("Sending new project to API:", newProject);

      const response = await api.post("/project", newProject);
      console.log("Response from API:", response.data.data);

      onAddProject(response.data.data);

      // Show success alert
      Swal.fire({
        icon: "success",
        title: "Project Added",
        text: "New project has been added successfully.",
      });

      onClose();
    } catch (err) {
      console.error("Error adding project:", err);
      setError(err.message);

      // Show error alert
      Swal.fire({
        icon: "error",
        title: "Add Failed",
        text: "Failed to add project. Please try again.",
      });
    } finally {
      setLoading(false);
    }

    window.location.reload();
  };

  const handleCloseModal = () => {
    onClose();
  };

  const statusOptions = [
    { value: "planning", label: "Planning" },
    { value: "on progress", label: "On Progress" },
    { value: "done", label: "Done" },
  ];

  return (
    <div>
      <div className="fixed inset-0 bg-black w-full bg-opacity-50" />
      <div className="fixed inset-0 z-50 w-1/2 mx-auto bg-white p-7 my-auto h-fit rounded-xl shadow-xl">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-lg">Add New Project</p>
          <SmallIconButton
            color="bg-red-600"
            onClick={handleCloseModal}
            text={<MdOutlineClose />}
          />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mt-5">
            <label className="font-medium">Project Name</label>
            <input
              onChange={(e) => setProjectName(e.target.value)}
              value={projectName}
              type="text"
              className="w-full border border-[#BDBDBD] rounded-lg p-2"
              required
            />
          </div>
          <div className="mt-3">
            <label className="font-medium">Start Date</label>
            <input
              onChange={(e) => setProjectDate(e.target.value)}
              value={projectDate}
              type="date"
              className="w-full border border-[#BDBDBD] rounded-lg p-2"
              required
            />
          </div>
          <div className="mt-3">
            <label className="font-medium">Status</label>
            <Select
              className="text-black"
              options={statusOptions}
              value={projectStatus}
              onChange={setProjectStatus}
              isClearable
              required
            />
          </div>

          <div className="mt-5 flex justify-end">
            <button
              className="bg-blue-600 text-white px-5 py-2 rounded"
              type="submit"
              disabled={loading}
            >
              {loading ? "Loading..." : "Add Project"}
            </button>
          </div>
          {error && <p className="text-red-500 mt-3">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default AddProjectModal;
