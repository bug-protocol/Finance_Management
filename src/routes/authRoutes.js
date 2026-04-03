const express = require("express");
const authController = require("../controllers/authController");
const validate = require("../middlewares/validate");
const { registerValidator, loginValidator } = require("../validators/authValidator");

const router = express.Router();

router.post("/register", registerValidator, validate, authController.register);
router.post("/login", loginValidator, validate, authController.login);

module.exports = router;
