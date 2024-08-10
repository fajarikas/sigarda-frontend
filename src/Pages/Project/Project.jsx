import React, { useEffect, useState } from "react";
import Title from "../../Components/Title/Title";
import Search from "../../Components/Search/Search";
import IconButton from "../../Components/Button/IconButton";
import { IoAddOutline } from "react-icons/io5";
import api from "../../API/api";
import PrimaryButton from "../../Components/Button/PrimaryButton";
import AddProjectModal from "../../Components/Modal/Project/AddProjectModal";
import EditProjectModal from "../../Components/Modal/Project/EditProjectModal"; // Import EditProjectModal
import { IoMdSkipForward } from "react-icons/io";
import Swal from "sweetalert2";
import { MdDelete, MdEdit } from "react-icons/md";

const Project = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false); // State for Edit Modal
  const [currentProject, setCurrentProject] = useState(null); // State for the project being edited
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const projectPerPages = 10;
  const [searchItem, setSearchItem] = useState("");

  const indexOfLastProject = currentPage * projectPerPages;
  const indexOfFirstProject = indexOfLastProject - projectPerPages;
  const currentProjects = filteredProjects.slice(
    indexOfFirstProject,
    indexOfLastProject
  );

  const totalPages = Math.ceil(filteredProjects.length / projectPerPages);

  const handleClickPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSkip = (direction) => {
    const skipPages = 10;
    if (direction === "next") {
      const newPage = Math.min(currentPage + skipPages, totalPages);
      setCurrentPage(newPage);
    } else if (direction === "prev") {
      const newPage = Math.max(currentPage - skipPages, 1);
      setCurrentPage(newPage);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/project");
        setProjects(response.data.data);
        setFilteredProjects(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formattedDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  const handleAddProject = (newProject) => {
    setProjects((prevProjects) => [...prevProjects, newProject]);
  };

  const handleUpdateProject = (updatedProject) => {
    if (!updatedProject || !updatedProject.id) {
      console.error("Updated project is not valid:", updatedProject);
      return;
    }

    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === updatedProject.id ? updatedProject : project
      )
    );

    setFilteredProjects((prevFilteredProjects) =>
      prevFilteredProjects.map((project) =>
        project.id === updatedProject.id ? updatedProject : project
      )
    );
  };

  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`/project/${id}`);
      if (response.status) {
        Swal.fire("Deleted!", "Your project has been deleted.", "success");
        onDelete(id);
      } else {
        Swal.fire("Error", "Error deleting project", "error");
      }
    } catch (err) {
      console.error("Error deleting project:", err);
      setError(err);
    }
  };

  const onDelete = (id) => {
    setProjects((prevProjects) =>
      prevProjects.filter((project) => project.id !== id)
    );
    setFilteredProjects((prevFilteredProjects) =>
      prevFilteredProjects.filter((project) => project.id !== id)
    );
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchItem(value);

    const filtered = projects.filter((project) => {
      return (
        project.name.toLowerCase().includes(value) ||
        formattedDate(project.start).toLowerCase().includes(value) ||
        project.status.toLowerCase().includes(value)
      );
    });

    setFilteredProjects(filtered);
    setCurrentPage(1);
  };

  const handleEditClick = (project) => {
    setCurrentProject(project);
    setShowEditModal(true);
  };

  const renderPagination = () => {
    const pageNumbers = [];

    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex justify-center space-x-2 mt-4">
        {currentPage > 1 && (
          <button
            onClick={() => handleSkip("prev")}
            className="px-3 py-1 rounded bg-gray-300"
          >
            <IoMdSkipForward />
          </button>
        )}
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => handleClickPage(number)}
            className={`px-3 py-1 rounded ${
              currentPage === number ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {number}
          </button>
        ))}
        {currentPage < totalPages && (
          <button
            onClick={() => handleSkip("next")}
            className="px-3 py-1 rounded bg-gray-300"
          >
            <IoMdSkipForward className="transform rotate-180" />
          </button>
        )}
      </div>
    );
  };

  const confirmDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(id);
      }
    });
  };

  return (
    <div className="space-x-5 z-30 w-10/12 h-fit px-0 lg:px-4 ">
      <Title text="Project" />

      <div className="mt-7 items-center w-full flex  lg:flex justify-between">
        <Search
          placeholder="Search project here"
          value={searchItem}
          onChange={handleSearch}
          className="mb-4 md:mb-0"
        />
        <IconButton
          text={<IoAddOutline />}
          color="bg-[#9079E9]"
          onClick={() => setShowAddModal(true)}
        />
      </div>

      <div className="bg-white px-4 md:px-10 py-2 mt-7 shadow-xl rounded-xl overflow-x-auto">
        <table className="w-full min-w-max">
          <thead className="border-b mb-5">
            <tr className="w-full">
              <th className="py-3 text-left">Project Name</th>
              <th className="py-3 text-center">Date Start</th>
              <th className="py-3 text-center">Status</th>
              <th className="py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="space-y-4">
            {loading ? (
              <tr>
                <td>Loading...</td>
              </tr>
            ) : error ? (
              <div>Error loading projects</div>
            ) : (
              currentProjects.map((project) => (
                <tr
                  key={project.id}
                  className="border-b border-[#E1E1E1] last:border-b-0"
                >
                  <td className="py-3 text-left">{project.name}</td>
                  <td className="py-3 text-center">
                    {formattedDate(project.start)}
                  </td>
                  <td className="py-3 flex justify-center items-center">
                    <p
                      className={`opacity-75 w-4/6 py-2 px-3 text-sm rounded flex justify-center text-center shadow ${
                        project.status === "planning"
                          ? `bg-amber-300 text-amber-900 shadow-amber-600`
                          : project.status === `on progress`
                          ? `bg-green-300 text-green-900 shadow-green-600`
                          : `bg-blue-300 text-blue-900 shadow-blue-600`
                      }`}
                    >
                      {project.status === "planning"
                        ? "Planning"
                        : project.status === `on progress`
                        ? `On Progress`
                        : `Completed`}
                    </p>
                  </td>
                  <td className="py-3">
                    <div className="flex h-full w-full justify-center items-center space-x-4">
                      <PrimaryButton
                        text={<MdEdit />}
                        color="bg-green-600"
                        onClick={() => handleEditClick(project)}
                      />
                      <PrimaryButton
                        text={<MdDelete />}
                        color="bg-red-600"
                        onClick={() => confirmDelete(project.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="py-5 flex justify-start">{renderPagination()}</div>
      </div>

      {showAddModal && (
        <AddProjectModal
          onClose={() => setShowAddModal(false)}
          onAddProject={handleAddProject}
        />
      )}

      {showEditModal && currentProject && (
        <EditProjectModal
          onClose={() => setShowEditModal(false)}
          onUpdateProject={handleUpdateProject}
          project={currentProject}
        />
      )}
    </div>
  );
};

export default Project;
