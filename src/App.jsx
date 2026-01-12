import { Routes, Route, Link } from "react-router-dom";
import "./App.css";

import Home from "./pages/Home";
import SavedCountries from "./pages/SavedCountries";
import CountryDetail from "./pages/CountryDetail";

// localData.js is in the project root (same level as package.json),
// so from src/App.jsx we go up one level with ../
import countriesData from "../localData";

function App() {
  return (
    <>
      <header className="header">
        <Link className="header__title" to="/">
          Where in the world?
        </Link>

        <Link className="header__link" to="/saved">
          Saved Countries
        </Link>
      </header>

      <Routes>
        <Route path="/" element={<Home countriesData={countriesData} />} />
        <Route path="/saved" element={<SavedCountries />} />
        <Route path="/country/:name" element={<CountryDetail />} />
      </Routes>
    </>
  );
}

export default App;
