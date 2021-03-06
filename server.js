// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const app = express();
const morgan = require("morgan");

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect(
  console.log("connected to the db")
);

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));

// use cookieSession to store login
const cookieSession = require('cookie-session')
app.use(cookieSession({
  name: 'session',
  keys: [ "mysecretkey1", "mysecretkey2"],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/styles",
    destination: __dirname + "/public/styles",
    isSass: false, // false => scss, true => sass
  })
);

app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("./routes/users");
const categoryRoute = require("./routes/category");
const resourecesRoute = require("./routes/resources");
const myresourcesRoute = require('./routes/myresource');
const searchRoute = require("./routes/search");
const profileRoute = require("./routes/profile");
const authRoute = require("./routes/auth");
const homeRoute = require("./routes/home");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
// app.use('/comments', commentsRoute(db));
app.use("/users", usersRoutes(db));
app.use("/categories", categoryRoute(db));
app.use("/resources", resourecesRoute(db));
app.use("/myresource", myresourcesRoute(db));
app.use("/search", searchRoute(db));
app.use("/profile", profileRoute(db));
app.use("/auth", authRoute(db));
app.use("/", homeRoute(db));


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
