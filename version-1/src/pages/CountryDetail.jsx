
// useParams lets us read values from the URL
// Example URL: /country-detail/France
import { useParams } from "react-router-dom";

// CountryDetail receives countriesData as a prop from App.jsx
function CountryDetail({ countriesData }) {
  // useParams returns an object with all route parameters
  // Because our route is "/country-detail/:countryName",
  // we can access the value using .countryName
  const { countryName } = useParams();

  // Log the country name from the URL for debugging
  console.log("Country from URL:", countryName);

  // Find the matching country object from the countriesData array
  // We compare the name from the URL to each country's common name
  const country = countriesData.find(
    (c) => c.name.common === countryName
  );

  // If the country is not found yet (API still loading),
  // show a loading message instead of crashing the app
  if (!country) {
    return <p>Loading country details...</p>;
  }

  return (
    <main className="page">
      {/* Page title */}
      <h1>{country.name.common}</h1>

      {/* Country flag */}
      <img
        src={country.flags.png}
        alt={country.name.common}
        style={{ maxWidth: "300px" }}
      />

      {/* Country details */}
      <p>
        <strong>Population:</strong>{" "}
        {country.population.toLocaleString()}
      </p>

      <p>
        <strong>Region:</strong> {country.region}
      </p>

      <p>
        <strong>Capital:</strong>{" "}
        {country.capital?.[0] || "N/A"}
      </p>
    </main>
  );
}

// Export the component so it can be used in App.jsx routes
export default CountryDetail;
