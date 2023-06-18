require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const mysql = require("mysql");
const path = require("path");

const app = express();
const connection = mysql.createConnection(process.env.DATABASE_URL);
const port = 3000;

app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), "src/public")));

app.set("view engine", "ejs");
app.engine("ejs", require("ejs").__express);
app.set("views", path.join(process.cwd(), "src/views"));

app.get("/", (req, res) => {
  connection.query("SELECT * FROM messages", function (err, rows, fields) {
    if (err) throw err;

    const messages = rows.map((row) => row.message);
    res.render("index", { rows });
  });
});

app.post("/msg", (req, res) => {
  const { msg } = req.body;
  query = `INSERT INTO messages (message) VALUES ('${msg}')`;

  connection.query(query, function (err, rows, fields) {
    if (err) {
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
  console.log("listening");
});
