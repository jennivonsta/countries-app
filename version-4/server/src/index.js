// ---------------------------------
// Boilerplate Code to Set Up Server
// ---------------------------------

import express from "express";
import pg from "pg";
import config from "./config.js";

const app = express();
const port = 3000;

app.use(express.json());

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true, // use SSL encryption when connecting to the database
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// ---------------------------------
// Helper Functions
// ---------------------------------

// 1. getNewestUser()
// gets the most recently added user from the users table
async function getNewestUser() {
  const result = await db.query(`
    SELECT *
    FROM users
    ORDER BY user_id DESC
    LIMIT 1;
  `);

  return result.rows[0];
}

// 2. addOneUser(name, country_name, email, bio)
// adds one new user to the users table
async function addOneUser(name, country_name, email, bio) {
  const result = await db.query(
    `
    INSERT INTO users (name, country_name, email, bio)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
    `,
    [name, country_name, email, bio],
  );

  return result.rows[0];
}

// 3. getAllSavedCountries()
// gets all saved countries from the saved_countries table
async function getAllSavedCountries() {
  const result = await db.query(`
    SELECT country_name
    FROM saved_countries;
  `);

  return result.rows;
}

// 4. saveOneCountry(country_name)
// saves one country to the saved_countries table
// if the country already exists, do nothing
async function saveOneCountry(country_name) {
  const result = await db.query(
    `
    INSERT INTO saved_countries (country_name)
    VALUES ($1)
    ON CONFLICT (country_name)
    DO NOTHING
    RETURNING *;
    `,
    [country_name],
  );

  return result.rows[0];
}

// 5. updateOneCountryCount(country_name)
// adds a country to country_counts with count 1
// or increases the count by 1 if it already exists
async function updateOneCountryCount(country_name) {
  const result = await db.query(
    `
    INSERT INTO country_counts (country_name, count)
    VALUES ($1, 1)
    ON CONFLICT (country_name)
    DO UPDATE
    SET count = country_counts.count + 1
    RETURNING count;
    `,
    [country_name],
  );

  return result.rows[0];
}

// ---------------------------------
// API Endpoints
// ---------------------------------

// Form Data

// 1. GET /get-newest-user
app.get("/get-newest-user", async (req, res) => {
  const newestUser = await getNewestUser();
  res.json(newestUser);
});

// 2. POST /add-one-user
app.post("/add-one-user", async (req, res) => {
  const { name, country_name, email, bio } = req.body;

  const newUser = await addOneUser(name, country_name, email, bio);

  res.json(newUser);
});

// Saved Countries

// 3. GET /get-all-saved-countries
app.get("/get-all-saved-countries", async (req, res) => {
  const savedCountries = await getAllSavedCountries();
  res.json(savedCountries);
});

// 4. POST /save-one-country
app.post("/save-one-country", async (req, res) => {
  const { country_name } = req.body;

  const savedCountry = await saveOneCountry(country_name);

  res.json(savedCountry);
});

// Country Count

// 5. POST /update-one-country-count
app.post("/update-one-country-count", async (req, res) => {
  const { country_name } = req.body;

  const updatedCount = await updateOneCountryCount(country_name);

  res.json(updatedCount);
});