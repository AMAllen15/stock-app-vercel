import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Stocks from "./pages/Stocks";
import Watchlist from "./pages/Watchlist";
import Layout from "./components/Layout";
import { WatchlistProvider } from "./components/StockWatchlist";
import { PortfolioProvider } from "./components/StockPortfolio";
import "./App.css";
import ChatPage from "./pages/ChatPage";
import Portfolio from "./components/Portfolio";

const App = () => {
  return (
    <BrowserRouter>
      <PortfolioProvider>
        <WatchlistProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/stocks/:symbol" element={<Stocks />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/watchlist" element={<Watchlist />} />
              <Route path="/portfolio" element={<Portfolio />} />
            </Route>
          </Routes>
        </WatchlistProvider>
      </PortfolioProvider>
    </BrowserRouter>
  );
};

export default App;
