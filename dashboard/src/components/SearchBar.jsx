import React from "react";
import "../App.css"; // Optional: For styling

const SearchBar = ({ searchTerm, onSearch, placeholder }) => {
  return (
    <div className="search-bar">
      <input
        style={{ minWidth: "500px" }}
        type="text"
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
        placeholder={placeholder || "Search..."}
        className="search-input"
      />
    </div>
  );
};

export default SearchBar;
