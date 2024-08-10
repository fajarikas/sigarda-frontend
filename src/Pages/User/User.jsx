import React, { useEffect, useState } from "react";
import api from "../../API/api";
import UserCard from "../../Components/Card/UserCard";
import Title from "../../Components/Title/Title";
import Search from "../../Components/Search/Search";
import PrimaryButton from "../../Components/Button/PrimaryButton";
import { IoAddOutline } from "react-icons/io5";
import IconButton from "../../Components/Button/IconButton";
import AddUserModal from "../../Components/Modal/User/AddUserModal";

const User = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchItem, setSearchItem] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const userPerPages = 8;

  const indexOfLastUser = currentPage * userPerPages;
  const indexOfFirstUser = indexOfLastUser - userPerPages;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / userPerPages);

  const handleClickPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/user");
        setUsers(response.data.data);
        setFilteredUsers(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err);
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage]);

  const handleUserDelete = (id) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    setFilteredUsers((prevFilteredUsers) =>
      prevFilteredUsers.filter((user) => user.id !== id)
    );
  };

  const handleUserUpdate = (updatedUser) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
    setFilteredUsers((prevFilteredUsers) =>
      prevFilteredUsers.map((user) =>
        user.id === updatedUser.id ? updatedUser : user
      )
    );
  };

  const handleInputChange = (e) => {
    const searchTerm = e.target.value;
    setSearchItem(searchTerm);

    const filteredItems = users.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filteredItems);

    console.log("filteredItems", filteredItems);
  };

  const handleAddUser = (newUser) => {
    console.log("New user added:", newUser);
    setUsers((prevUsers) => [...prevUsers, newUser]);
    setFilteredUsers((prevFilteredUsers) => [...prevFilteredUsers, newUser]);
    setIsModalVisible(false);
    setCurrentPage(1);
  };
  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  return (
    <div className=" space-x-5 lg:space-x-0 block z-10 h-fit lg:h-fit w-10/12 lg:pb-0 pb-16 ">
      <Title text="Users" />
      <div className="mt-7 items-center w-full flex justify-between">
        <Search
          placeholder="Search user here"
          onChange={handleInputChange}
          value={searchItem}
        />
        <IconButton
          text={<IoAddOutline />}
          color="bg-[#9079E9]"
          onClick={handleOpenModal}
        />
      </div>
      <div
        className="mt-10 lg:grid lg:grid-cols-4 lg:space-y-0 space-y-5 gap-x-5 justify-between gap-y-10"
        key={filteredUsers.length}
      >
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error loading users</div>
        ) : currentUsers && currentUsers.length > 0 ? (
          currentUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onDelete={handleUserDelete}
              onUpdate={handleUserUpdate}
            />
          ))
        ) : (
          <div>No users found</div>
        )}
      </div>

      <div className="bg-white lg:w-fit shadow-xl rounded-lg  ">
        <div className="mt-5 flex justify-start  px-3 py-3  mb-4 mr-4 rounded-xl">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index + 1}
              onClick={() => handleClickPage(index + 1)}
              className={`${
                currentPage === index + 1
                  ? "bg-blue-600 text-white"
                  : "text-blue-600"
              } px-3 py-1 mx-1 rounded bottom-0 `}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {isModalVisible && (
        <AddUserModal onAddUser={handleAddUser} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default User;
