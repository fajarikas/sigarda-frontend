import React, { useEffect, useState } from "react";
import api from "../../API/api";
import Title from "../../Components/Title/Title";
import Search from "../../Components/Search/Search";
import IconButton from "../../Components/Button/IconButton";
import { IoAddOutline } from "react-icons/io5";
import PrimaryButton from "../../Components/Button/PrimaryButton";
import { MdDelete, MdEdit } from "react-icons/md";
import { BiSolidShow } from "react-icons/bi";
import Swal from "sweetalert2";
import AddNotificationModal from "../../Components/Modal/Notification/AddNotificationModal";
import EditNotificationModal from "../../Components/Modal/Notification/EditNotificationModal";
import ShowNotificationModal from "../../Components/Modal/Notification/ShowNotificationModal";
import { IoMdSkipBackward, IoMdSkipForward } from "react-icons/io";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const notificationsPerPage = 5;
  const [searchItem, setSearchItem] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const indexOfLastNotification = currentPage * notificationsPerPage;
  const indexOfFirstNotification =
    indexOfLastNotification - notificationsPerPage;
  const currentNotifications = filteredNotifications.slice(
    indexOfFirstNotification,
    indexOfLastNotification
  );

  const totalPages = Math.ceil(
    filteredNotifications.length / notificationsPerPage
  );

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
        const response = await api.get("/notification");
        setNotifications(response.data.data);
        setFilteredNotifications(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(true);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`/notification/${id}`);
      if (response.status === 200) {
        Swal.fire("Deleted!", "Your notification has been deleted.", "success");
        setNotifications((prevNotifications) =>
          prevNotifications.filter((notification) => notification.id !== id)
        );
        setFilteredNotifications((prevNotifications) =>
          prevNotifications.filter((notification) => notification.id !== id)
        );
      } else {
        Swal.fire("Error", "Error deleting notification", "error");
      }
    } catch (err) {
      console.error("Error deleting notification:", err);
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

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchItem(value);

    const filtered = notifications.filter((notification) => {
      return (
        notification.user.toLowerCase().includes(value) ||
        notification.type.toLowerCase().includes(value) ||
        notification.message.toLowerCase().includes(value)
      );
    });

    setFilteredNotifications(filtered);
    setCurrentPage(1);
  };

  const handleEditClick = (notification) => {
    setCurrentNotification(notification);
    setShowEditModal(true);
  };

  const handleShowClick = (notification) => {
    setSelectedNotification(notification);
    setShowDetailModal(true);
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
            <IoMdSkipBackward />
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
            <IoMdSkipForward />
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="space-x-5 z-30 w-10/12 h-screen">
      <Title text="Notifications" />

      <div className="mt-7 items-center w-full flex justify-between">
        <Search
          placeholder="Search notifications here"
          value={searchItem}
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
              <th className="py-3 text-left lg:w-1/6">User Name</th>
              <th className="py-3 text-center lg:w-1/6">Type</th>
              <th className="py-3 text-left lg:w-1/4">Message</th>
              <th className="py-3 text-center lg:w-1/6">Actions</th>
            </tr>
          </thead>
          <tbody className="space-y-4">
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-3">
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="4" className="text-center py-3">
                  Error loading data
                </td>
              </tr>
            ) : (
              currentNotifications.map((notification, index) => (
                <tr key={index} className="[1px] border-[#E1E1E1] border-b">
                  <td className="py-3 text-left">{notification.user}</td>
                  <td className="py-3 text-left">
                    <p
                      className={`lg:w-3/5 w-3/4 flex justify-center mx-auto rounded-lg text-center  px-3 py-2 ${
                        notification.type == "announcement"
                          ? "bg-orange-300 text-orange-900 "
                          : "bg-red-300 text-red-900 "
                      }`}
                    >
                      {notification.type == "announcement"
                        ? "Announcement"
                        : "Notification"}
                    </p>
                  </td>
                  <td className="py-3 text-left w-1/4">
                    <p className="truncate" title={notification.message}>
                      {notification.message}
                    </p>
                  </td>
                  <td className="py-3 flex justify-center space-x-2">
                    <PrimaryButton
                      text={<BiSolidShow />}
                      color="bg-blue-600"
                      onClick={() => handleShowClick(notification)}
                    />
                    <PrimaryButton
                      text={<MdEdit />}
                      color="bg-green-600"
                      onClick={() => handleEditClick(notification)}
                    />
                    <PrimaryButton
                      text={<MdDelete />}
                      color="bg-red-600"
                      onClick={() => confirmDelete(notification.id)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="py-5 flex justify-start">{renderPagination()}</div>
      </div>

      {showAddModal && (
        <AddNotificationModal
          onClose={() => setShowAddModal(false)}
          onAddNotification={(newNotification) => {
            setNotifications([...notifications, newNotification]);
            setFilteredNotifications([...notifications, newNotification]);
          }}
        />
      )}

      {showEditModal && currentNotification && (
        <EditNotificationModal
          onClose={() => setShowEditModal(false)}
          onUpdateNotification={(updatedNotification) =>
            setNotifications((prevNotifications) =>
              prevNotifications.map((notification) =>
                notification.id === updatedNotification.id
                  ? updatedNotification
                  : notification
              )
            ) &&
            setFilteredNotifications((prevNotifications) =>
              prevNotifications.map((notification) =>
                notification.id === updatedNotification.id
                  ? updatedNotification
                  : notification
              )
            )
          }
          notification={currentNotification}
        />
      )}

      {showDetailModal && selectedNotification && (
        <ShowNotificationModal
          onClose={() => setShowDetailModal(false)}
          notification={selectedNotification}
        />
      )}
    </div>
  );
};

export default Notification;
