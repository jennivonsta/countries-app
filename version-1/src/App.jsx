// version-1/src/App.jsx

// Import React hooks:
// useState lets us store data in component state (countries list)
// useEffect lets us run code when the component loads (fetch countries on page load)
import { useEffect, useState } from "react";

// Import React Router pieces:
// Routes/Route define which component shows for each URL path
// Link creates clickable navigation without reloading the page
import { Routes, Route, Link } from "react-router-dom";

// Import the 3 page components used in our routes
import Home from "./pages/Home";
import SavedCountries from "./pages/SavedCountries";
import CountryDetail from "./pages/CountryDetail";

// Import backup data from localData.js (used if the API fails)
// NOTE: localData.js is in the project root, so from src/App.jsx we go up one folder: ../localData
import localData from "../localData";

// Main App component
function App() {
  // Create a state variable called "countries"
  // countries starts as an empty array []
  // setCountries is the function we use to update it
  const [countries, setCountries] = useState([]);

  // useEffect runs once when the App component first loads
  // (because the dependency array is empty)
  useEffect(() => {
    // Define an async function inside useEffect so we can use await
    async function fetchCountries() {
      try {
        // Make a request to the REST Countries API using the required URL/fields
        // This returns an array of country objects with fields like:
        // name, flags, population, capital, region, cca3, borders
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,flags,population,capital,region,cca3,borders"
        );

        // If response is not "ok" (ex: 404, 500),
        // throw an error so we jump to the catch block
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        // Convert the response body into JavaScript data (JSON)
        const data = await response.json();

        // Save the API data into state
        // This triggers a re-render and pages/components will receive the new countries array
        setCountries(data);
      } catch (error) {
        // If fetch fails (network down, API down, bad response, etc.),
        // log the error for debugging
        console.error("API failed, using local data instead:", error);

        // Use localData as a backup so the app still works
        setCountries(localData);
      }
    }

    // Call the function so the fetch actually happens
    fetchCountries();
  }, []); // Empty array means: run only once on initial load

  // Render the app UI
  return (
    <>
      {/* Header appears on every page */}
      <header className="header">
        {/* Clicking this takes you to the Home page ("/") without refreshing */}
        <Link className="header__title" to="/">
          Where in the world?
        </Link>

        {/* Clicking this takes you to the Saved Countries page ("/saved") */}
        <Link className="header__link" to="/saved">
          Saved Countries
        </Link>
      </header>

      {/* Routes decide which page component shows depending on the URL */}
      <Routes>
        {/* Home page route */}
        {/* We pass the countries array down as a prop called countriesData */}
        <Route path="/" element={<Home countriesData={countries} />} />

        {/* Saved Countries page route */}
        {/* Also receives the countries data (required by the instructions) */}
        <Route
          path="/saved"
          element={<SavedCountries countriesData={countries} />}
        />

        {/* Country Detail page route with a dynamic URL parameter */}
        {/* Example URL: /country/USA or /country/FRA */}
        {/* The ":name" part is a route parameter read using useParams() in CountryDetail.jsx */}
        <Route
           path="/country-detail/:countryName"
          element={<CountryDetail countriesData={countries} />}
        />
      </Routes>
    </>
  );
}

// Export App so it can be imported and rendered by main.jsx
export default App;
