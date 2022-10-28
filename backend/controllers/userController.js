const User = require("../models/User");
const bcrypt = require("bcrypt");
const createUserToken = require("../helpers/create-user-token");
const getToken = require("../helpers/get-token");
const jwt = require("jsonwebtoken");
const getUserByToken = require("../helpers/get-user-by-token");

exports.register = async (req, res) => {
  const { name, email, phone, password, confirmpassword } = req.body;

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

exports.getById = async (req, res) => {
  const id = req.params.id;

  const user = await User.findById(id);

  if (!user) {
    res.status(422).json({ message: "Usuário não encontrado!" });
    return;
  }

  res.status(200).json({ user });
};

exports.editUser = async (req, res) => {
  const token = getToken(req);

  const user = await getUserByToken(token);

  const { name, email, phone, password, confirmpassword } = req.body;

  let image = "";

  if (req.file) {
    user.image = req.file.filename;
  }

  // validations
  if (!name) {
    res.status(422).json({ message: "O nome é obrigatório!" });
    return;
  }

  user.name = name;

  if (!email) {
    res.status(422).json({ message: "O e-mail é obrigatório!" });
    return;
  }

  // check if user exists
  const userExists = await User.findOne({ email: email });

  if (user.email !== email && userExists) {
    res.status(422).json({ message: "Por favor, utilize outro e-mail!" });
    return;
  }

  user.email = email;

  // if (!image) {
  //   const imageName = req.file.filename;
  //   user.image = imageName;
  // }

  if (!phone) {
    res.status(422).json({ message: "O telefone é obrigatório!" });
    return;
  }

  user.phone = phone;

  // check if password match
  if (password != confirmpassword) {
    res.status(422).json({ error: "As senhas não conferem." });

    // change password
  } else if (password == confirmpassword && password != null) {
    // creating password
    const salt = await bcrypt.genSalt(12);
    const reqPassword = req.body.password;

    const passwordHash = await bcrypt.hash(reqPassword, salt);

    user.password = passwordHash;
  }

  try {
    // returns updated data
    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      { $set: user },
      { new: true }
    );
    res.json({
      message: "Usuário atualizado com sucesso!",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
