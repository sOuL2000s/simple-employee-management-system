import React from "react";
import { useNavigate } from "react-router-dom";
import "./NavBar.css";

import { auth } from "../../firebase";

const Navbar = () => {
  const navigate = useNavigate();

  const signOut = async () => {
    await signOut(auth)
      .then(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  };
  return (
    <nav className="navbar">
      {/* <div className="icon">
        <Link to="/admin">Home 🏠</Link>
      </div> */}
      <div className="navbar-container">
        Employee Managenment System Admin Panel
      </div>
      <div className="logout">
        <button onClick={signOut}>Log Out</button>
      </div>
    </nav>
  );
};

export default Navbar;
