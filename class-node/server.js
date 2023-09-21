const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");

const app = express();

const PORT = 3000;

// const DB_URL = "mongodb://0.0.0.0:27017/admin";
const DB_URL = "mongodb+srv://felixraja:felix123@cluster0.d30qt0o.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(DB_URL, {})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Could not connect to MongoDB", err));


  app.listen(PORT, () => {
    console.log("Server is running on PORT", PORT);
  });