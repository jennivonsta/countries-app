// version-1/src/main.jsx

import React from "react";
import ReactDOM from "react-dom/client";

// BrowserRouter turns on routing for the entire app
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";

// Global CSS
import "./index.css";

// Render App into the #root div in index.html
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
