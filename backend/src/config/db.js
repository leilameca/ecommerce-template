const mongoose = require("mongoose");

const { env } = require("./env");

mongoose.set("strictQuery", true);

const connectDB = async () => {
  mongoose.connection.on("connected", () => {
    console.log("[mongo] Connection established");
  });

  mongoose.connection.on("error", (error) => {
    console.error("[mongo] Connection error", error.message);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("[mongo] Connection disconnected");
  });

  await mongoose.connect(env.MONGODB_URI);
};

module.exports = connectDB;
