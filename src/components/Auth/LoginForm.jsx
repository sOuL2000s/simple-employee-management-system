import React, { useState } from "react";
import "./Auth.css";

import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";

import NavBar from "../navbar/NavBar";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const signIn = async (e) => {
    toast.info("Signing in...");

    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(userCredential);
      const user = userCredential.user;
      localStorage.setItem("token", user.accessToken);
      localStorage.setItem("user", JSON.stringify(user));

      const empRef1 = doc(db, "Admins", user.uid);
      const empSnap1 = await getDoc(empRef1);
      if (empSnap1.exists()) {
        toast.success("Sign In Succesfull!!!");
        navigate("/admin-emp-details");
      } else {
        toast.success("Sign In Succesfull!!!");
        navigate("/");
      }
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        toast.error("User not found. Please check your email and try again.");
        console.log(error);
      } else {
        toast.error(error.message);
        console.log(error);
      }
    }
  };

  return (
    <div>
      <ToastContainer />
      <NavBar />
      <div>
        <div className="wrapper">
          <form onSubmit={signIn}>
            <h1>Login</h1>
            <div className="input-box">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {/* <FaUser className="icon" /> */}
            </div>
            <div className="input-box">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {/* <FaLock className="icon" /> */}
            </div>

            <div className="forgot-password">
              <Link to="/forgot-password">Forgot password?</Link>
            </div>

            <div>
              <button type="submit">Login</button>
            </div>

            <div className="register-link">
              <p>
                Don't have an account? <Link to="/register"> Register</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
