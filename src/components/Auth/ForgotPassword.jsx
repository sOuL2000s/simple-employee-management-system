import React, { useState } from "react";
// import { FaEnvelope } from "react-icons/fa";
import { auth } from "../../firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";

import NavBar from "../navbar/NavBar";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success(
        "Password reset email sent. Please check your email inbox."
      );
    } catch (error) {
      toast.error("Error sending password reset email. Please try again.");
      console.error("Password reset error:", error);
    }
  };

  return (
    <div>
      <ToastContainer />
      <NavBar />
      <div className="wrapper">
        <form onSubmit={handleForgotPassword}>
          <h1>Forgot Password</h1>

          <div className="input-box">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {/* <FaEnvelope className="icon" /> */}
          </div>
          <div>
            <div className="forgot-password">
              <p>
                Remember your password? <Link to="/">Login</Link>
              </p>
            </div>
          </div>
          <div>
            <button type="submit">Send Password Reset Email</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
