const express = require("express");
const app = express();
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");

const mongoose = require("mongoose");

//config JSON response
app.use(express.json());

//Solve Cors
app.use(cors({ Credential: true, origin: "http://localhost:3000" }));

//public folder for images
app.use(express.static("public"));

//routes
app.use("/users", userRoutes);

//router not found
app.use((req, res, next) => {
  const erro = new Error("Not found");
  erro.status = 404;
  next(erro);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  return res.send({ erro: { message: error.massage } });
});

module.exports = app;
