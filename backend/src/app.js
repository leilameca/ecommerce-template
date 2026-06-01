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
const { handleWebhook } = require("./controllers/stripe.controller");

const app = express();

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);
app.use(helmet());

// Stripe webhook must receive the raw body before express.json() parses it
app.post(
  "/api/v1/stripe/webhook",
  express.raw({ type: "application/json" }),
  handleWebhook
);

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
