// Import routing components from react-router-dom.
// - Routes: container that holds all our routes
// - Route: defines a single route
// - Link: lets us navigate without reloading the page
import { Routes, Route, Link } from "react-router-dom";

// Import global styles for this component
import "./App.css";

// Import the page components for each route
import Home from "./pages/Home";
import SavedCountries from "./pages/SavedCountries";
import CountryDetail from "./pages/CountryDetail";

// Import the local countries data.
// localData.js lives one level ABOVE src (next to package.json),
// so we use ../ to go up one directory.
import countriesData from "../localData";

// App is the root component for the entire application.
// This is where routing and shared layout (like the header) live.
function App() {
  return (
    <>
      {/* Header is shown on every page */}
      <header className="header">
        {/* 
          Link replaces <a> tags in React Router.
          Clicking this takes the user to the Home page ("/")
          without refreshing the browser.
        */}
        <Link className="header__title" to="/">
          Where in the world?
        </Link>

        {/* 
          This Link navigates to the Saved Countries page.
          The URL path is "/saved".
        */}
        <Link className="header__link" to="/saved">
          Saved Countries
        </Link>
      </header>

      {/* 
        Routes wraps all Route components.
        Only the Route that matches the current URL will render.
      */}
      <Routes>
        {/* 
          Home Route:
          - path="/" means this is the Home page
          - We pass countriesData as a prop into Home
        */}
        <Route
          path="/"
          element={<Home countriesData={countriesData} />}
        />

        {/* 
          Saved Countries Route:
          - This page exists, but is not fully built yet
        */}
        <Route path="/saved" element={<SavedCountries />} />

        {/* 
          Country Detail Route:
          - :name is a route parameter
          - This page will be built later in the backend portion
        */}
        <Route path="/country/:name" element={<CountryDetail />} />
      </Routes>
    </>
  );
}

// Export App so it can be used by main.jsx
export default App;
