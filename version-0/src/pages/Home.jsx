// Import React hooks from React
// useState lets us store and update values while the app is running
// useMemo lets us calculate values once and reuse them unless something changes
import { useMemo, useState } from "react";

// Import the CountryCard component
// This component is used to display one country at a time
import CountryCard from "../components/CountryCard";

// Home is a React component
// It receives countriesData as a prop from App.jsx
function Home({ countriesData }) {

  // searchText stores what the user types into the search input
  // setSearchText is the function that updates searchText
  // We start with an empty string because nothing is typed yet
  const [searchText, setSearchText] = useState("");

  // selectedRegion stores which region the user selected from the dropdown
  // setSelectedRegion updates that value
  // We start with an empty string meaning "no region selected"
  const [selectedRegion, setSelectedRegion] = useState("");

  /*
    regionOptions is a derived value.
    We build it from the countriesData instead of hard-coding regions.
    This way, if the data changes, the dropdown updates automatically.

    useMemo tells React:
    "Only re-run this code if countriesData changes."
  */
  const regionOptions = useMemo(() => {

    // Create a Set to store regions
    // A Set automatically removes duplicates
    const regions = new Set();

    // Loop through every country in the data
    countriesData.forEach((country) => {

      // Check if the country has a region value
      // This prevents errors if region is missing
      if (country.region) {

        // Add the region to the Set
        regions.add(country.region);
      }
    });

    // Convert the Set into an array
    // Sort it alphabetically so the dropdown looks clean
    return Array.from(regions).sort();

  }, [countriesData]); // This runs again ONLY if countriesData changes

  /*
    filteredCountries is another derived value.
    This creates a new list of countries based on:
    1. What the user typed in the search bar
    2. Which region the user selected

    useMemo avoids recalculating this on every render unless
    searchText, selectedRegion, or countriesData changes.
  */
  const filteredCountries = useMemo(() => {

    // Trim removes extra spaces
    // toLowerCase makes the search case-insensitive
    const search = searchText.trim().toLowerCase();

    // Filter the original countriesData array
    return countriesData.filter((country) => {

      // Safely access the country's common name
      // Optional chaining (?.) prevents crashes if data is missing
      // If name is missing, fall back to an empty string
      const name = country.name?.common?.toLowerCase() || "";

      // If the search box is empty, this condition passes automatically
      // Otherwise, check if the country name includes the search text
      const matchesSearch =
        search === "" ? true : name.includes(search);

      // If no region is selected, all regions match
      // Otherwise, only match countries in the selected region
      const matchesRegion =
        selectedRegion === ""
          ? true
          : country.region === selectedRegion;

      // Only keep countries that match BOTH conditions
      return matchesSearch && matchesRegion;
    });

  }, [countriesData, searchText, selectedRegion]);

  return (
    // Main container for the Home page content
    <main className="home">

      {/* 
        Controls section contains:
        - The search input
        - The region filter dropdown
      */}
      <section className="controls">

        {/* 
          Search input field
          - value is controlled by searchText state
          - onChange updates searchText as the user types
        */}
        <input
          className="controls__search"
          type="text"
          placeholder="Search for a country..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        {/* 
          Dropdown for filtering by region
          - value is controlled by selectedRegion state
          - onChange updates selectedRegion when user selects an option
        */}
        <select
          className="controls__select"
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
        >
          {/* Default option (no filter applied) */}
          <option value="">Filter by Region</option>

          {/* 
            Looporing over regionOptions array
            Each region becomes one <option> in the dropdown
          */}
          {regionOptions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
      </section>

      {/* 
        Grid container for country cards
        We loop over filteredCountries instead of the full list
      */}
      <div className="countries-grid">
        {filteredCountries.map((country) => (
          // Render one CountryCard per country
          // key helps React efficiently update the list
          <CountryCard
            key={country.cca3}
            country={country}
          />
        ))}
      </div>
    </main>
  );
}

// Export Home so it can be used in App.jsx routing
export default Home;
