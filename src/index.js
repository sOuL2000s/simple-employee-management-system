import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
import RegisterForm from "./components/Auth/RegisterForm";
import LoginForm from "./components/Auth/LoginForm";
import Protected from "./components/Protected";
import HomePage from "./components/pages/HomePage";
import ForgotPassword from "./components/Auth/ForgotPassword";
import MessagesPage from "./components/pages/MessagesPage";
import EmployeeList from "./components/pages/EmpList";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App></App>}>
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/" element={<Protected />}>
        <Route path="/" index element={<HomePage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/admin-emp-details" element={<EmployeeList />} />
      </Route>
      {/* <Route path="*" element={<NotFoundPage />} />{" "} */}
      {/* Catch-all route for 404 */}
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
