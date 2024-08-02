import React, { useState } from "react";
import "./Auth.css";

import NavBar from "../navbar/NavBar";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import { setDoc, doc, getDoc } from "firebase/firestore";

import { Link, useNavigate } from "react-router-dom";

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [empPosition, setEmpPosition] = useState("");
  const navigate = useNavigate();

  const signUp = async (e) => {
    e.preventDefault();
    try {
      let dummyPhone = "";
      for (let i = 5; i < 10; i++) {
        dummyPhone += phone[i];
      }
      let empIdHR = "HR" + dummyPhone;
      let empIdManager = "MN" + dummyPhone;
      let empIdDeveloper = "DV" + dummyPhone;

      const empRef1 = doc(db, "EmpID's", empIdHR);
      const empSnap1 = await getDoc(empRef1);

      const empRef2 = doc(db, "EmpID's", empIdManager);
      const empSnap2 = await getDoc(empRef2);

      const empRef3 = doc(db, "EmpID's", empIdDeveloper);
      const empSnap3 = await getDoc(empRef3);

      if (empSnap1.exists() || empSnap2.exists() || empSnap3.exists()) {
        toast.error("Account already exist on this email or phone no.");
        throw new Error("Account exist already");
      } else if (phone.length !== 10) {
        toast.error("Phone number must be 10 digits.");
        throw new Error("Invalid phone number");
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        localStorage.setItem("token", user.accessToken);
        localStorage.setItem("user", JSON.stringify(user));

        let salary = 0;
        let empId = "";
        if (empPosition === "developer") {
          empId = empIdDeveloper;
          salary = 25000;
        } else if (empPosition === "hr") {
          empId = empIdHR;
          salary = 40000;
        } else {
          empId = empIdManager;
          salary = 60000;
        }

        // Details
        const EmpDetails = {
          username: username,
          email: email,
          phone: phone,
          position: empPosition.toLowerCase(),
          empId: empId,
          salary: salary,
        };
        await setDoc(doc(db, "EmpDetails", user.uid), EmpDetails);

        let leaves = 14;
        if (empPosition === "hr") {
          leaves = 18;
        } else if (empPosition === "manager") {
          leaves = 22;
        }

        // Details
        const EmpId = {
          username: username,
          email: email,
          phone: phone,
          position: empPosition.toLowerCase(),
          empId: empId,
          salary: salary,
          leaves: leaves,
          uid: user.uid,
          messages: [
            {
              date: new Date().toISOString(),
              note: "Succesfully registered",
            },
          ],
        };
        await setDoc(doc(db, "EmpID's", empId), EmpId);

        navigate("/");
      }
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        toast.error("The email address is already in use");
      } else {
        console.log(error);
      }
    }
  };

  return (
    <div>
      <ToastContainer />
      <NavBar />
      <div className="wrapper">
        <form onSubmit={signUp}>
          <h1>Let's Create Your Account</h1>
          <div className="input-box">
            {/* <FaUser className="icon" /> */}
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-box">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {/* <FaEnvelope className="icon" /> */}
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
          <div className="input-box">
            <input
              type="number"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            {/* <FaPhone className="icon" /> */}
          </div>
          <div className="register-input-box">
            <select
              id="empPosition"
              value={empPosition}
              onChange={(e) => setEmpPosition(e.target.value)}
              required
            >
              <option value="" disabled hidden>
                Select your position
              </option>
              <option value="hr">HR</option>
              <option value="developer">Developer</option>
              <option value="manager">Manager</option>
            </select>
          </div>
          <div className="forgot-password">
            <p>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>

          <div>
            <button type="submit">Register EMS</button>
          </div>
        </form>
      </div>
    </div>
  );
}
