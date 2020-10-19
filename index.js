const express = require("express");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const API = require("./src/API.js");
const cors = require("cors");
const mongoDB = require("./src/mongoDB")();
const app = express();
const dotenv = require("dotenv").config();
const port = process.env.PORT || 3000;

// MiddleWare
app.use(helmet());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());
app.use(cors());

// Endpoints
app.use("/api", API);
app.get("/", (req, res) => res.send("Hello World!"));

app.listen(port, () => console.log(`App listening on port ${port}!`));
