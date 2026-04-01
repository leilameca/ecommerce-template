const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const routes = require("./routes");
const { env } = require("./config/env");
const {
  notFoundMiddleware,
  errorHandler,
} = require("./middlewares/error.middleware");

const app = express();

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);
app.use(helmet());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

if (env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Reusable ecommerce backend is running.",
    docsHint: "Use /api/v1/health to verify the API status.",
  });
});

app.use("/api/v1", routes);

app.use(notFoundMiddleware);
app.use(errorHandler);

module.exports = app;
