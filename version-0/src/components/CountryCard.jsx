function CountryCard({ country }) {
    return (
      <article className="country-card">
        <img
          className="country-card__flag"
          src={country.flags.png}
          alt={country.name.common}
        />
  
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
    );
  }
  
  export default CountryCard;
  