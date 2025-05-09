import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";  // Ensure this line is present
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
