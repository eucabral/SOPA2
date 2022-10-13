const User = require("../models/User");

exports.register = async (req, res) => {
  const { name, email, password, confirmpassword, images, phone } = req.body;

  const message = "Preencha todos os campos";

  if (!name) {
    res.status(422).send({ message: message });
    return;
  }
  if (!email) {
    res.status(422).send({ message: message });
    return;
  }
  if (!phone) {
    res.status(422).send({ message: message });
    return;
  }
  if (!password) {
    res.status(422).send({ message: message });
    return;
  }
  if (!confirmpassword) {
    res.status(422).send({ message: message });
    return;
  }
  if (password !== confirmpassword) {
    res.status(422).json({ message: "as senhas precisam ser iguais" });
    return;
  }

  //check if user exist
  const userExist = await User.findOne({ email: email });

  if (!userExist) {
    res.status(422).send({ message: "use outro email" });
    return;
  }
};
