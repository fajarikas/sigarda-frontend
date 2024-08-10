import React from "react";

const PrimaryButton = ({ text, color, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`${color} px-3 py-2  rounded text-white font-base`}
    >
      {text}
    </button>
  );
};

export default PrimaryButton;
