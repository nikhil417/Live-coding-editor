require("dotenv").config();

const express = require("express");
const serverless = require("serverless-http");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const mysql = require("mysql2");
const path = require("path");
const ejs = require("ejs").__express;

const app = express();
const router = express.Router();
const connection = mysql.createConnection(process.env.DATABASE_URL);
const port = 3000;

app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");
app.engine("ejs", require("ejs").__express);
app.set("views", path.join(__dirname, "views"));

router.get("/", (req, res) => {
  connection.query("SELECT * FROM messages", function (err, rows, fields) {
    if (err) throw err;

    const messages = rows.map((row) => row.message);
    res.render("index", { rows });
  });
});

router.post("/msg", (req, res) => {
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

router.delete("/msg/:id", (req, res) => {
  const { id } = req.params;
  query = `DELETE FROM messages WHERE id=${id}`;

  connection.query(query, function (err, rows, fields) {
    if (err) throw err;

    res.redirect("/");
  });
});

app.listen(port, () => {
  console.log("Listening at port 3000");
});

app.use("/.netlify/functions/api", router);

module.exports.handler = serverless(app);
