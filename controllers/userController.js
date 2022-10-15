const User = require("../models/User");
const bcrypt = require("bcrypt");
const createUserToken = require("../helpers/create-user-token");

exports.register = async (req, res) => {
  const { name, email, phone, password, confirmpassword, images } = req.body;

  if (!name || !email || !phone || !password || !confirmpassword) {
    res.status(422).send({ message: "Preencha todos os campos!" });
    return;
  }
  if (password !== confirmpassword) {
    res.status(422).json({ message: "As senhas precisam ser iguais!" });
    return;
  }

  //check if user exist
  const userExist = await User.findOne({ email: email });

  if (userExist) {
    res.status(422).send({ message: "Use outro email!" });
    return;
  }
  const salt = await bcrypt.genSalt(12);
  const passwordToString = password.toString();
  const passwordHash = await bcrypt.hash(passwordToString, salt);

  //create user
  const user = new User({
    name,
    email,
    phone,
    password: passwordHash,
  });
  try {
    const newUser = await user.save();
    await createUserToken(newUser, req, res);
  } catch (error) {
    res.status(500).send({ message: error });
  }
};
