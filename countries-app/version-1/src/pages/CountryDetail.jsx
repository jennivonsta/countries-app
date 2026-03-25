// version-1/src/pages/CountryDetail.jsx

// Import hooks and components from React Router
// useParams lets us read the country name from the URL
// useNavigate lets us go back to the previous page
// Link lets us navigate without refreshing the page
import { useParams, useNavigate, Link } from "react-router-dom";

// CountryDetail receives data + save helpers from App.jsx
function CountryDetail({ countriesData, savedCountryCodes, toggleSaveCountry }) {
  // useNavigate allows us to go back one page
  const navigate = useNavigate();

  // Read the country name from the URL
  // Example URL: /country-detail/Belgium
  const { countryName } = useParams();

  // Find the country object that matches the name from the URL
  const country = countriesData.find(
    (c) => c.name.common === countryName
  );

  // If the data has not loaded yet, show a loading message
  if (!country) {
    return <p className="page">Loading country details...</p>;
  }

  // Check if THIS country is already saved
  const isSaved = savedCountryCodes.includes(country.cca3);

  // Convert border country codes (cca3) into full country objects
  // We filter out anything undefined just to be safe
  const borderCountries = (country.borders || [])
    .map((code) => countriesData.find((c) => c.cca3 === code))
    .filter(Boolean);

  return (
    <main className="page">
      {/* Back button – takes the user to the previous page */}
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back
      </button>

      {/* Main layout container */}
      <section className="detail">
        {/* Country flag */}
        <img
          className="detail__flag"
          src={country.flags.png}
          alt={country.name.common}
        />

        {/* Right side: country information */}
        <div className="detail__info">
          {/* Country name */}
          <h1 className="detail__name">{country.name.common}</h1>

          {/* Save button for THIS country only */}
          <button
            className="save-button"
            onClick={() => toggleSaveCountry(country.cca3)}
          >
            {isSaved ? "Saved" : "Save"}
          </button>

          {/* Country details */}
          <p className="detail__meta">
            <strong>Population:</strong>{" "}
            {country.population.toLocaleString()}
          </p>

          <p className="detail__meta">
            <strong>Region:</strong> {country.region}
          </p>

          <p className="detail__meta">
            <strong>Capital:</strong>{" "}
            {country.capital?.[0] || "N/A"}
          </p>

          {/* Border countries section */}
          <div className="borders">
            <strong>Border Countries:</strong>

            <div className="borders__list">
              {/* If there are no bordering countries */}
              {borderCountries.length === 0 ? (
                <p className="detail__meta">None</p>
              ) : (
                // Otherwise, display each border country as a link
                borderCountries.map((borderCountry) => (
                  <Link
                    key={borderCountry.cca3}
                    className="border-pill"
                    to={`/country-detail/${borderCountry.name.common}`}
                  >
                    {borderCountry.name.common}
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

// Export the component so it can be used in App.jsx
export default CountryDetail;
