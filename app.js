require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const methodOverride = require("method-override");
const mysql = require("mysql2");
const path = require("path");

const connection = mysql.createConnection(process.env.DATABASE_URL);
const app = express();

const port = 3000;

app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

messages = ["Hello, welcome to this random thing", "this is a test data"];

app.get("/", (req, res) => {
  connection.query("SELECT * FROM messages", function (err, rows, fields) {
    if (err) throw err;

    const messages = rows.map((row) => row.message);

    // res.send(rows);
    res.render("index", { rows });
  });
});

app.post("/msg", (req, res) => {
  const { msg } = req.body;
  query = `INSERT INTO messages (message) VALUES ('${msg}')`;
  connection.query(query, function (err, rows, fields) {
    if (err) {
      console.log(msg);
      console.log(msg.length);
      if (msg.length > 255) {
        res.status(500).send("Char limit reched");
      }
      res.status(404).send(err);
    }

    res.redirect("/");
  });
});

app.delete("/msg/:id", (req, res) => {
  const { id } = req.params;
  query = `DELETE FROM messages WHERE id=${id}`;
  connection.query(query, function (err, rows, fields) {
    if (err) throw err;

    res.redirect("/");
  });
});

app.listen(port, () => {
  console.log(`Listening at port ${port}`);
});
