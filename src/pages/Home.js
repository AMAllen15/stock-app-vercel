import React, { useState } from "react";
import Cards from "../components/Cards";
import Search from "../components/Search";
import Chat from "../components/Chat";
import NewsComponent from "../components/News";

const Home = () => {
  const [searchString, setSearchString] = useState("");
  const handleSearchStringUpdate = (searchString) => {
    setSearchString(searchString);
  };

  return (
    <>
      <Search searchStringUpdated={handleSearchStringUpdate} />
      <Cards searchString={searchString} />
      <NewsComponent />
    </>
  );
};

export default Home;
