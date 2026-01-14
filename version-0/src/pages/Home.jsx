// Import React hooks:
// - useState: to store user input (search text and selected region)
// - useMemo: to compute derived data efficiently
import { useMemo, useState } from "react";

// Import the reusable CountryCard component
import CountryCard from "../components/CountryCard";

// Home receives countriesData as a prop from App.jsx
function Home({ countriesData }) {
  // State for the search input
  const [searchText, setSearchText] = useState("");

  // State for the selected region from the dropdown
  const [selectedRegion, setSelectedRegion] = useState("");

  /*
    Build the list of region options dynamically from the data.
    useMemo ensures this only recalculates when countriesData changes.
  */
  const regionOptions = useMemo(() => {
    const regions = new Set(); // Set ensures no duplicate regions

    countriesData.forEach((country) => {
      if (country.region) {
        regions.add(country.region);
      }
    });

    // Convert Set to array and sort alphabetically
    return Array.from(regions).sort();
  }, [countriesData]);

  /*
    Filter countries based on:
    1. Search text
    2. Selected region

    useMemo prevents unnecessary recalculations unless dependencies change.
  */
  const filteredCountries = useMemo(() => {
    // Normalize search text for case-insensitive matching
    const search = searchText.trim().toLowerCase();

    return countriesData.filter((country) => {
      // Safely access the country's common name
      const name = country.name?.common?.toLowerCase() || "";

      // If search is empty, all countries match
      const matchesSearch =
        search === "" ? true : name.includes(search);

      // If no region selected, all regions match
      const matchesRegion =
        selectedRegion === ""
          ? true
          : country.region === selectedRegion;

      // Country must match BOTH conditions
      return matchesSearch && matchesRegion;
    });
  }, [countriesData, searchText, selectedRegion]);

  return (
    // Main container for the Home page
    <main className="home">
      
      {/* Search + Filter controls */}
      <section className="controls">
        
        {/* Search input */}
        <input
          className="controls__search"
          type="text"
          placeholder="Search for a country..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        {/* Region dropdown */}
        <select
          className="controls__select"
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
        >
          <option value="">Filter by Region</option>

          {/* Render region options dynamically */}
          {regionOptions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
      </section>

      {/* Countries grid */}
      <div className="countries-grid">
        {filteredCountries.map((country) => (
          <CountryCard
            key={country.cca3}
            country={country}
          />
        ))}
      </div>
    </main>
  );
}

// Export Home so it can be used in App.jsx
export default Home;
