import { useMemo, useState } from "react";
import CountryCard from "../components/CountryCard";

function Home({ countriesData }) {
  const [searchText, setSearchText] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");

  // Build region options from the data (Africa, Americas, Asia, Europe, Oceania, etc.)
  const regionOptions = useMemo(() => {
    const regions = new Set();

    countriesData.forEach((country) => {
      if (country.region) regions.add(country.region);
    });

    return Array.from(regions).sort();
  }, [countriesData]);

  // Filter countries by search + region
  const filteredCountries = useMemo(() => {
    const search = searchText.trim().toLowerCase();

    return countriesData.filter((country) => {
      const name = country.name?.common?.toLowerCase() || "";
      const matchesSearch = search === "" ? true : name.includes(search);

      const matchesRegion =
        selectedRegion === "" ? true : country.region === selectedRegion;

      return matchesSearch && matchesRegion;
    });
  }, [countriesData, searchText, selectedRegion]);

  return (
    <main className="home">
      {/* Controls row */}
      <section className="controls">
        <input
          className="controls__search"
          type="text"
          placeholder="Search for a country..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <select
          className="controls__select"
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
        >
          <option value="">Filter by Region</option>
          {regionOptions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
      </section>

      {/* Cards */}
      <div className="countries-grid">
        {filteredCountries.map((country) => (
          <CountryCard key={country.cca3} country={country} />
        ))}
      </div>
    </main>
  );
}

export default Home;

