const jwt = require("jsonwebtoken");

const createUserToken = async (user, req, res, next) => {
  const token = jwt.sign(
    {
      name: user.name,
      id: user._id,
    },
    "nossosecret"
  );
  //return token
  res.status(201).json({
    message: "Você está autenticado!",
    token: token,
    Userid: user._id,
  });
};

module.exports = createUserToken;
