const mongoose = require("mongoose");

async function main() {
  await mongoose.connect("mongodb://localhost:27017/SOPA2.0");
  console.log("conectou ao mongoose");
}

main().catch((err) => console.log(err));

module.exports = mongoose;
