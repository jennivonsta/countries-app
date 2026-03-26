// version-1/src/pages/SavedCountries.jsx

import { useState } from "react";
import { Link } from "react-router-dom";

function SavedCountries({ countriesData, savedCountryCodes, toggleSaveCountry }) {
  // Profile form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [bio, setBio] = useState("");

  // When user submits the profile form
  function handleSubmit(e) {
    e.preventDefault();

    const profileData = { name, email, country, bio };
    console.log("Submitted Profile:", profileData);

    // Clear inputs after submit
    setName("");
    setEmail("");
    setCountry("");
    setBio("");
  }

  // Convert saved cca3 codes into full country objects
  const savedCountries = savedCountryCodes
    .map((code) => countriesData.find((c) => c.cca3 === code))
    .filter(Boolean);

  return (
    <main className="page">
      <h1>Saved Countries</h1>

      <h2>My Profile</h2>

      <form className="profile-form" onSubmit={handleSubmit}>
        <label className="profile-form__label">
          Name
          <input
            className="profile-form__input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
          />
        </label>

        <label className="profile-form__label">
          Email
          <input
            className="profile-form__input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </label>

        <label className="profile-form__label">
          Country
          <input
            className="profile-form__input"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Enter your country"
            required
          />
        </label>

        <label className="profile-form__label">
          Bio
          <textarea
            className="profile-form__textarea"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about yourself"
            rows={4}
          />
        </label>

        <button className="profile-form__button" type="submit">
          Submit Profile
        </button>
      </form>

      <hr style={{ margin: "40px 0" }} />

      <h2>My Saved Countries</h2>

      {savedCountries.length === 0 ? (
        <p>No saved countries yet. Go save some!</p>
      ) : (
        <div className="saved-grid">
          {savedCountries.map((c) => (
            <div className="saved-card" key={c.cca3}>
              <img
                className="saved-card__flag"
                src={c.flags.png}
                alt={c.name.common}
              />

              <div className="saved-card__body">
                <Link to={`/country-detail/${c.name.common}`}>
                  <h3 className="saved-card__name">{c.name.common}</h3>
                </Link>

                <button
                  className="saved-card__button"
                  onClick={() => toggleSaveCountry(c.cca3)}
                >
                  Unsave
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default SavedCountries;
