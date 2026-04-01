const app = require("./src/app");
const connectDB = require("./src/config/db");
const { env, validateEnv } = require("./src/config/env");
const { ensureDefaultUserSeed } = require("./src/config/bootstrap");

let server;

const shutdown = (signal, error) => {
  if (error) {
    console.error(`[server] ${signal}`, error);
  }

  if (server) {
    server.close(() => {
      process.exit(error ? 1 : 0);
    });
    return;
  }

  process.exit(error ? 1 : 0);
};

process.on("uncaughtException", (error) => {
  shutdown("uncaughtException", error);
});

process.on("unhandledRejection", (reason) => {
  const error = reason instanceof Error ? reason : new Error(String(reason));
  shutdown("unhandledRejection", error);
});

const startServer = async () => {
  try {
    validateEnv();
    await connectDB();
    await ensureDefaultUserSeed();

    server = app.listen(env.PORT, () => {
      console.log(
        `[server] API running on port ${env.PORT} in ${env.NODE_ENV} mode`
      );
    });
  } catch (error) {
    shutdown("startupError", error);
  }
};

startServer();
