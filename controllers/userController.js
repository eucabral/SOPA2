const User = require("../models/User");
const bcrypt = require("bcrypt");
const createUserToken = require("../helpers/create-user-token");
const getToken = require("../helpers/get-token");
const jwt = require("jsonwebtoken");

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

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(422).send({ message: "Preencha todos os campos!" });
    return;
  }
  //check if user exist
  const user = await User.findOne({ email: email });

  if (!user) {
    res.status(422).send({ message: "Use outro email!" });
    return;
  }
  // check if password match
  const checkPassword = await bcrypt.compare(password, user.password);

  if (!checkPassword) {
    return res.status(422).json({ message: "Senha inválida" });
  }

  await createUserToken(user, req, res);
};

exports.checkUser = async (req, res) => {
  let currentUser;

  console.log(req.headers.authorization);

  if (req.headers.authorization) {
    const token = getToken(req);
    const decoded = jwt.verify(token, "nossosecret");

    currentUser = await User.findById(decoded.id);

    currentUser.password = undefined;
  } else {
    currentUser = null;
  }

  res.status(200).send(currentUser);
};
