import React from "react";

const RegisterButton = ({ type }) => {
  return (
    <button
      type={type}
      className="w-full p-3 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-700"
    >
      Create Account
    </button>
  );
};

export default RegisterButton;
