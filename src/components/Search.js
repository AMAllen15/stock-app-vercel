import React from "react";
import { BsSearch } from "react-icons/bs";

const Search = ({ searchStringUpdated }) => {
  const submitSearchString = (event) => {
    event.preventDefault();
    searchStringUpdated(event.target.elements.search.value);
  };

  return (
    <div className="search-container">
      <form onSubmit={submitSearchString} className="search-form">
        <div className="search-input-container">
          <input
            type="text"
            name="search"
            placeholder="Search by Symbol..."
            onChange={(e) => searchStringUpdated(e.target.value)}
            className="search-input"
            autoComplete="off"
          />
          <button type="submit" className="search-button">
            <BsSearch />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Search;
