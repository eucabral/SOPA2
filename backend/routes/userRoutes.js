const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
//middleware
const verifytoken = require("../helpers/verify-token");
const { imageUpload } = require("../helpers/image-upload");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/checkUser", userController.checkUser);
router.get("/:id", userController.getById);
router.patch(
  "/edit/:id",
  verifytoken,
  imageUpload.single("image"),
  userController.editUser
);

module.exports = router;
