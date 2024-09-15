import React from "react";

const CreateAccountButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="py-4 px-5 w-11/12 bg-blue-600 text-white font-medium rounded-lg hover:bg-white  hover:text-blue-600 hover:border hover:border-blue-600"
    >
      Create an Account
    </button>
  );
};

export default CreateAccountButton;
