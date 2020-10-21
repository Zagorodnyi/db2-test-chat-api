const express = require("express");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const API = require("./src/API.js");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const mongoDB = require("./src/mongoDB")();
const app = express();
const dotenv = require("dotenv").config();
const port = process.env.PORT || 3000;
const swaggerOptions = require("./swaggerConfig.json");

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
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerOptions));

app.get("/", (req, res) => {
  res.redirect("/api-docs");
});

app.listen(port, () => console.log(`App listening on port ${port}!`));

module.exports = app;
