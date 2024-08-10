import React, { useState, useEffect } from "react";
import api from "../../../API/api";
import { MdOutlineClose } from "react-icons/md";
import SmallIconButton from "../../Button/SmallIconButton";
import Select from "react-select";
import Swal from "sweetalert2";

const AddMeetingModal = ({ onClose, onAddMeeting }) => {
  const [projectOptions, setProjectOptions] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState(null);
  const [place, setPlace] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetching project and user options
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get("/project");
        const projectData = response.data.data.map((project) => ({
          value: project.id,
          label: project.name,
        }));
        setProjectOptions(projectData);
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await api.get("/user");
        const userData = response.data.data.map((user) => ({
          value: user.id,
          label: user.name,
        }));
        setUserOptions(userData);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchProjects();
    fetchUsers();
  }, []);

  // Handling form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const newMeeting = {
        project_id: selectedProject?.value,
        user_id: selectedUser?.value,
        description,
        date,
        type: type?.value,
        place,
      };

      const response = await api.post("/meeting", newMeeting);

      onAddMeeting(response.data.data); // Call parent function to add the meeting
      onClose(); // Close the modal

      // Show success alert
      Swal.fire({
        icon: "success",
        title: "Meeting Added",
        text: "The meeting has been added successfully.",
      });

      window.location.reload();

      console.log("Response from API:", response.data.data);
    } catch (err) {
      console.error("Error adding meeting:", err);
      setError(err.message);

      // Show error alert
      Swal.fire({
        icon: "error",
        title: "Failed to Add Meeting",
        text: "There was an error adding the meeting. Please try again.",
      });
    } finally {
      setLoading(false);
    }

    // Removed window.location.reload() to avoid unnecessary page reloads
  };

  return (
    <div>
      <div className="fixed inset-0 bg-black w-full bg-opacity-50" />
      <div className="fixed inset-0 z-50 w-1/2 mx-auto bg-white p-7 my-auto h-fit rounded-xl shadow-xl">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-lg">Add New Meeting</p>
          <SmallIconButton
            color="bg-red-600"
            onClick={onClose}
            text={<MdOutlineClose />}
          />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mt-5">
            <label className="font-medium">Project</label>
            <Select
              options={projectOptions}
              value={selectedProject}
              onChange={setSelectedProject}
              placeholder="Select a project"
              isClearable
              required
            />
          </div>
          <div className="mt-3">
            <label className="font-medium">User</label>
            <Select
              options={userOptions}
              value={selectedUser}
              onChange={setSelectedUser}
              placeholder="Select a user"
              isClearable
              required
            />
          </div>
          <div className="mt-3">
            <label className="font-medium">Description</label>
            <textarea
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              className="w-full border border-[#BDBDBD] rounded-lg p-2"
              required
            />
          </div>
          <div className="mt-3">
            <label className="font-medium">Date</label>
            <input
              onChange={(e) => setDate(e.target.value)}
              value={date}
              type="date"
              className="w-full border border-[#BDBDBD] rounded-lg p-2"
              required
            />
          </div>
          <div className="mt-3">
            <label className="font-medium">Type</label>
            <Select
              options={[
                { value: "online", label: "Online" },
                { value: "offline", label: "Offline" },
              ]}
              value={type}
              onChange={setType}
              placeholder="Select a type"
              isClearable
              required
            />
          </div>
          <div className="mt-3">
            <label className="font-medium">Place</label>
            <input
              onChange={(e) => setPlace(e.target.value)}
              value={place}
              type="text"
              className="w-full border border-[#BDBDBD] rounded-lg p-2"
              required
            />
          </div>

          <div className="mt-5 flex justify-end">
            <button
              className="bg-blue-600 text-white px-5 py-2 rounded"
              type="submit"
              disabled={loading}
            >
              {loading ? "Loading..." : "Add Meeting"}
            </button>
          </div>
          {error && <p className="text-red-500 mt-3">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default AddMeetingModal;
