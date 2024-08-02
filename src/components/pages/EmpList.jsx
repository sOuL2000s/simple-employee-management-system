import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
  writeBatch,
} from "firebase/firestore";
import { db } from "../../firebase";
import "./EmpList.css";
import Navbar from "../navbar/NavBarAdmin";

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [originalValues, setOriginalValues] = useState({});

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "EmpID's"));
        const employeeList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Store the original salary and leaves for each employee
        const originalValues = employeeList.reduce((acc, employee) => {
          acc[employee.id] = {
            salary: employee.salary,
            leaves: employee.leaves,
          };
          return acc;
        }, {});

        setEmployees(employeeList);
        setOriginalValues(originalValues);
      } catch (error) {
        console.error("Error fetching employee details: ", error);
      }
    };

    fetchEmployees();
  }, []);

  const handleUpdate = async (id, newSalary, newLeaves) => {
    try {
      const employeeRef = doc(db, "EmpID's", id);
      const updates = {};
      const messages = [];

      const oldSalary = originalValues[id]?.salary;
      const oldLeaves = originalValues[id]?.leaves;

      if (oldSalary !== newSalary) {
        updates.salary = newSalary;
        messages.push({
          date: new Date().toISOString(),
          note: `Salary updated to ${newSalary}`,
        });
      }

      if (oldLeaves !== newLeaves) {
        updates.leaves = newLeaves;
        messages.push({
          date: new Date().toISOString(),
          note: `Leaves updated to ${newLeaves}`,
        });
      }

      if (messages.length > 0) {
        updates.messages = arrayUnion(...messages);
        await updateDoc(employeeRef, updates);

        setEmployees((prevEmployees) =>
          prevEmployees.map((employee) =>
            employee.id === id
              ? { ...employee, salary: newSalary, leaves: newLeaves }
              : employee
          )
        );

        // Update the original values
        setOriginalValues((prevValues) => ({
          ...prevValues,
          [id]: { salary: newSalary, leaves: newLeaves },
        }));

        alert("Employee details updated successfully!");
      }
    } catch (error) {
      console.error("Error updating employee details: ", error);
      alert("Failed to update employee details.");
    }
  };

  const handleSendMessageToAll = async () => {
    try {
      const batch = writeBatch(db);
      employees.forEach((employee) => {
        const employeeRef = doc(db, "EmpID's", employee.id);
        const message = {
          date: new Date().toISOString(),
          note: `You received your salary of ${employee.salary}`,
        };
        batch.update(employeeRef, {
          messages: arrayUnion(message),
        });
      });
      await batch.commit();
      alert("Messages sent to all employees!");
    } catch (error) {
      console.error("Error sending message to all employees: ", error);
      alert("Failed to send message to all employees.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="employee-list">
        <h1>Employee Details</h1>
        {employees.length > 0 ? (
          <>
            <table>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Position</th>
                  <th>Employee ID</th>
                  <th>Salary</th>
                  <th>Leaves</th>
                  <th>Update</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee, index) => (
                  <tr key={index}>
                    <td>{employee.username}</td>
                    <td>{employee.email}</td>
                    <td>{employee.phone}</td>
                    <td>{employee.position}</td>
                    <td>{employee.empId}</td>
                    <td>
                      <input
                        type="number"
                        value={employee.salary}
                        onChange={(e) =>
                          setEmployees((prevEmployees) =>
                            prevEmployees.map((emp) =>
                              emp.id === employee.id
                                ? {
                                    ...emp,
                                    salary: parseInt(e.target.value, 10),
                                  }
                                : emp
                            )
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={employee.leaves}
                        onChange={(e) =>
                          setEmployees((prevEmployees) =>
                            prevEmployees.map((emp) =>
                              emp.id === employee.id
                                ? {
                                    ...emp,
                                    leaves: parseInt(e.target.value, 10),
                                  }
                                : emp
                            )
                          )
                        }
                      />
                    </td>
                    <td>
                      <button
                        onClick={() =>
                          handleUpdate(
                            employee.id,
                            employee.salary,
                            employee.leaves
                          )
                        }
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              className="send-message-btn"
              onClick={handleSendMessageToAll}
            >
              Send Salary Message to All
            </button>
          </>
        ) : (
          <p>No employee details available.</p>
        )}
      </div>
    </div>
  );
}
