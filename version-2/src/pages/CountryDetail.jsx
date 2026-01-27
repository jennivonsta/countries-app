import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

function CountryDetail({ countriesData, savedCountryNames, toggleSaveCountryByName }) {
  const navigate = useNavigate();
  const { countryName } = useParams();

  const decodedCountryName = useMemo(() => {
    return decodeURIComponent(countryName || "");
  }, [countryName]);

  const country = useMemo(() => {
    return countriesData.find((c) => c.name.common === decodedCountryName);
  }, [countriesData, decodedCountryName]);

  // ----------------------------
  // VIEW COUNT (Version 2 requirement)
  // ----------------------------
  const [viewCount, setViewCount] = useState(null);
  const [countError, setCountError] = useState("");

  useEffect(() => {
    if (!country) return;

    async function updateViewCount() {
      try {
        setCountError("");

        const res = await fetch("/api/update-one-country-count", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country_name: country.name.common }),
        });

        if (!res.ok) throw new Error(`View count failed: ${res.status}`);

        const data = await res.json();
        setViewCount(data.count);
      } catch (err) {
        console.error(err);
        setCountError("Could not load view count.");
      }
    }

    updateViewCount();
  }, [country]);

  if (!country) {
    return <p className="page">Loading country details...</p>;
  }

  const isSaved = savedCountryNames.includes(country.name.common);

  const borderCountries = (country.borders || [])
    .map((code) => countriesData.find((c) => c.cca3 === code))
    .filter(Boolean);

  return (
    <main className="page">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <section className="detail">
        <img className="detail__flag" src={country.flags.png} alt={country.name.common} />

        <div className="detail__info">
          <h1 className="detail__name">{country.name.common}</h1>

          {/* Save button calls backend toggle */}
          <button
            className="save-button"
            onClick={() => toggleSaveCountryByName(country.name.common)}
          >
            {isSaved ? "Saved" : "Save"}
          </button>

          <p className="detail__meta">
            <strong>Population:</strong> {country.population.toLocaleString()}
          </p>
          <p className="detail__meta">
            <strong>Region:</strong> {country.region}
          </p>
          <p className="detail__meta">
            <strong>Capital:</strong> {country.capital?.[0] || "N/A"}
          </p>

          <p className="detail__meta">
            <strong>Viewed:</strong>{" "}
            {countError ? countError : viewCount === null ? "Loading..." : `${viewCount} times`}
          </p>

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
