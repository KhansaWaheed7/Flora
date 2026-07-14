const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const routes = require("./routes");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const app = express();
app.use("/api/v1", routes);
app.use(helmet());

app.use(compression());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Flora API",
    version: "1.0.0",
  });
});

module.exports = app;