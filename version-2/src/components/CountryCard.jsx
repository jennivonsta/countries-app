import { Link } from "react-router-dom";

// CountryCard receives ONE country object from Home.jsx
function CountryCard({ country }) {
  // Helpful for debugging: lets you see the country data coming in
  console.log(country);

  return (
    // Link makes the whole card clickable
    // This sends the user to the CountryDetail route
    // IMPORTANT: This URL must match the route path in App.jsx:
    // "/country-detail/:countryName"
    <Link to={`/country-detail/${country.name.common}`}>
      <article className="country-card">
        {/* Flag image */}
        <img
          className="country-card__flag"
          src={country.flags.png} // flag image URL from API
          alt={country.name.common} // alt text for accessibility
        />

        <div className="country-card__body">
          {/* Country name */}
          <h2 className="country-card__name">{country.name.common}</h2>

          {/* Population */}
          {/* toLocaleString adds commas like 1,234,567 */}
          <p className="country-card__meta">
            <strong>Population:</strong> {country.population.toLocaleString()}
          </p>

          {/* Region */}
          <p className="country-card__meta">
            <strong>Region:</strong> {country.region}
          </p>

          {/* Capital */}
          {/* Many countries have capital as an array, or it might be missing */}
          <p className="country-card__meta">
            <strong>Capital:</strong> {country.capital?.[0] || "N/A"}
          </p>
        </div>
      </article>
    </Link>
  );
}

export default CountryCard;
