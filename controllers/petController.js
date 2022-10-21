const Pet = require("../models/Pet");

const getUserByToken = require("../helpers/get-user-by-token");
const getToken = require("../helpers/get-token");
const ObjectId = require("mongoose").Types.ObjectId;

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
exports.getAllUserPets = async (req, res) => {
  const token = getToken(req);
  const user = await getUserByToken(token);

  const pets = await Pet.find({ "user._id": user._id }).sort("-createAt");

  res.status(200).json({ pets });
};

exports.getAllUserAdoptions = async (req, res) => {
  const token = getToken(req);
  const user = await getUserByToken(token);

  const pets = await Pet.find({ "adopter._id": user._id }).sort("-createAt");

  res.status(200).json({ pets });
};

exports.getPetById = async (req, res) => {
  const id = req.params.id;

  //check is id is valid
  if (!ObjectId.isValid(id)) {
    res.status(422).json({ message: "ID invalido!" });
    return;
  }
  //check if pet exist
  const pet = await Pet.findOne({ _id: id });

  if (!pet) {
    res.status(404).json({ message: "O pet não existe!" });
  }

  res.status(200).json({
    pet: pet,
  });
};

exports.removePetById = async (req, res) => {
  const id = req.params.id;

  //check is ID is valid
  if (!ObjectId.isValid(id)) {
    res.status(422).json({ message: "ID invalido!" });
    return;
  }

  const pet = await Pet.findOne({ _id: id });

  if (!pet) {
    res.status(404).json({ message: "O pet não existe!" });
    return;
  }

  //check if logger in user registered the pet
  const token = getToken(req);
  const user = await getUserByToken(token);

  if (pet.user._id.toString() !== user._id.toString()) {
    res.status(422).json({
      message:
        "Houve um problema em processar a sua solicitação, tente novamente mais tarde!",
    });
    return;
  }

  await Pet.findByIdAndRemove(id);

  res.status(200).json({ message: "O pet foi removido com sucesso!" });
};

exports.updatePet = async (req, res) => {
  const id = req.params.id;

  const { name, age, weight, color, available } = req.body;

  const images = req.files;

  const updateData = {};

  //check if pet exists
  const pet = await Pet.findOne({ _id: id });

  if (!pet) {
    res.status(404).json({ message: "O pet não existe" });
  }

  // validations
  if (!name) {
    res.status(422).json({ message: "O nome é obrigatório!" });
    return;
  } else {
    updateData.name = name;
  }

  if (!age) {
    res.status(422).json({ message: "A idade é obrigatória!" });
    return;
  } else {
    updateData.age = age;
  }

  if (!weight) {
    res.status(422).json({ message: "O peso é obrigatório!" });
    return;
  } else {
    updateData.weight = weight;
  }

  if (!color) {
    res.status(422).json({ message: "A cor é obrigatória!" });
    return;
  } else {
    updateData.color = color;
  }

  console.log(images);

  if (images.length === 0) {
    res.status(422).json({ message: "A imagem é obrigatória!" });
    return;
  } else {
    updateData.images = [];
    images.map((image) => {
      updateData.images.push(image.filename);
    });
  }

  await Pet.findByIdAndUpdate(id, updateData);

  res.status(200).json({ message: "Pet atualizado com sucesso!" });
};

exports.schedule = async (req, res) => {
  const id = req.params.id;

  //check if pet exists
  const pet = await Pet.findOne({ _id: id });

  if (!pet) {
    res.status(404).json({ message: "O pet não existe" });
  }
  //check if user register the pet
  const token = getToken(req);
  const user = await getUserByToken(token);

  if (pet.user._id.equals(user._id)) {
    res.status(422).json({
      message: "Você não pode agendar uma visita com o seu proprio pet",
    });
    return;
  }
  //check if user has already scheduled a visit
  if (pet.adopter) {
    if (pet.adopter._id.equals(user._id)) {
      res.status(422).json({
        message: "Você já agendou uma visita com esse Pet!",
      });
      return;
    }
  }
  //add user to pet
  pet.adopter = {
    _id: user._id,
    name: user.name,
    image: user.image,
  };
  await Pet.findByIdAndUpdate(id, pet);

  res.status(200).json({
    message: `A visita foi marcada com sucesso, entre em contato com ${pet.user.name} pelo telefone ${pet.user.phone}`,
  });
};

exports.concludeAdoption = async (req, res) => {
  const id = req.params.id;

  const pet = await Pet.findOne({ _id: id });

  if (!pet) {
    res.status(404).json({ message: "O pet não existe" });
  }

  //check if logger in user registered the pet
  const token = getToken(req);
  const user = await getUserByToken(token);

  if (pet.user._id.toString() !== user._id) {
    res.status(422).json({
      message:
        "Houve um problema em processar a sua solicitação, tente novamente mais tarde",
    });
    return;
  }
  pet.available = false;

  await Pet.findByIdAndUpdate(id, pet);

  res.status(200).json({ message: "Parabens! voçê adotou o pet" });
};
