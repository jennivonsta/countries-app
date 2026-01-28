// React hooks:
// useState  -> stores values that can change (form inputs, newest user, error messages)
// useEffect -> runs code at specific times (ex: when the page loads)
// useMemo   -> calculates derived data efficiently (ex: converting saved names to country objects)
import { useEffect, useMemo, useState } from "react";

// Link lets us navigate to another route without refreshing the whole page
import { Link } from "react-router-dom";

function SavedCountries({
  countriesData,
  savedCountryNames,
  toggleSaveCountryByName,
  refreshSavedCountries,
}) {
  // ----------------------------
  // PROFILE FORM STATE (controlled inputs)
  // ----------------------------
  // Each input field has state so React controls the value shown in the form.
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [countryName, setCountryName] = useState("");
  const [bio, setBio] = useState("");

  // newestUser = newest user stored in backend
  // Used for: "Welcome back, {newestUser.name}!"
  const [newestUser, setNewestUser] = useState(null);

  // userError = any error message shown under the form title
  const [userError, setUserError] = useState("");

  // ----------------------------
  // GET newest user (GET request)
  // ----------------------------
  // This function pulls the newest user from the backend so we can display it.
  // It also pre-fills the form with the newest user's data (optional UX).
  async function fetchNewestUser() {
    try {
      // Clear any previous error before making the request
      setUserError("");

      // GET request (retrieve data)
      const res = await fetch("/api/get-newest-user");

      // If response is not ok, throw an error so we go to catch
      if (!res.ok) throw new Error(`Failed newest user GET: ${res.status}`);

      // The backend returns JSON for this endpoint
      const data = await res.json();

      // Some backends return an object, others return [object]
      const user = Array.isArray(data) ? data[0] : data;

      // If no user exists yet, keep newestUser as null and stop here
      if (!user || !user.name) {
        setNewestUser(null);
        return;
      }

      // Save newest user in state so UI can show "Welcome back, ___!"
      setNewestUser(user);

      // Optional: pre-fill form fields so user can see newest profile data
      setName(user.name || "");
      setEmail(user.email || "");
      setCountryName(user.country_name || "");
      setBio(user.bio || "");
    } catch (err) {
      console.error(err);
      setUserError("Could not load user info.");
    }
  }

  // Run once when this page loads
  useEffect(() => {
    fetchNewestUser();
  }, []);

  // ----------------------------
  // POST user on submit (POST request)
  // ----------------------------
  // This runs when the user clicks the Submit button.
  // POST is used because we are SENDING data to the server to CREATE/STORE a new user.
  async function handleSubmit(e) {
    // Prevent the browser from refreshing the page
    e.preventDefault();

    try {
      // Clear previous error before making the POST request
      setUserError("");

      // Backend expects these exact keys in the request body:
      // name, email, country_name, bio
      const body = {
        name,
        email,
        country_name: countryName,
        bio,
      };

      // ============================================================
      // IMPORTANT PART: THE POST REQUEST TO PRESENT
      // Endpoint: POST /api/add-one-user
      // Purpose: Send profile form data to backend to create/store a user
      // ============================================================
      const res = await fetch("/api/add-one-user", {
        method: "POST", // POST because we are creating/storing data
        headers: { "Content-Type": "application/json" }, // Tell backend we are sending JSON
        body: JSON.stringify(body), // Convert JS object into JSON string for the request
      });
      // ============================================================

      // If the backend responds with an error status, throw so catch runs
      if (!res.ok) throw new Error(`Add user failed: ${res.status}`);

      // This backend returns plain text (not JSON) for this POST endpoint
      await res.text();

      // After we POST a new user, we GET the newest user again
      // so the UI updates with the most current saved user data.
      await fetchNewestUser();

      // Clear form fields after submit (optional)
      // If you want the form to remain filled with newest user data,
      // remove these 4 lines.
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
  // Convert saved country NAMES into full country objects
  // ----------------------------
  // savedCountryNames (from backend) only includes country names.
  // We convert those names into the full objects so we can show flags, population, etc.
  const savedCountries = useMemo(() => {
    return savedCountryNames
      .map((name) => countriesData.find((c) => c.name.common === name))
      .filter(Boolean); // remove undefined results if a match isn't found
  }, [savedCountryNames, countriesData]);

  // Refresh saved countries list on mount (not required, just extra)
  useEffect(() => {
    refreshSavedCountries?.();
  }, [refreshSavedCountries]);

  // ----------------------------
  // RENDER UI
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
                {/* Link to this country's detail page */}
                <Link to={`/country-detail/${encodeURIComponent(c.name.common)}`}>
                  <h3 className="saved-card__name">{c.name.common}</h3>
                </Link>

                <p className="saved-card__meta">
                  Population: {c.population.toLocaleString()}
                </p>
                <p className="saved-card__meta">Region: {c.region}</p>
                <p className="saved-card__meta">
                  Capital: {c.capital?.[0] || "N/A"}
                </p>

                {/* Unsave button: removes this country from backend saved list */}
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

      {/* Welcome message requirement */}
      <h2>
        {newestUser?.name
          ? `Welcome back, ${newestUser.name}!`
          : "Welcome back, User!"}
      </h2>

      <h3>My Profile</h3>

      {/* Error message if form submit or newest user fetch fails */}
      {userError && <p className="error">{userError}</p>}

      {/* Profile form. onSubmit triggers handleSubmit (POST request) */}
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
