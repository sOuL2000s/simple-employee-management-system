import React from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="icon">
        <Link to="/">Home🏠</Link>
      </div>
      <div className="icon">Employee Managenment System</div>

      <div className="icon">
        <Link to="/messages">Messages🔔</Link>
      </div>
    </nav>
  );
};

export default Navbar;
