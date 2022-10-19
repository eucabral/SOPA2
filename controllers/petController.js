const Pet = require("../models/Pet");

const getUserByToken = require("../helpers/get-user-by-token");
const getToken = require("../helpers/get-token");
const Objectid = require("mongoose").Types.ObjectId;

exports.create = async (req, res) => {
  const { name, age, weight, color } = req.body;

  const images = req.files;

  const available = true;

  //validations
  if (!name || !age || !weight || !color) {
    res.status(422).send({ message: "Preencha todos os campos!" });
    return;
  }
  if (images.length === 0) {
    res.status(422).json({ message: "A imagem é obrigatória!" });
    return;
  }

  // get user
  const token = getToken(req);
  const user = await getUserByToken(token);

  // create pet
  const pet = new Pet({
    name: name,
    age: age,
    weight: weight,
    color: color,
    available: available,
    images: [],
    user: {
      _id: user._id,
      name: user.name,
      image: user.image,
      phone: user.phone,
    },
  });

  images.map((image) => {
    pet.images.push(image.filename);
  });
  try {
    const newPet = await pet.save();

    res.status(201).json({
      message: "Pet cadastrado com sucesso!",
      newPet,
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

exports.getAll = async (req, res) => {
  const pets = await Pet.find().sort("-createdAt");

  res.status(200).json({
    pets: pets,
  });
};
