import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import NavBar from "../navbar/NavBarHome";
import "./Page.css";

export default function ProfilePage() {
  const [username, setUsername] = useState("");
  const [leaves, setLeaves] = useState(0);
  const [position, setPosition] = useState("");
  const [empId, setEmpId] = useState("");
  const [phone, setPhone] = useState("");
  const [salary, setSalary] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchDetails() {
      const user = JSON.parse(localStorage.getItem("user"));
      const userDocRef = doc(db, "EmpDetails", user.uid);

      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        setUsername(userData.username);
        setPosition(userData.position);
        setEmpId(userData.empId);
        setPhone(userData.phone);
      }
      setLoading(false);
    }
    fetchDetails();
  }, []);

  useEffect(() => {
    async function fetchLeaves() {
      if (empId) {
        const empDocRef = doc(db, "EmpID's", empId);
        const empDocSnap = await getDoc(empDocRef);
        if (empDocSnap.exists()) {
          const empData = empDocSnap.data();
          setLeaves(empData.leaves);
          setSalary(empData.salary);
        }
      }
    }
    fetchLeaves();
  }, [empId]);

  const userSignOut = async () => {
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
    <div className="profile-page-container">
      <NavBar />
      {loading ? (
        <div className="loading-container">
          <p>Loading...</p>
        </div>
      ) : (
        <div className="profile">
          <div>
            <h1>{username}</h1>
          </div>
          <div>
            <h1>ID: {empId}</h1>
          </div>
          <div>
            <h3>Position: {position.toUpperCase()}</h3>
          </div>
          <div>
            <h2>Salary: ₹ {salary}</h2>
          </div>
          <div>
            <h3>Leaves left: {leaves}</h3>
          </div>
          <div>
            <h3>Phone Number: {phone}</h3>
          </div>
        </div>
      )}
      <div className="logout-btn">
        <button onClick={userSignOut}>Log Out</button>
      </div>
    </div>
  );
}
