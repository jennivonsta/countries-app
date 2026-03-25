// version-1/src/App.jsx

// useState = store data in state
// useEffect = run code when component loads / when dependencies change
import { useEffect, useState } from "react";

// React Router tools:
// Routes/Route decide which page to show for a URL
// Link makes navigation links without page refresh
import { Routes, Route, Link } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import SavedCountries from "./pages/SavedCountries";
import CountryDetail from "./pages/CountryDetail";

// Backup local data (used only if the API fails)
import localData from "../localData";

import "./App.css";


// Key name for saving the saved countries list into localStorage
const SAVED_KEY = "savedCountries";

function App() {
  // countries = all countries pulled from the API (or fallback localData)
  const [countries, setCountries] = useState([]);

  // savedCountryCodes = list of saved country codes (cca3), like ["USA", "FRA"]
  // We load it from localStorage the very first time the app runs.
  const [savedCountryCodes, setSavedCountryCodes] = useState(() => {
    const stored = localStorage.getItem(SAVED_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  // Run once when App loads: fetch countries from the REST Countries API
  useEffect(() => {
    async function fetchCountries() {
      try {
        // API call: request only the fields we need (smaller/faster response)
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,flags,population,capital,region,cca3,borders"
        );

        // If the response is not OK, throw an error to go to catch()
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        // Convert API response to JavaScript data
        const data = await response.json();

        // Save the API data into state
        // Updating state triggers a re-render so the pages get the data
        setCountries(data);
      } catch (error) {
        // If the API fails, log the error and use localData instead
        console.error("API failed, using local data instead:", error);
        setCountries(localData);
      }
    }

    fetchCountries();
  }, []); // empty array = run once on initial load

  // Whenever savedCountryCodes changes, write it to localStorage
  useEffect(() => {
    localStorage.setItem(SAVED_KEY, JSON.stringify(savedCountryCodes));
  }, [savedCountryCodes]);

  // Toggle save / unsave a country using its cca3 code
  function toggleSaveCountry(cca3) {
    setSavedCountryCodes((prevCodes) => {
      // If already saved, remove it
      if (prevCodes.includes(cca3)) {
        return prevCodes.filter((code) => code !== cca3);
      }
      // Otherwise add it
      return [...prevCodes, cca3];
    });
  }

  return (
    <>
      {/* Header shown on every page */}
      <header className="header">
        {/* Title links back to Home */}
        <Link className="header__title" to="/">
          Where in the world?
        </Link>

        {/* Link to Saved Countries page */}
        <Link className="header__link" to="/saved">
          Saved Countries
        </Link>
      </header>

      {/* Routes decide which page to show based on the URL */}
      <Routes>
        {/* Home gets the countries list and saved list (optional, but useful) */}
        <Route
          path="/"
          element={
            <Home
              countriesData={countries}
              savedCountryCodes={savedCountryCodes}
            />
          }
        />

        {/* SavedCountries shows profile form + saved list */}
        <Route
          path="/saved"
          element={
            <SavedCountries
              countriesData={countries}
              savedCountryCodes={savedCountryCodes}
              toggleSaveCountry={toggleSaveCountry}
            />
          }
        />

        {/* Country detail route uses a URL param named countryName */}
        <Route
          path="/country-detail/:countryName"
          element={
            <CountryDetail
              countriesData={countries}
              savedCountryCodes={savedCountryCodes}
              toggleSaveCountry={toggleSaveCountry}
            />
          }
        />
      </Routes>
    </>
  );
}

export default App;
