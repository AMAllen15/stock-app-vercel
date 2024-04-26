import React from "react";
import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <nav className="header">
      <div className="header-nav">
        {/* Brand Title */}
        <NavLink to="/" className="header-title">
          Stock Market App
        </NavLink>
        {/* Navigation Links */}
        <NavLink to="/chat" className="nav-link">
          Chat Room
        </NavLink>
        <NavLink to="/watchlist" className="nav-link">
          Watchlist
        </NavLink>
        <NavLink to="/portfolio" className="nav-link">
          Portfolio
        </NavLink>
      </div>
    </nav>
  );
};

export default Header;
