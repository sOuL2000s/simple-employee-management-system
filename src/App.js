import { React, useEffect } from "react";
import { Outlet } from "react-router-dom";

import "./App.css";

function App() {
  useEffect(() => {
    document.title = "EMS";
  }, []);
  return (
    <div className="App">
      <Outlet />
    </div>
  );
}

export default App;
