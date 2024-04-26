import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PortfolioProvider, usePortfolio } from "./StockPortfolio";

const ConsumerComponent = () => {
  const {
    portfolio,
    addToPortfolio,
    removeFromPortfolio,
    watchlist,
    addToWatchlist,
  } = usePortfolio();

  return (
    <div>
      {portfolio.map((stock) => (
        <p key={stock.id}>{`Portfolio: ${stock.symbol}`}</p>
      ))}
      {watchlist.map((stock) => (
        <p key={stock.id}>{`Watchlist: ${stock.symbol}`}</p>
      ))}
      <button onClick={() => addToPortfolio({ id: 1, symbol: "AAPL" })}>
        Add to Portfolio
      </button>
      <button onClick={() => removeFromPortfolio(1)}>
        Remove from Portfolio
      </button>
      <button onClick={() => addToWatchlist({ id: 2, symbol: "MSFT" })}>
        Add to Watchlist
      </button>
    </div>
  );
};

test("manages portfolio and watchlist", async () => {
  render(
    <PortfolioProvider>
      <ConsumerComponent />
    </PortfolioProvider>
  );

  // Add to portfolio and wait for the element to appear
  userEvent.click(screen.getByText("Add to Portfolio"));
  await screen.findByText("Portfolio: AAPL");

  // Add to watchlist and check asynchronously
  userEvent.click(screen.getByText("Add to Watchlist"));
  await screen.findByText("Watchlist: MSFT");

  // Remove from portfolio
  userEvent.click(screen.getByText("Remove from Portfolio"));
  await waitFor(() => {
    expect(screen.queryByText("Portfolio: AAPL")).not.toBeInTheDocument();
  });
});
