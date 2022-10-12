const express = require("express");
const app = express();
const cors = require("cors");

const mongoose = require("mongoose");

//config JSON response
app.use(express.json());

//Solve Cors
app.use(cors({ Credential: true, origin: "http://localhost:3000" }));

//public folder for images
app.use(express.static("public"));

module.exports = app;
