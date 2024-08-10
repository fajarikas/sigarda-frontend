import React, { useState } from "react";
import { IoMdMale } from "react-icons/io";
import { IoMdFemale } from "react-icons/io";
import { PiSuitcaseSimpleFill } from "react-icons/pi";
import { HiMail } from "react-icons/hi";
import PrimaryButton from "../Button/PrimaryButton";
import api from "../../API/api";
import Swal from "sweetalert2";
import EditUserModal from "../Modal/User/EditUserModal";

const UserCard = ({ user, onDelete, onUpdate }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`/user/${id}`);
      if (response.status === 200) {
        Swal.fire("Deleted!", "User deleted successfully", "success");
        onDelete(id);
      } else {
        Swal.fire("Error", "Error deleting user", "error");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      Swal.fire("Error", "Error deleting user", "error");
    }
  };

  const handleUpdate = () => {
    setIsModalVisible(true);
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

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleUpdateUser = (updatedUser) => {
    onUpdate(updatedUser);
    handleCloseModal();
  };

  return (
    <div className="bg-white px-8 py-8 shadow-xl rounded-xl">
      <div className="text-lg flex items-center justify-between">
        <h3 className="font-medium w-3/4 truncate">{user.name}</h3>
        {user.gender === "men" ? <IoMdMale /> : <IoMdFemale />}
      </div>
      <p className="-mt-1 text-[#BDBDBD]">{user.role}</p>
      <div className="space-y-3 mt-5">
        <div className="flex items-center gap-x-2">
          <div className="bg-[#8f79e958] text-lg p-1 rounded">
            <div className="text-[#9079E9] opacity-100">
              <PiSuitcaseSimpleFill />
            </div>
          </div>
          <p className="w-3/4 truncate">{user.username}</p>
        </div>
        <div className="flex items-center gap-x-2">
          <div className="bg-[#8f79e958] text-lg p-1 rounded">
            <div className="text-[#9079E9] opacity-100">
              <HiMail />
            </div>
          </div>
          <p className="w-3/4 truncate">{user.email}</p>
        </div>
      </div>
      <div className="mt-6 flex justify-between w-full space-x-4">
        <PrimaryButton
          text="Edit"
          color="bg-green-600"
          onClick={handleUpdate}
        />
        <PrimaryButton
          text="Delete"
          color="bg-red-600"
          onClick={() => confirmDelete(user.id)}
        />
      </div>
      {isModalVisible && (
        <EditUserModal
          user={user}
          onClose={handleCloseModal}
          onUpdateUser={handleUpdateUser}
        />
      )}
    </div>
  );
};

export default UserCard;
