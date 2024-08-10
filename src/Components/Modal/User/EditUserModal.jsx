import React, { useState, useEffect } from "react";
import api from "../../../API/api";
import { MdOutlineClose } from "react-icons/md";
import SmallIconButton from "../../Button/SmallIconButton";
import Select from "react-select";
import Swal from "sweetalert2";

const EditUserModal = ({ user, onClose, onUpdateUser }) => {
  const [name, setName] = useState(user.name || "");
  const [userName, setUserName] = useState(user.username || "");
  const [email, setEmail] = useState(user.email || "");
  const [role, setRole] = useState(
    user.role
      ? {
          value: user.role,
          label: user.role.charAt(0).toUpperCase() + user.role.slice(1),
        }
      : null
  );
  const [gender, setGender] = useState(
    user.gender
      ? {
          value: user.gender,
          label: user.gender.charAt(0).toUpperCase() + user.gender.slice(1),
        }
      : null
  );
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAppear, setIsAppear] = useState(true);

  useEffect(() => {
    setName(user.name || "");
    setUserName(user.username || "");
    setEmail(user.email || "");
    setRole(
      user.role
        ? {
            value: user.role,
            label: user.role.charAt(0).toUpperCase() + user.role.slice(1),
          }
        : null
    );
    setGender(
      user.gender
        ? {
            value: user.gender,
            label: user.gender.charAt(0).toUpperCase() + user.gender.slice(1),
          }
        : null
    );
  }, [user]);

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
      const updatedUser = {
        name,
        username: userName,
        email,
        role: role?.value,
        gender: gender?.value,
        ...(password && { password }),
      };

      console.log("Updating user with data:", updatedUser);

      const response = await api.put(`/user/${user.id}`, updatedUser);
      console.log("Response from API:", response.data.data);
      onUpdateUser(response.data.data);

      // Show success alert
      Swal.fire({
        icon: "success",
        title: "User Updated",
        text: "User details have been updated successfully.",
      });

      setIsAppear(false);
      setTimeout(() => {
        onClose();
      }, 300);
    } catch (err) {
      console.error("Error updating user:", err);
      setError(err.message);

      // Show error alert
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Failed to update user details. Please try again.",
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
    { value: "men", label: "Male" },
    { value: "women", label: "Female" },
  ];

  if (!isAppear) return null;

  return (
    <div>
      <div className="fixed inset-0 bg-black w-full bg-opacity-50" />
      <div className="fixed inset-0 z-50 w-3/4 lg:w-1/2 mx-auto bg-white p-7 my-auto h-fit rounded-xl shadow-xl">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-lg">Edit User</p>
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
            <label className="font-medium block">
              Password
              <br />
              <span className="text-sm italic font-light text-red-900">
                Leave blank to keep the current password
              </span>
            </label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              className="w-full border border-[#BDBDBD] rounded-lg p-2"
            />
          </div>

          <div className="mt-5 flex justify-end">
            <button
              className="bg-blue-600 text-white px-5 py-2 rounded"
              type="submit"
              disabled={loading}
            >
              {loading ? "Loading..." : "Update User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
