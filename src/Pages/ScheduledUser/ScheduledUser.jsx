import React, { useEffect, useState } from "react";
import api from "../../API/api";
import Title from "../../Components/Title/Title";
import Search from "../../Components/Search/Search";
import IconButton from "../../Components/Button/IconButton";
import { IoAddOutline } from "react-icons/io5";
import PrimaryButton from "../../Components/Button/PrimaryButton";
import { MdEdit, MdDelete } from "react-icons/md";
import { BiSolidShow } from "react-icons/bi";
import Swal from "sweetalert2";
import AddScheduledUserModal from "../../Components/Modal/ScheduledUser/AddScheduledUserModal";
import EditScheduledUserModal from "../../Components/Modal/ScheduledUser/EditScheduledUserModal";
import ShowScheduledUserModal from "../../Components/Modal/ScheduledUser/ShowScheduledUserModal";
import { IoMdSkipBackward, IoMdSkipForward } from "react-icons/io";

const ScheduledUser = () => {
  const [scheduledUsers, setScheduledUsers] = useState([]);
  const [filteredScheduledUsers, setFilteredScheduledUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentScheduledUser, setCurrentScheduledUser] = useState(null);

  useEffect(() => {
    const fetchScheduledUsers = async () => {
      try {
        const response = await api.get("/scheduled/user");
        setScheduledUsers(response.data.data);
        setFilteredScheduledUsers(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching scheduled users:", err);
        setError(true);
        setLoading(false);
      }
    };

    fetchScheduledUsers();
  }, []);

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = scheduledUsers.filter((su) => {
      const scheduleId = su.schedule
        ? su.schedule.toString().toLowerCase()
        : "";
      const userId = su.user ? su.user.toString().toLowerCase() : "";

      return scheduleId.includes(value) || userId.includes(value);
    });

    setFilteredScheduledUsers(filtered);
    setCurrentPage(1);
  };

  const handleAddScheduledUser = (newScheduledUser) => {
    const updatedScheduledUsers = [...scheduledUsers, newScheduledUser];
    setScheduledUsers(updatedScheduledUsers);
    setFilteredScheduledUsers(updatedScheduledUsers);
  };

  const handleEditScheduledUser = (id, updatedScheduledUser) => {
    const updatedScheduledUsers = scheduledUsers.map((su) =>
      su.id === id ? updatedScheduledUser : su
    );
    setScheduledUsers(updatedScheduledUsers);
    setFilteredScheduledUsers(updatedScheduledUsers);
  };

  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`/scheduled/user/${id}`);
      if (response.status === 200) {
        Swal.fire("Deleted!", "Scheduled user has been deleted.", "success");
        const updatedScheduledUsers = scheduledUsers.filter(
          (su) => su.id !== id
        );
        setScheduledUsers(updatedScheduledUsers);
        setFilteredScheduledUsers(updatedScheduledUsers);
      } else {
        Swal.fire("Error", "Error deleting scheduled user", "error");
      }
    } catch (err) {
      console.error("Error deleting scheduled user:", err);
      setError(err);
    }
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

  const handleEditClick = (scheduledUser) => {
    setCurrentScheduledUser(scheduledUser);
    setShowEditModal(true);
  };

  const handleShowClick = (scheduledUser) => {
    setCurrentScheduledUser(scheduledUser);
    setShowDetailModal(true);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredScheduledUsers.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredScheduledUsers.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
    return (
      <div className="flex justify-center space-x-2 mt-4">
        {currentPage > 1 && (
          <button
            onClick={() => paginate(currentPage - 1)}
            className="px-3 py-1 rounded bg-gray-300"
          >
            <IoMdSkipBackward />
          </button>
        )}
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`px-3 py-1 rounded ${
              currentPage === number ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {number}
          </button>
        ))}
        {currentPage < totalPages && (
          <button
            onClick={() => paginate(currentPage + 1)}
            className="px-3 py-1 rounded bg-gray-300"
          >
            <IoMdSkipForward />
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="lg:space-x-0 space-x-5 z-30 w-10/12 h-screen lg:h-fit">
      <Title text="Scheduled Users" />

      <div className="mt-7 items-center w-full flex justify-between">
        <Search
          placeholder="Search here"
          value={searchTerm}
          onChange={handleSearch}
        />
        <IconButton
          text={<IoAddOutline />}
          color="bg-[#9079E9]"
          onClick={() => setShowAddModal(true)}
        />
      </div>

      <div className="bg-white px-10 py-2 mt-7 shadow-xl rounded-xl overflow-x-auto">
        <table className="w-full min-w-max lg:table-fixed">
          <thead className="border-b mb-5">
            <tr>
              <th className="py-3 text-left">Schedule </th>
              <th className="py-3 text-center">User</th>
              <th className="py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="space-y-4">
            {loading ? (
              <tr>
                <td colSpan="3" className="text-center py-3">
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="3" className="text-center py-3">
                  Error loading data
                </td>
              </tr>
            ) : (
              currentItems.map((scheduledUser, index) => (
                <tr key={index} className="[1px] border-[#E1E1E1] border-b">
                  <td className="py-3 text-left">{scheduledUser.schedule}</td>
                  <td className="py-3 text-center">{scheduledUser.user}</td>
                  <td className="py-3 flex justify-center space-x-2">
                    <PrimaryButton
                      text={<BiSolidShow />}
                      color="bg-blue-600"
                      onClick={() => handleShowClick(scheduledUser)}
                    />
                    <PrimaryButton
                      text={<MdEdit />}
                      color="bg-green-600"
                      onClick={() => handleEditClick(scheduledUser)}
                    />
                    <PrimaryButton
                      text={<MdDelete />}
                      color="bg-red-600"
                      onClick={() => confirmDelete(scheduledUser.id)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="my-2 flex justify-left">{renderPagination()}</div>
      </div>

      {showAddModal && (
        <AddScheduledUserModal
          onClose={() => setShowAddModal(false)}
          onAddScheduledUser={handleAddScheduledUser}
        />
      )}

      {showEditModal && currentScheduledUser && (
        <EditScheduledUserModal
          scheduledUser={currentScheduledUser}
          onClose={() => setShowEditModal(false)}
          onEditScheduledUser={handleEditScheduledUser}
        />
      )}

      {showDetailModal && currentScheduledUser && (
        <ShowScheduledUserModal
          scheduledUser={currentScheduledUser}
          onClose={() => setShowDetailModal(false)}
        />
      )}
    </div>
  );
};

export default ScheduledUser;
