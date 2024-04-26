import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWatchlist } from "../components/StockWatchlist"; // make sure the path matches

const Watchlist = () => {
  const { watchlist, removeStockFromWatchlist } = useWatchlist(); // Destructure removeStockFromWatchlist here
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Current watchlist:", watchlist);
  }, [watchlist]);

  return (
    <div className="watchlist-container">
      <h1>Your Watchlist</h1>
      <div className="stock-list">
        {watchlist.length > 0 ? (
          watchlist.map((stock) => (
            <div key={stock.symbol} className="stock-item">
              <h2>{stock.symbol}</h2>
              <button
                onClick={() =>
                  navigate(`/stocks/:${stock.symbol}`, { state: stock.symbol })
                }
              >
                View Details
              </button>
              <button
                onClick={() => removeStockFromWatchlist(stock.symbol)} // Use removeStockFromWatchlist here
                style={{ marginLeft: "10px", color: "red" }}
              >
                Remove
              </button>
            </div>
          ))
        ) : (
          <p>Your watchlist is empty.</p>
        )}
      </div>
    </div>
  );
};

export default Watchlist;
