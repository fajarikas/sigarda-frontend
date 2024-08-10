import React from "react";

const LoginButton = ({ type }) => {
  return (
    <button
      type={type}
      className="py-4 px-5 w-11/12 bg-[#01BEA3] text-white font-medium rounded-lg hover:bg-white  hover:text-[#01BEA3] hover:border hover:border-[#01BEA3]"
    >
      Sign In
    </button>
  );
};

export default LoginButton;
