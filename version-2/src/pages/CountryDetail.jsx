import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

/*
  CountryDetail page responsibilities (Version 2 Milestone):
  1) When the page loads, send a POST request to increment view count (+1)
  2) Show the returned view count on the page ("Viewed: X times")
*/
function CountryDetail({
  countriesData,
  savedCountryNames,
  toggleSaveCountryByName,
}) {
  // useNavigate lets us go back to the previous page
  const navigate = useNavigate();

  // Read the countryName from the URL
  // Example: /country-detail/Belgium
  const { countryName } = useParams();

  // decodeURIComponent converts URL text back to normal text (handles spaces, etc.)
  const decodedCountryName = useMemo(() => {
    return decodeURIComponent(countryName || "");
  }, [countryName]);

  // Find the full country object from our countriesData list
  const country = useMemo(() => {
    return countriesData.find((c) => c.name.common === decodedCountryName);
  }, [countriesData, decodedCountryName]);

  // ----------------------------
  // VIEW COUNT STATE
  // ----------------------------
  // viewCount = number returned from backend
  const [viewCount, setViewCount] = useState(null);

  // countError = if something goes wrong, we can show a friendly message
  const [countError, setCountError] = useState("");

  // ----------------------------
  // INCREMENT + FETCH VIEW COUNT (Milestone requirement)
  // ----------------------------
  useEffect(() => {
    // Don't run until we actually have the country object
    if (!country) return;

    async function incrementAndFetchCount() {
      try {
        setCountError("");

        // POST request to backend:
        // This endpoint increments the count by 1 AND returns the updated count
        const res = await fetch("/api/update-one-country-count", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country_name: country.name.common }),
        });

        if (!res.ok) {
          throw new Error(`Count POST failed: ${res.status}`);
        }

        // Backend returns JSON like: { count: 20 }
        const data = await res.json();

        // Save count into state so the UI updates
        setViewCount(data.count);
      } catch (err) {
        console.error(err);
        setCountError("Could not load view count.");
      }
    }

    // Run when the page loads for this country (and when country changes)
    incrementAndFetchCount();
  }, [country]);

  // If we haven’t found the country yet, show a loading message
  if (!country) {
    return <p className="page">Loading country details...</p>;
  }

  // Check if this country is already saved (by NAME)
  const isSaved = savedCountryNames.includes(country.name.common);

  // Convert border country codes into full country objects
  const borderCountries = (country.borders || [])
    .map((code) => countriesData.find((c) => c.cca3 === code))
    .filter(Boolean);

  return (
    <main className="page">
      {/* Back button – takes the user to the previous page */}
      <button className="back-button" onClick={() => navigate(-1)}>
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
          <h1 className="detail__name">{country.name.common}</h1>

          {/* Save button (backend save/unsave handled in App.jsx) */}
          <button
            className="save-button"
            onClick={() => toggleSaveCountryByName(country.name.common)}
          >
            {isSaved ? "Saved" : "Save"}
          </button>

          {/* Country details */}
          <p className="detail__meta">
            <strong>Population:</strong> {country.population.toLocaleString()}
          </p>

          <p className="detail__meta">
            <strong>Region:</strong> {country.region}
          </p>

          <p className="detail__meta">
            <strong>Capital:</strong> {country.capital?.[0] || "N/A"}
          </p>

          {/*  View Count display (Milestone requirement) */}
          <p className="detail__meta">
            <strong>Viewed:</strong>{" "}
            {countError
              ? countError
              : viewCount === null
              ? "Loading..."
              : `${viewCount} times`}
          </p>

          {/* Border countries */}
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
                    to={`/country-detail/${encodeURIComponent(b.name.common)}`}
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

export default CountryDetail;
