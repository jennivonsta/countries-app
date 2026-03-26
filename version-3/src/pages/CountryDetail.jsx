// React hooks:
// useState  -> store local component state (view count, errors)
// useEffect -> run side effects (API calls when page loads)
// useMemo   -> memoize derived values (decoded URL, selected country)
import { useEffect, useMemo, useState } from "react";

// React Router tools:
// useParams   -> read dynamic URL values
// useNavigate -> programmatic navigation (back button)
// Link        -> client-side navigation without page reload
import { useParams, useNavigate, Link } from "react-router-dom";

/*
  CountryDetail responsibilities for Version 2:
  1) Display detailed information for a single country
  2) Increment and display the country view count using the backend
  3) Allow the user to save or unsave a country
  4) Allow navigation to bordering countries
*/
function CountryDetail({
  countriesData,
  savedCountryNames,
  toggleSaveCountryByName,
}) {
  // useNavigate allows us to go back to the previous page
  const navigate = useNavigate();

  // Read the country name from the URL
  // Example URL: /country-detail/United%20States%20of%20America
  const { countryName } = useParams();

  // Decode the URL-encoded country name so it matches our data
  const decodedCountryName = useMemo(() => {
    return decodeURIComponent(countryName || "");
  }, [countryName]);

  // Find the matching country object from the countries data
  const country = useMemo(() => {
    return countriesData.find(
      (c) => c.name.common === decodedCountryName
    );
  }, [countriesData, decodedCountryName]);

  // ----------------------------
  // VIEW COUNT STATE
  // ----------------------------
  // viewCount stores the number returned from the backend
  const [viewCount, setViewCount] = useState(null);

  // countError stores any error related to fetching the view count
  const [countError, setCountError] = useState("");

  // ----------------------------
  // INCREMENT + FETCH VIEW COUNT
  // ----------------------------
  /*
    When the Country Detail page loads:
    - Send a POST request to the backend
    - The backend increments the count by +1
    - The backend returns the updated count
    - We store that count in state and display it
  */
  useEffect(() => {
    // Do nothing until the country data is available
    if (!country) return;

    async function incrementAndFetchCount() {
      try {
        // Clear any previous error
        setCountError("");

        // POST request to backend
        const res = await fetch("/api/update-one-country-count", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            country_name: country.name.common,
          }),
        });

        // If backend responds with an error status, throw
        if (!res.ok) {
          throw new Error(`Count POST failed: ${res.status}`);
        }

        // Backend returns JSON: { count: number }
        const data = await res.json();

        // Save count into state so the UI updates
        setViewCount(data.count);
      } catch (err) {
        console.error(err);
        setCountError("Could not load view count.");
      }
    }

    // Run when the page loads or when the country changes
    incrementAndFetchCount();
  }, [country]);

  // If country data has not loaded yet, show a loading message
  if (!country) {
    return <p className="page">Loading country details...</p>;
  }

  // Check if this country is already saved (by name)
  const isSaved = savedCountryNames.includes(country.name.common);

  // Convert border country codes (cca3) into full country objects
  const borderCountries = (country.borders || [])
    .map((code) =>
      countriesData.find((c) => c.cca3 === code)
    )
    .filter(Boolean);

  // ----------------------------
  // RENDER
  // ----------------------------
  return (
    <main className="page">
      {/* Back button navigates to the previous page */}
      <button
        className="back-button"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <section className="detail">
        {/* Country flag */}
        <img
          className="detail__flag"
          src={country.flags.png}
          alt={country.name.common}
        />

        <div className="detail__info">
          {/* Country name */}
          <h1 className="detail__name">
            {country.name.common}
          </h1>

          {/* Save / Unsave button */}
          <button
            className="save-button"
            onClick={() =>
              toggleSaveCountryByName(country.name.common)
            }
          >
            {isSaved ? "Unsave" : "Save"}
          </button>

          {/* Country metadata */}
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

          {/* View count display (Version 2 milestone requirement) */}
          <p className="detail__meta">
            <strong>Viewed:</strong>{" "}
            {countError
              ? countError
              : viewCount === null
              ? "Loading..."
              : `${viewCount} times`}
          </p>

          {/* Border countries navigation */}
          <div className="borders">
            <strong>Border Countries:</strong>

            <div className="borders__list">
              {borderCountries.length === 0 ? (
                <p className="detail__meta">None</p>
              ) : (
                borderCountries.map((b) => (
                  <Link
                    key={b.cca3}
                    className="border-pill"
                    to={`/country-detail/${encodeURIComponent(
                      b.name.common
                    )}`}
                  >
                    {b.name.common}
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

// Export so App.jsx can render this route
export default CountryDetail;
