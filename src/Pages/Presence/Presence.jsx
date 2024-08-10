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
import AddPresenceModal from "../../Components/Modal/Presence/AddPresenceModal";
import EditPresenceModal from "../../Components/Modal/Presence/EditPresenceModal";
import ShowPresenceModal from "../../Components/Modal/Presence/ShowPresenceModal";
import { IoMdSkipBackward, IoMdSkipForward } from "react-icons/io";

const Presence = () => {
  const [presences, setPresences] = useState([]);
  const [filteredPresences, setFilteredPresences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentPresence, setCurrentPresence] = useState(null);

  useEffect(() => {
    const fetchPresences = async () => {
      try {
        const response = await api.get("/presence");
        const data = response.data.data || [];
        setPresences(data);
        setFilteredPresences(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching presences:", err);
        setError(true);
        setLoading(false);
      }
    };

    fetchPresences();
  }, []);

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = (presences || []).filter((presence) => {
      const userName = presence.user ? presence.user.toLowerCase() : "";
      return userName.includes(value);
    });

    setFilteredPresences(filtered);
    setCurrentPage(1);
  };

  //   const handleAddPresence = (newPresence) => {
  //     const updatedPresences = [...(presences || []), newPresence];
  //     setPresences(updatedPresences);
  //     setFilteredPresences(updatedPresences);
  //   };

  //   const handleEditPresence = (id, updatedPresence) => {
  //     const updatedPresences = (presences || []).map((p) =>
  //       p.id === id ? updatedPresence : p
  //     );
  //     setPresences(updatedPresences);
  //     setFilteredPresences(updatedPresences);
  //   };

  //   const handleDelete = async (id) => {
  //     try {
  //       const response = await api.delete(`/presence/${id}`);
  //       if (response.status === 200) {
  //         Swal.fire("Deleted!", "Presence has been deleted.", "success");
  //         const updatedPresences = (presences || []).filter((p) => p.id !== id);
  //         setPresences(updatedPresences);
  //         setFilteredPresences(updatedPresences);
  //       } else {
  //         Swal.fire("Error", "Error deleting presence", "error");
  //       }
  //     } catch (err) {
  //       console.error("Error deleting presence:", err);
  //       setError(err);
  //     }
  //   };

  //   const confirmDelete = (id) => {
  //     Swal.fire({
  //       title: "Are you sure?",
  //       text: "You won't be able to revert this!",
  //       icon: "warning",
  //       showCancelButton: true,
  //       confirmButtonColor: "#3085d6",
  //       cancelButtonColor: "#d33",
  //       confirmButtonText: "Yes, delete it!",
  //     }).then((result) => {
  //       if (result.isConfirmed) {
  //         handleDelete(id);
  //       }
  //     });
  //   };

  //   const handleEditClick = (presence) => {
  //     setCurrentPresence(presence);
  //     setShowEditModal(true);
  //   };

  //   const handleShowClick = (presence) => {
  //     setCurrentPresence(presence);
  //     setShowDetailModal(true);
  //   };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = (filteredPresences || []).slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil((filteredPresences || []).length / itemsPerPage);

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

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  return (
    <div className="space-x-5 z-30 w-10/12 h-screen lg:h-fit">
      <Title text="Presences" />

      <div className="mt-7 items-center w-full flex justify-between">
        <Search
          placeholder="Search here"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="bg-white px-10 py-2 mt-7 shadow-xl rounded-xl overflow-x-auto">
        <table className="w-full min-w-max lg:table-fixed">
          <thead className="border-b mb-5">
            <tr>
              <th className="py-3 text-left">User</th>
              <th className="py-3 text-center">Attendance Date</th>
              <th className="py-3 text-center">Check - In</th>
              <th className="py-3 text-center">Check - Out</th>
            </tr>
          </thead>
          <tbody className="space-y-4">
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-3">
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="5" className="text-center py-3">
                  Error loading data
                </td>
              </tr>
            ) : (filteredPresences || []).length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-3">
                  No data available
                </td>
              </tr>
            ) : (
              currentItems.map((presence, index) => (
                <tr key={index} className="text-center">
                  <td className="py-2 text-left">{presence.user}</td>
                  <td className="py-2">{formatDate(presence.attendance)}</td>
                  <td className="py-2">{presence.check_in}</td>
                  <td className="py-2">
                    {!presence.check_out
                      ? "No check-out data"
                      : presence.check_out}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="my-3 flex justify-start">{renderPagination()}</div>
      </div>

      {/* <AddPresenceModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddPresence={handleAddPresence}
      /> */}

      {/* {currentPresence && (
        <>
          <EditPresenceModal
            show={showEditModal}
            onClose={() => setShowEditModal(false)}
            presence={currentPresence}
            onEditPresence={handleEditPresence}
          />

          <ShowPresenceModal
            show={showDetailModal}
            onClose={() => setShowDetailModal(false)}
            presence={currentPresence}
          />
        </>
      )} */}
    </div>
  );
};

export default Presence;
