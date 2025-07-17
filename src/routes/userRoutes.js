const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const { register, login } = require("../controllers/userController");
const verifyJWT = require("../middlewares/auth");

router.post("/register", [
    body("name").notEmpty().withMessage("Nome é obrigatório"),
    body("email").isEmail().withMessage("Email inválido"),
    body("password").isLength({ min: 6 }).withMessage("Senha deve ter pelo menos 6 caracteres")
], register);

router.post("/login", [
    body("email").isEmail().withMessage("Email inválido"),
    body("password").notEmpty().withMessage("Senha é obrigatória")
], login);

router.get("/me", verifyJWT, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;