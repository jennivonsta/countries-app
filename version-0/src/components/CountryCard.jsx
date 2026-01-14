// CountryCard is a reusable component.
// It receives a single country object as a prop.
function CountryCard({ country }) {
  return (
    // <article> is a semantic HTML element used for standalone content
    <article className="country-card">
      
      {/* 
        Display the country flag.
        - src comes from the country data
        - alt text uses the country's common name for accessibility
      */}
      <img
        className="country-card__flag"
        src={country.flags.png}
        alt={country.name.common}
      />

      {/* Wrapper for the text content of the card */}
      <div className="country-card__body">
        
        {/* Display the country's common name */}
        <h2 className="country-card__name">
          {country.name.common}
        </h2>

        {/* 
          Display the population.
          toLocaleString() formats the number with commas
          so it’s easier to read.
        */}
        <p className="country-card__meta">
          <strong>Population:</strong>{" "}
          {country.population.toLocaleString()}
        </p>

        {/* Display the region (e.g., Europe, Asia, Africa) */}
        <p className="country-card__meta">
          <strong>Region:</strong> {country.region}
        </p>

        {/* 
          Display the capital.
          capital is an array, so we access the first value.
          Optional chaining (?.) prevents errors if capital is missing.
          If there is no capital, we display "N/A".
        */}
        <p className="country-card__meta">
          <strong>Capital:</strong>{" "}
          {country.capital?.[0] || "N/A"}
        </p>
      </div>
    </article>
  );
}

// Export the component so it can be used in Home.jsx
export default CountryCard;
