import React, { createContext, useContext, useState, useEffect } from "react";

const WatchlistContext = createContext();

export const useWatchlist = () => useContext(WatchlistContext);

export const WatchlistProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState([]);

  const addStockToWatchlist = (stock) => {
    // Adding a stock and logging the operation
    setWatchlist((currentWatchlist) => {
      const newWatchlist = [...currentWatchlist, stock];
      console.log("Adding stock:", stock);
      console.log("New watchlist:", newWatchlist);
      return newWatchlist;
    });
  };

  const removeStockFromWatchlist = (symbol) => {
    setWatchlist((currentWatchlist) => {
      const filteredWatchlist = currentWatchlist.filter(
        (stock) => stock.symbol !== symbol
      );
      console.log("Removing stock with symbol:", symbol);
      console.log("Updated watchlist after removal:", filteredWatchlist);
      return filteredWatchlist;
    });
  };

  // Using useEffect to log changes to watchlist
  useEffect(() => {
    console.log("Current watchlist:", watchlist);
  }, [watchlist]); // This effect runs every time watchlist changes

  return (
    <WatchlistContext.Provider
      value={{ watchlist, addStockToWatchlist, removeStockFromWatchlist }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};
