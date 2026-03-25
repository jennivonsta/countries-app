// React hooks:
// useState  -> stores values that can change (form inputs, newest user, error messages)
// useEffect -> runs code at specific times (example: when the page loads)
// useMemo   -> calculates derived data efficiently
import { useEffect, useMemo, useState } from "react";

// Link allows navigation without refreshing the page
import { Link } from "react-router-dom";

function SavedCountries({
  countriesData,
  savedCountryNames,
  toggleSaveCountryByName,
  refreshSavedCountries,
}) {
  // ----------------------------
  // PROFILE FORM STATE
  // ----------------------------
  // Each input uses state so React controls its value
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [countryName, setCountryName] = useState("");
  const [bio, setBio] = useState("");

  // Stores the newest user returned from the backend
  const [newestUser, setNewestUser] = useState(null);

  // Stores any error message for the page
  const [userError, setUserError] = useState("");

  // ----------------------------
  // GET newest user (GET request)
  // ----------------------------
  // Fetches the most recently added user from the backend
  async function fetchNewestUser() {
    try {
      setUserError("");

      const res = await fetch("/api/get-newest-user");
      if (!res.ok) {
        throw new Error(`Failed newest user GET: ${res.status}`);
      }

      const data = await res.json();

      // Backend may return an object or an array
      const user = Array.isArray(data) ? data[0] : data;

      // If no user exists, keep state as null
      if (!user || !user.name) {
        setNewestUser(null);
        return;
      }

      // Save newest user so the UI can display it
      setNewestUser(user);

      // Fill form fields with newest user data
      setName(user.name || "");
      setEmail(user.email || "");
      setCountryName(user.country_name || "");
      setBio(user.bio || "");
    } catch (err) {
      console.error(err);
      setUserError("Could not load user info.");
    }
  }

  // Runs once when the page first loads
  useEffect(() => {
    fetchNewestUser();
  }, []);

  // ----------------------------
  // POST user on submit (POST request)
  // ----------------------------
  // Runs when the profile form is submitted
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setUserError("");

      // Data sent to the backend
      const body = {
        name,
        email,
        country_name: countryName,
        bio,
      };

      // POST request: sends form data to backend to store a new user
      const res = await fetch("/api/add-one-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error(`Add user failed: ${res.status}`);
      }

      // Backend returns plain text
      await res.text();

      // Refresh newest user after successful POST
      await fetchNewestUser();

      // Clear the form fields
      setName("");
      setEmail("");
      setCountryName("");
      setBio("");
    } catch (err) {
      console.error(err);
      setUserError("Could not submit profile. Please try again.");
    }
  }

  // ----------------------------
  // Convert saved country names into country objects
  // ----------------------------
  // Allows access to flags, population, region, etc.
  const savedCountries = useMemo(() => {
    return savedCountryNames
      .map((name) => countriesData.find((c) => c.name.common === name))
      .filter(Boolean);
  }, [savedCountryNames, countriesData]);

  // ----------------------------
  // Fetch saved countries ONCE when page loads
  // ----------------------------
  useEffect(() => {
    /*
      refreshSavedCountries is a function passed from App.jsx.
      That function can be recreated on re-renders.
      Putting it in the dependency array causes this effect to run repeatedly.

      This effect runs only once on page load to prevent infinite API calls.
    */
    refreshSavedCountries?.();

    // Intentionally empty dependency array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----------------------------
  // RENDER
  // ----------------------------
  return (
    <main className="page">
      <h1>Saved Countries</h1>

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
                <Link
                  to={`/country-detail/${encodeURIComponent(c.name.common)}`}
                >
                  <h3 className="saved-card__name">{c.name.common}</h3>
                </Link>

                <p className="saved-card__meta">
                  Population: {c.population.toLocaleString()}
                </p>
                <p className="saved-card__meta">Region: {c.region}</p>
                <p className="saved-card__meta">
                  Capital: {c.capital?.[0] || "N/A"}
                </p>

                {/* Removes the country from the saved list in the backend */}
                <button
                  className="saved-card__button"
                  type="button"
                  onClick={() => toggleSaveCountryByName(c.name.common)}
                >
                  Unsave
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <hr style={{ margin: "40px 0" }} />

      <h2>
        {newestUser?.name
          ? `Welcome back, ${newestUser.name}!`
          : "Welcome back, User!"}
      </h2>

      <h3>My Profile</h3>

      {userError && <p className="error">{userError}</p>}

      {/* Form submission triggers the POST request */}
      <form className="profile-form" onSubmit={handleSubmit}>
        <label className="profile-form__label">
          Full Name
          <input
            className="profile-form__input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
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
            placeholder="Email"
            required
          />
        </label>

        <label className="profile-form__label">
          Country
          <input
            className="profile-form__input"
            value={countryName}
            onChange={(e) => setCountryName(e.target.value)}
            placeholder="Country"
            required
          />
        </label>

        <label className="profile-form__label">
          Bio
          <textarea
            className="profile-form__textarea"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Bio"
            rows={6}
          />
        </label>

        <button className="profile-form__button" type="submit">
          Submit
        </button>
      </form>
    </main>
  );
}

export default SavedCountries;
