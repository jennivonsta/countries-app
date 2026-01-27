import { useEffect, useMemo, useState } from "react";
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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [countryName, setCountryName] = useState("");
  const [bio, setBio] = useState("");

  // newestUser = newest user stored in backend
  const [newestUser, setNewestUser] = useState(null);

  // userError = any error message shown under the form title
  const [userError, setUserError] = useState("");

  // ----------------------------
  // GET newest user (works whether backend returns object OR array)
  // ----------------------------
  async function fetchNewestUser() {
    try {
      setUserError("");

      const res = await fetch("/api/get-newest-user");
      if (!res.ok) throw new Error(`Failed newest user GET: ${res.status}`);

      const data = await res.json();

      //  Some backends return an object, others return [object]
      const user = Array.isArray(data) ? data[0] : data;

      // If no user exists yet, keep newestUser as null
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
  // POST user on submit
  // ----------------------------
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setUserError("");

      // Backend expects: name, email, country_name, bio
      const body = {
        name,
        email,
        country_name: countryName,
        bio,
      };

      const res = await fetch("/api/add-one-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(`Add user failed: ${res.status}`);

      // Backend returns plain text (not JSON)
      await res.text();

      // ✅ Success: refresh newest user so heading updates
      // (Also re-fills the form with newest saved user data above)
      await fetchNewestUser();

      // ✅ Clear form fields
      // If your instructor expects the form to clear after submit, keep these.
      // If you want the form to remain filled with newest user data, remove these 4 lines.
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
  const savedCountries = useMemo(() => {
    return savedCountryNames
      .map((name) => countriesData.find((c) => c.name.common === name))
      .filter(Boolean);
  }, [savedCountryNames, countriesData]);

  // Refresh saved countries list on mount (optional)
  useEffect(() => {
    refreshSavedCountries?.();
  }, [refreshSavedCountries]);

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
        {newestUser?.name ? `Welcome back, ${newestUser.name}!` : "Welcome back, User!"}
      </h2>

      <h3>My Profile</h3>

      {/* Error message if form submit or newest user fetch fails */}
      {userError && <p className="error">{userError}</p>}

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
