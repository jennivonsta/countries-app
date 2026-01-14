// Import React (needed for JSX)
import React from "react";

// Import ReactDOM to connect React to the actual browser DOM
import ReactDOM from "react-dom/client";

// Import BrowserRouter to enable client-side routing
import { BrowserRouter } from "react-router-dom";

// Import the root App component
import App from "./App.jsx";

// Import global styles
import "./index.css";

// Create the React root and render the app into the div with id="root"
ReactDOM.createRoot(document.getElementById("root")).render(
  // StrictMode helps catch potential problems during development
  <React.StrictMode>

    {/* 
      BrowserRouter wraps the entire app.
      This enables routing and allows Link, Routes, and Route to work.
    */}
    <BrowserRouter>
      <App />
    </BrowserRouter>

  </React.StrictMode>
);
