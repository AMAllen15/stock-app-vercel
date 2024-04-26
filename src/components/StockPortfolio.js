import React, { createContext, useContext, useState } from "react";

const PortfolioContext = createContext();
export const usePortfolio = () => useContext(PortfolioContext);

export const PortfolioProvider = ({ children }) => {
  const [portfolio, setPortfolio] = useState([]);
  const [watchlist, setWatchlist] = useState([]);

  const addToPortfolio = (stock) => {
    setPortfolio((prevPortfolio) => [...prevPortfolio, stock]);
  };

  const removeFromPortfolio = (id) => {
    setPortfolio((prevPortfolio) =>
      prevPortfolio.filter((stock) => stock.id !== id)
    );
  };

  const addToWatchlist = (stock) => {
    setWatchlist([...watchlist, stock]);
  };

  return (
    <PortfolioContext.Provider
      value={{
        portfolio,
        addToPortfolio,
        removeFromPortfolio,
        watchlist,
        addToWatchlist,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export { PortfolioContext };
