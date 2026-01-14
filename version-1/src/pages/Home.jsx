

// Import the CountryCard component that displays each country
import CountryCard from "../components/CountryCard";

// Home component receives countriesData as a prop from App.jsx
function Home({ countriesData }) {
  // If the countries array is empty, it usually means:
  // - the API is still loading, or
  // - there was an error and data hasn't been set yet
  // This prevents errors from trying to map over undefined
  if (!countriesData || countriesData.length === 0) {
    return <p>Loading countries...</p>;
  }

  return (
    <main className="home">
      {/* Container that holds all country cards */}
      <section className="countries-grid">
        {/* Loop over the countriesData array */}
        {/* For each country, render one CountryCard */}
        {countriesData.map((country) => (
          <CountryCard
            key={country.cca3} // Unique key required by React
            country={country} // Pass the full country object to CountryCard
          />
        ))}
      </section>
    </main>
  );
}

// Export Home so it can be used in App.jsx routes
export default Home;
