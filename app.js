// Dependancies
const express = require("express");
const cors = require("cors");
const path = require("path");
const passport = require("passport");
const ip = require("ip");
require("dotenv").config();

// Initialize app
const app = express();

// Importing routes

// Passport Strategies
const { localStrategy, jwtStrategy } = require("./middleware/passport");

// Importing database
const db = require("./db/models");

// Middleware
app.use(cors());
app.use(express.json());

// Passport Setup
app.use(passport.initialize());
passport.use(localStrategy);
passport.use(jwtStrategy);

// Using routes

// Handling Errors
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message || "Internal Server Error",
  });
});

// Start server
const run = async () => {
  try {
    await db.sequelize.sync({ alter: true });
    console.log("Server connected to database successfully.");

    app.listen(process.env.PORT, () => {
      console.log("Express app started successfully");
      console.log(`Running on ${ip.address()}:${process.env.PORT}`);
    });
  } catch (error) {
    console.log("Failed to connect to database:", error);
  }
};
app.use((req, res, next) => {
  res.status(404).json({ message: "Path not found" });
});
run();
