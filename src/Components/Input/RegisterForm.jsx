import React from "react";

const RegisterForm = ({ type, placeholder, value, onChange }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full p-3 border rounded-lg"
    />
  );
};

export default RegisterForm;
