import React from "react";

const LoginForm = ({ placeholder, type, value, onChange }) => {
  return (
    <div>
      <input
        name="login"
        placeholder={placeholder}
        className="bg-[#e9e9e9] py-4 px-5 w-11/12 rounded-lg"
        type={type}
        value={value}
        onChange={onChange}
        required
      />
    </div>
  );
};

export default LoginForm;
