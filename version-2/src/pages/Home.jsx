// version-1/src/pages/Home.jsx

// useState stores the user's search text + selected region
import { useState } from "react";

// CountryCard shows one country card
import CountryCard from "../components/CountryCard";

function Home({ countriesData }) {
  // State for the search input (example: "canada")
  const [searchTerm, setSearchTerm] = useState("");

  // State for the region dropdown (example: "Europe")
  // Empty string means "no filter" (show all regions)
  const [selectedRegion, setSelectedRegion] = useState("");

  // If data hasn't loaded yet, show a loading message
  if (!countriesData || countriesData.length === 0) {
    return <p className="page">Loading countries...</p>;
  }

  // Filter the countries based on:
  // 1) searchTerm (matches country name)
  // 2) selectedRegion (matches region)
  const filteredCountries = countriesData.filter((country) => {
    // Convert both to lowercase so search isn't case-sensitive
    const matchesSearch = country.name.common
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // If no region is selected, this should be true for all countries
    const matchesRegion =
      selectedRegion === "" || country.region === selectedRegion;

    // Country must match BOTH conditions to show
    return matchesSearch && matchesRegion;
  });

  return (
    <main className="home">
      {/* Top controls row: search input + region dropdown */}
      <section className="controls">
        {/* Search input */}
        <input
          className="controls__search"
          type="text"
          placeholder="Search for a country..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Region dropdown */}
        <select
          className="controls__filter"
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
        >
          {/* Empty value = show all */}
          <option value="">Filter by Region</option>
          <option value="Africa">Africa</option>
          <option value="Americas">Americas</option>
          <option value="Antarctic">Antarctic</option>
          <option value="Asia">Asia</option>
          <option value="Europe">Europe</option>
          <option value="Oceania">Oceania</option>
        </select>
      </section>

      {/* Grid of country cards */}
      <section className="countries-grid">
        {filteredCountries.map((country) => (
          <CountryCard key={country.cca3} country={country} />
        ))}
      </section>
    </main>
  );
}

export default Home;
