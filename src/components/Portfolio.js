import React, { useContext } from "react";
import { PortfolioContext } from "../components/StockPortfolio"; // Ensure this path matches

const Portfolio = () => {
  const { portfolio, removeFromPortfolio } = useContext(PortfolioContext); // Use the context

  return (
    <div>
      <h1>My Portfolio</h1>
      {portfolio.length > 0 ? (
        portfolio.map((stock, index) => (
          <div key={index}>
            <h2>
              {stock.symbol} - {stock.quantity} shares
            </h2>
            <p>Current Price: ${stock.price}</p>
            <button onClick={() => removeFromPortfolio(stock.id)}>
              Remove
            </button>
          </div>
        ))
      ) : (
        <p>Your portfolio is empty.</p>
      )}
    </div>
  );
};

export default Portfolio;
