# 📝 Writing a README

A well-written README helps others (and your future self!) understand, use, and appreciate your project. Here’s a quick guide to writing one.

## 📌 What is a README?

A `README.md` is usually the **first** thing someone sees in your repo. It gives an **overview** of what your **project** is about, how to use it, and how it works.

You spent hours on your project — spend at least 30 minutes writing a clear README.
It’s your chance to tell the world what your hard work is all about!

## 🧹 Tips

- Don’t overthink it! Just explain your project clearly
- Use headers, bullet points, and links to keep it easy to read
- Update the README if your project changes

## 🎨 Markdown Formatting Tips

README files use **Markdown** (`.md`) to style content.

### Common Markdown formatting:

```markdown
# H1 (Main title)
## H2 (Section)
### H3 (Subsection)

**bold text**  
_italic text_  
`inline code`  

- bullet points
1. numbered lists

[Link text](https://example.com)

![Alt text for image](./images/image.png)
```

# Fill Out the Template Below ⬇️ 
Once you're done filling out the template, paste it into your Github repo's main `README.md` file! 

---

# 📝 Your Project's Title — Countries App

## 📌 Project Description & Purpose

This project is a full-stack Countries App that allows users to explore countries, save their favorites, and track how many times they view each country.

The purpose of this project is to practice building a complete full-stack application by connecting a React frontend to a custom-built Express server and a PostgreSQL database. This project demonstrates how data flows from the frontend, through an API, and into a database.

## 🚀 Live Site

Here's the link to view the live app: ___________

## 🖼️ Screenshots


Here is where you'll include a screenshot of your project to show it off! 

Instructions to include a screenshot into your README file: 

1. Use `Command + Control + Shift + 4` to take a screenshot of your site and copy the screenshot to your clipboard 
2. Find your Github `README.md` file on the Github website
3. Edit the site by clicking on the Pencil icon on the top right of the page ✏️
4. Move your cursor to the position where you want to paste the screenshot, then paste it. Github will convert the pasted screenshot into an `<img>` tag
5. Select "Commit changes..." to save your changes 

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

REST Countries API (for country data)
Neon.tech (for database hosting)
AnnieCannons bootcamp curriculum
Instructor examples from Phill and Arianna and class support