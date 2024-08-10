import React, { useState } from "react";
import api from "../../../API/api";
import { MdOutlineClose } from "react-icons/md";
import SmallIconButton from "../../Button/SmallIconButton";
import Select from "react-select";
import PrimaryButton from "../../Button/PrimaryButton";
import Swal from "sweetalert2";

const AddUserModal = ({ onClose, onAddUser }) => {
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(null);
  const [gender, setGender] = useState(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAppear, setIsAppear] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (/\s/.test(userName)) {
      setError("Username cannot contain spaces");
      setLoading(false);
      return;
    }

    try {
      const newUser = {
        name,
        username: userName,
        email,
        role: role?.value,
        gender: gender?.value,
        password,
      };

      console.log("Sending new user to API:", newUser);

      const response = await api.post("/user", newUser);
      console.log("Response from API:", response.data.data);
      onAddUser(response.data.data);

      // Show success alert
      Swal.fire({
        icon: "success",
        title: "User Added",
        text: "New user has been added successfully.",
      });

      setIsAppear(false);
      setTimeout(() => {
        onClose();
      }, 300);
    } catch (err) {
      console.error("Error adding user:", err);
      setError(err.message);

      // Show error alert
      Swal.fire({
        icon: "error",
        title: "Add Failed",
        text: "Failed to add user. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsAppear(false);

    setTimeout(() => {
      onClose();
    }, 300);
  };

  const userRole = [
    { value: "super admin", label: "Super Admin" },
    { value: "admin", label: "Admin" },
    { value: "user", label: "User" },
  ];

  const userGender = [
    { value: "men", label: "Men" },
    { value: "women", label: "Women" },
  ];

  if (!isAppear) return null;

  return (
    <div>
      <div className="fixed inset-0 bg-black w-full bg-opacity-50" />
      <div className="fixed inset-0 z-50  w-3/4 lg:w-1/2 mx-auto bg-white p-7 my-auto h-fit rounded-xl shadow-xl">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-lg">Add New User</p>
          <SmallIconButton
            color="bg-red-600"
            onClick={handleCloseModal}
            text={<MdOutlineClose />}
          />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mt-5">
            <label className="font-medium">Name</label>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              className="w-full border border-[#BDBDBD] rounded-lg p-2"
              required
            />
          </div>
          <div className="mt-3">
            <label className="font-medium">Username</label>
            <input
              onChange={(e) => setUserName(e.target.value)}
              value={userName}
              type="text"
              className="w-full border border-[#BDBDBD] rounded-lg p-2"
              required
            />
            {error && <p className="text-red-500">{error}</p>}
          </div>
          <div className="mt-3">
            <label className="font-medium">Email</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="text"
              className="w-full border border-[#BDBDBD] rounded-lg p-2"
              required
            />
          </div>
          <div className="mt-3">
            <label className="font-medium">Role</label>
            <Select
              classNames="text-black"
              options={userRole}
              value={role}
              onChange={setRole}
              isClearable
              required
            />
          </div>
          <div className="mt-3">
            <label className="font-medium">Gender</label>
            <Select
              classNames="text-black"
              options={userGender}
              value={gender}
              onChange={setGender}
              isClearable
              required
            />
          </div>
          <div className="mt-3">
            <label className="font-medium">Password</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              className="w-full border border-[#BDBDBD] rounded-lg p-2"
              required
            />
          </div>

          <div className="mt-5 flex justify-end">
            <PrimaryButton
              text={loading ? "Loading..." : "Add User"}
              color="bg-blue-600"
              type="submit"
              disabled={loading}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
