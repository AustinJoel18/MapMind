import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import env from "dotenv";

const app = express();
const port = 3000;
env.config();

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentUserId = 1;

let users = [
  { id: 1, name: "Angela", color: "teal" },
  { id: 2, name: "Jack", color: "powderblue" },
];

function capitalize(string) {
  if (!string) return ""; // Handle empty or null strings
  return string.charAt(0).toUpperCase() + string.slice(1);
}

async function checkNamed() {
  const result = await db.query(
    "SELECT country_code FROM named_countries WHERE user_id = $1",
    [currentUserId]
  );
  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  return countries;
}

async function getCurrentUser() {
  const result = await db.query("SELECT * FROM users");
  users = result.rows;
  return users.find((user) => user.id == currentUserId);
}

app.get("/", async (req, res) => {
  const countries = await checkNamed();
  const currentUser = await getCurrentUser();

  res.render("index.ejs", {
    countries: countries,
    total: countries.length,
    users: users,
    color: currentUser.color,
  });
});

app.post("/add", async (req, res) => {
  const country = req.body.country;
  if (country) {
    try {
      const result = await db.query(
        "SELECT country_code FROM world_countries WHERE LOWER(world_countries.country_name) LIKE '%' || LOWER($1) || '%';",
        [country]
      );

      if (result.rows.length === 0) {
        // If user enters gibberish
        const countries = await checkNamed();
        const currentUser = await getCurrentUser();

        return res.render("index.ejs", {
          countries: countries,
          total: countries.length,
          users: users,
          color: currentUser.color,
          error: "Invalid country name, try again",
        });
      }

      const code = result.rows[0].country_code;
      try {
        await db.query(
          "INSERT INTO named_countries(country_code, user_id) VALUES ($1, $2) ON CONFLICT (country_code, user_id ) DO NOTHING;",
          [code, currentUserId]
        );
        res.redirect("/");
      } catch (err) {
        console.log(err);
        const countries = await checkNamed();
        res.render("index.ejs", {
          countries: countries,
          total: countries.length,
          users: users,
          color: currentUser.color,
          error: "Country has already been added, try again",
        });
      }
    } catch (err) {
      console.log(err);
      const countries = await checkNamed();
      res.render("index.ejs", {
        countries: countries,
        total: countries.length,
        users: users,
        color: currentUser.color,
        error: "Invalid Country, try again",
      });
    }
  } else {
    res.redirect("/");
  }
});

app.post("/user", async (req, res) => {
  if (req.body.user) {
    currentUserId = req.body.user;
    res.redirect("/");
  } else if (req.body.remove) {
    if (req.body.remove == 1) {
      res.redirect("/");
    } else {
      let result = await db.query("DELETE FROM users WHERE id=($1)", [
        req.body.remove,
      ]);

      result = await db.query("SELECT id FROM users ORDER BY id LIMIT 1");
      if (result.rows.length > 0) currentUserId = result.rows[0].id;
      res.redirect("/");
    }
  } else {
    res.render("new.ejs");
  }
});

app.post("/new", async (req, res) => {
  //Hint: The RETURNING keyword can return the data that was inserted.
  //https://www.postgresql.org/docs/current/dml-returning.html
  if (req.body.name && req.body.color) {
    try {
      const result = await db.query(
        "INSERT INTO users(name, color) VALUES ($1,$2) RETURNING *;",
        [req.body.name, req.body.color]
      );
      const id = result.rows[0].id;
      currentUserId = id;

      res.redirect("/");
    } catch (err) {
      console.log(err);
      const countries = await checkNamed();
      const currentUser = await getCurrentUser();
      res.render("index.ejs", {
        countries: countries,
        total: countries.length,
        users: users,
        color: currentUser.color,
      });
    }
  } else {
    res.render("new.ejs");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
