//Same as Version 1

import { useState } from "react";
import CountryCard from "../components/CountryCard";

function Home({ countriesData }) {
  // Search text state
  const [searchTerm, setSearchTerm] = useState("");

  // Region dropdown state ("" means no region filter)
  const [selectedRegion, setSelectedRegion] = useState("");

  // If data hasn't loaded yet, show a loading message
  if (!countriesData || countriesData.length === 0) {
    return <p className="page">Loading countries...</p>;
  }

  // Filter countries based on search + region
  const filteredCountries = countriesData.filter((country) => {
    const matchesSearch = country.name.common
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesRegion =
      selectedRegion === "" || country.region === selectedRegion;

    return matchesSearch && matchesRegion;
  });

  return (
    <main className="home">
      {/* Top controls row */}
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
          <option value="">Filter by Region</option>
          <option value="Africa">Africa</option>
          <option value="Americas">Americas</option>
          <option value="Antarctic">Antarctic</option>
          <option value="Asia">Asia</option>
          <option value="Europe">Europe</option>
          <option value="Oceania">Oceania</option>
        </select>
      </section>

      {/* Grid of cards */}
      <section className="countries-grid">
        {filteredCountries.map((country) => (
          <CountryCard key={country.cca3} country={country} />
        ))}
      </section>
    </main>
  );
}

export default Home;
