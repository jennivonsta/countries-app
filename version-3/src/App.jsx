// useState = store data in state
// useEffect = run code when component loads / when dependencies change
import { useEffect, useMemo, useState } from "react";

// React Router tools:
// Routes/Route decide which page to show for a URL
// Link makes navigation links without page refresh
import { Routes, Route, Link } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import SavedCountries from "./pages/SavedCountries";
import CountryDetail from "./pages/CountryDetail";

// Backup local data (used only if the REST Countries API fails)
import localData from "../localData";

import "./App.css";

function App() {
  // countries = all countries pulled from the REST Countries API (or fallback localData)
  const [countries, setCountries] = useState([]);

  // savedCountryNames = list of saved country names stored in the BACKEND
  // Example: ["Belgium", "Brazil", "Germany"]
  const [savedCountryNames, setSavedCountryNames] = useState([]);

  // --------------------------------------------
  // 1) Fetch countries from REST Countries API
  // --------------------------------------------
  useEffect(() => {
    async function fetchCountries() {
      try {
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,flags,population,capital,region,cca3,borders"
        );

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();
        setCountries(data);
      } catch (error) {
        console.error("REST Countries API failed, using local data:", error);
        setCountries(localData);
      }
    }

    fetchCountries();
  }, []);

  // --------------------------------------------
  // 2) Helper: fetch saved countries from BACKEND
  // --------------------------------------------
  async function refreshSavedCountries() {
    try {
      // "/api" path works with:
      // - local Vite proxy
      // - Netlify _redirects
      const res = await fetch("/api/get-all-saved-countries");

      if (!res.ok) throw new Error(`Saved countries GET failed: ${res.status}`);

      const data = await res.json();

      // API returns an array of objects, including country_name
      // We'll store ONLY the names in state (simple + easy to compare)
      const names = data.map((item) => item.country_name);
      setSavedCountryNames(names);
    } catch (err) {
      console.error(err);
      // If backend fails, keep whatever we already have (don’t crash the app)
    }
  }

  // Run once when App loads: pull saved countries from backend
  useEffect(() => {
    refreshSavedCountries();
  }, []);

  // --------------------------------------------
  // 3) Save/Unsave helpers that talk to BACKEND
  // --------------------------------------------
  async function saveCountry(countryName) {
    try {
      const res = await fetch("/api/save-one-country", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country_name: countryName }),
      });

      if (!res.ok) throw new Error(`Save failed: ${res.status}`);

      // Refresh saved list after saving
      await refreshSavedCountries();
    } catch (err) {
      console.error(err);
    }
  }

  async function unsaveCountry(countryName) {
    try {
      const res = await fetch("/api/unsave-one-country", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country_name: countryName }),
      });

      if (!res.ok) throw new Error(`Unsave failed: ${res.status}`);

      // Refresh saved list after unsaving
      await refreshSavedCountries();
    } catch (err) {
      console.error(err);
    }
  }

  // Toggle save/unsave for a country by NAME (the backend uses country_name)
  async function toggleSaveCountryByName(countryName) {
    const isSaved = savedCountryNames.includes(countryName);

    if (isSaved) {
      await unsaveCountry(countryName);
    } else {
      await saveCountry(countryName);
    }
  }

  // Optional convenience: if any component still wants saved cca3 codes
  // (We can derive them from names + countriesData)
  const savedCountryCodes = useMemo(() => {
    return savedCountryNames
      .map((name) => countries.find((c) => c.name.common === name)?.cca3)
      .filter(Boolean);
  }, [savedCountryNames, countries]);

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
        <Route
          path="/"
          element={
            <Home
              countriesData={countries}
              // Keep passing these if your Home uses them
              savedCountryCodes={savedCountryCodes}
            />
          }
        />

        <Route
          path="/saved"
          element={
            <SavedCountries
              countriesData={countries}
              savedCountryNames={savedCountryNames}
              // This triggers backend save/unsave
              toggleSaveCountryByName={toggleSaveCountryByName}
              // Useful if SavedCountries wants to refresh list after changes
              refreshSavedCountries={refreshSavedCountries}
            />
          }
        />

        <Route
          path="/country-detail/:countryName"
          element={
            <CountryDetail
              countriesData={countries}
              savedCountryNames={savedCountryNames}
              toggleSaveCountryByName={toggleSaveCountryByName}
            />
          }
        />
      </Routes>
    </>
  );
}

export default App;
