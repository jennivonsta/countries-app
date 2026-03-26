// version-1/src/components/CountryCard.jsx

import { Link } from "react-router-dom";

function CountryCard({ country }) {
  // Whole card is clickable and navigates to the detail page
  // This must match App.jsx route: /country-detail/:countryName
  return (
    <Link to={`/country-detail/${country.name.common}`}>
      <article className="country-card">
        {/* Flag image */}
        <img
          className="country-card__flag"
          src={country.flags.png}
          alt={country.name.common}
        />

        {/* Text info */}
        <div className="country-card__body">
          <h2 className="country-card__name">{country.name.common}</h2>

          <p className="country-card__meta">
            <strong>Population:</strong> {country.population.toLocaleString()}
          </p>

          <p className="country-card__meta">
            <strong>Region:</strong> {country.region}
          </p>

          <p className="country-card__meta">
            <strong>Capital:</strong> {country.capital?.[0] || "N/A"}
          </p>
        </div>
      </article>
    </Link>
  );
}

export default CountryCard;
