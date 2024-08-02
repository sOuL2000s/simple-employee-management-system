import React, { useState, useEffect } from "react";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import Navbar from "../navbar/NavBarHome";
import "./MessagesPage.css";

export default function UserMessages() {
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const userDocRef = doc(db, "EmpDetails", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setUsername(userData.username);

          const empDocRef = doc(db, "EmpID's", userData.empId);
          const empDocSnap = await getDoc(empDocRef);

          if (empDocSnap.exists()) {
            const empData = empDocSnap.data();
            setMessages(empData.messages.reverse() || []);
          } else {
            console.error("No such document in EmpID's collection!");
          }
        } else {
          console.error("No such document in EmpDetails collection!");
        }
      } catch (error) {
        console.error("Error fetching messages: ", error);
      }
    };

    fetchMessages();
  }, []);

  const convertToIST = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    });
  };

  return (
    <div>
      <Navbar />
      <div className="user-messages">
        <h1>Messages for {username}</h1>
        <div className="messages-list">
          {messages.length > 0 ? (
            <ul>
              {messages.map((message, index) => (
                <li key={index}>
                  <p>Date: {convertToIST(message.date)}</p>
                  <p>Note: {message.note}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No messages found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
