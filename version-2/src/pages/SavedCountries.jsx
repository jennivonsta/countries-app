

// useState lets us store form input values in state
import { useState } from "react";

// SavedCountries page
// It receives countriesData from App.jsx (Version 1 requirement),
// even if we don't use it much yet.
function SavedCountries({ countriesData }) {
  // State variables for each form field
  const [name, setName] = useState(""); // stores the user's name
  const [email, setEmail] = useState(""); // stores the user's email
  const [country, setCountry] = useState(""); // stores the user's selected country
  const [bio, setBio] = useState(""); // stores the user's bio text

  // This function runs when the form is submitted
  function handleSubmit(event) {
    // Prevents the page from refreshing (default form behavior)
    event.preventDefault();

    // Put the user's form info into one object
    const profileData = {
      name,
      email,
      country,
      bio,
    };

    // For now we just log the data to prove the form works
    // (SInce Saving to a database is NOT required here)
    console.log("Submitted Profile:", profileData);

    // Optional: clear the form after submit
    setName("");
    setEmail("");
    setCountry("");
    setBio("");
  }

  return (
    <main className="page">
      {/* Page title */}
      <h1>My Saved Countries</h1>

      {/* Section title like in the designs */}
      <h2>My Profile</h2>

      {/* Form starts here */}
      <form className="profile-form" onSubmit={handleSubmit}>
        {/* NAME FIELD */}
        <label className="profile-form__label">
          Name
          <input
            className="profile-form__input"
            type="text"
            value={name} // input shows whatever is in state
            onChange={(e) => setName(e.target.value)} // update state as user types
            placeholder="Enter your name"
            required
          />
        </label>

        {/* EMAIL FIELD */}
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

        {/* COUNTRY FIELD */}
        {/* This is a simple text input that matches the assignment requirement.
            can turn it into a dropdown using countriesData later. */}
        <label className="profile-form__label">
          Country
          <input
            className="profile-form__input"
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Enter your country"
            required
          />
        </label>

        {/* BIO FIELD */}
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

        {/* SUBMIT BUTTON */}
        <button className="profile-form__button" type="submit">
          Submit Profile
        </button>
      </form>
    </main>
  );
}

export default SavedCountries;
