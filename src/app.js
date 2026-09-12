const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const routes = require("./routes");

const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorMiddleware");
const app = express();

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

// Routes come AFTER middleware
app.use("/api/v1", routes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    application: "Flora",
    description: "Women's Healthcare Platform",
    api: "/api/v1",
  });
});

app.use(notFound);

app.use(errorHandler);
module.exports = app;