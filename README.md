
#  Countries App

## 📌 Project Description & Purpose

This project is a full-stack Countries App that allows users to explore countries, save their favorites, and track how many times they view each country.

The purpose of this project is to practice building a complete full-stack application by connecting a React frontend to a custom-built Express server and a PostgreSQL database. This project demonstrates how data flows from the frontend, through an API, and into a database.

## 🚀 Live Site

Here's the link to view the live app: ___________

## 🖼️ Screenshots
<img width="1231" height="742" alt="Screenshot 2026-04-01 at 1 12 58 PM" src="https://github.com/user-attachments/assets/1c2ff410-ec32-47a4-9834-4210606df301" />
Here is where you'll include a screenshot of your project to show it off! 

## ✨ Features

This is what you can do on the app: 

-Search for countries and filter by region
-View detailed information about each country
-Save your favorite countries
-View a list of saved countries
-Track how many times you’ve viewed each country
-Submit your name and see a personalized welcome message

## 🛠️ Tech Stack

**Frontend**

- **Languages:** JavaScript React, HTML, CSS
- **Framework:** React (with Vite)
- **Deployment:** Netlify

**Server/API**

- **Languages:** JavaScript (Node.js)
- **Framework:** Express
- **Deployment:** Localhost (for development)

**Database**

- **Languages:** SQL (PostgreSQL)
- **Deployment:** Neon.tech

## 🔹 API Documentation

These are the API endpoints I built: 
1. GET /get-newest-user — retrieves the most recently added user
2. POST /add-one-user — saves form data to the database
3. GET /get-all-saved-countries — returns all saved countries
4. POST /save-one-country — saves a country
5. POST /update-one-country-count — increments the view count for a country

Here's the link to the full API documentation: (https://github.com/ac-backend/countries-app-instructions/blob/main/version-3/api-documentation.md)

## 🗄️ Database Schema

Here’s the SQL I used to create my tables:  

CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  country_name VARCHAR NOT NULL,
  email VARCHAR NOT NULL UNIQUE,
  bio VARCHAR
);

CREATE TABLE saved_countries (
  country_name VARCHAR PRIMARY KEY
);

CREATE TABLE country_counts (
  country_name VARCHAR PRIMARY KEY,
  count INTEGER NOT NULL
);

## 💭 Reflections

**What I learned:** I learned how to connect a frontend application to a backend server and database. I now understand how API endpoints work, how to write SQL queries, and how to pass data between the frontend and backend using fetch requests.

**What I'm proud of:** I’m proud of building my first full-stack application from scratch and successfully connecting all the pieces together. Especially creating my own API and seeing my data persist in a real database.

**What challenged me:** Understanding how all the pieces connect (frontend → backend → database) was challenging at first. Debugging connection issues like server errors and database queries also took time to figure out.

**Future ideas for how I'd continue building this project:** 
-Add user authentication (login/signup)
-Add sorting and filtering to saved countries
-Add Journal entries to saved countries so the user can write whenthey went to the country etc.

## 🙌 Credits & Shoutouts 

-REST Countries API (for country data)
-Neon.tech (for database hosting)
-AnnieCannons bootcamp curriculum
-Instructors Phil & Arianna and class support
