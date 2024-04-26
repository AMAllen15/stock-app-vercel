// // Write your Single Card component hereimport React from 'react';
// import React from "react";
// import { useNavigate } from "react-router-dom";

// const Card = ({ symbol }) => {
//   const navigate = useNavigate();

//   return (
//     <div className="card">
//       <div className="card_body">
//         <h2 className="card_title">{symbol}</h2>
//       </div>
//       <button
//         className="card_btn"
//         onClick={() => navigate(`/stocks/:${symbol}`, { state: symbol })}
//       >
//         View Details
//       </button>
//     </div>
//   );
// };

// export default Card;

// Write your Single Card component hereimport React from 'react';
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWatchlist } from "../components/StockWatchlist"; // Import useWatchlist

const Card = ({ symbol }) => {
  const navigate = useNavigate();
  const [isFavorited, setIsFavorited] = useState(false);
  const { addStockToWatchlist, removeStockFromWatchlist } = useWatchlist();

  const toggleFavorite = () => {
    const stock = { symbol }; // Create a stock object
    if (isFavorited) {
      removeStockFromWatchlist(symbol);
    } else {
      addStockToWatchlist(stock);
    }
    setIsFavorited(!isFavorited);
  };

  return (
    <>
      <div className="card">
        <div className="card_body">
          <h2 className="card_title">{symbol}</h2>
          <div className="button_container">
            <button
              className="card_btn"
              onClick={() => navigate(`/stocks/:${symbol}`, { state: symbol })}
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Card;
