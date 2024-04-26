import React from "react";
import { render, screen, waitFor } from "@testing-library/react"; // Ensure waitFor is imported
import userEvent from "@testing-library/user-event";
import { WatchlistProvider, useWatchlist } from "./StockWatchlist";

const ConsumerComponent = () => {
  const { watchlist, addStockToWatchlist, removeStockFromWatchlist } =
    useWatchlist();

  return (
    <div>
      {watchlist.map((stock, index) => (
        <div key={index}>
          <p>{stock.symbol}</p>
          <button onClick={() => removeStockFromWatchlist(stock.symbol)}>
            Remove
          </button>
        </div>
      ))}
      <button onClick={() => addStockToWatchlist({ symbol: "AAPL", id: 1 })}>
        Add AAPL
      </button>
      <button onClick={() => addStockToWatchlist({ symbol: "MSFT", id: 2 })}>
        Add MSFT
      </button>
    </div>
  );
};

test("adds and removes stocks from the watchlist", async () => {
  render(
    <WatchlistProvider>
      <ConsumerComponent />
    </WatchlistProvider>
  );

  // Add AAPL to the watchlist
  userEvent.click(screen.getByText("Add AAPL"));
  await screen.findByText("AAPL"); // Wait for AAPL to appear

  // Add MSFT to the watchlist
  userEvent.click(screen.getByText("Add MSFT"));
  await screen.findByText("MSFT"); // Wait for MSFT to appear

  // Assume AAPL is the first added item and its "Remove" button is the first one
  const removeButtons = screen.getAllByText("Remove");
  userEvent.click(removeButtons[0]); // Click the first "Remove" button

  await waitFor(() =>
    expect(screen.queryByText("AAPL")).not.toBeInTheDocument()
  ); // Ensure AAPL is removed
});
