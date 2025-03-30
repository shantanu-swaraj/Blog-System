import React from "react";

const SearchBar = ({ onSearch }) => {
    return (
        <input
            type="text"
            placeholder="Search blog..."
            className="border p-2 w-full"
            onChange={(e) => onSearch(e.target.value)}
        />
    );
};

export default SearchBar;
