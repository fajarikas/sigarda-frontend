import React from "react";

const Search = ({ value, onChange, placeholder }) => {
  return (
    <div className="">
      <input
        className="shadow-lg py-3 px-3  rounded-lg"
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
};

export default Search;
