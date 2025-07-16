const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const { register, login } = require("../controllers/userController");
const verificarJWT = require("../middlewares/auth");

router.post("/register", [
    body("nome").notEmpty().withMessage("Nome é obrigatório"),
    body("email").isEmail().withMessage("Email inválido"),
    body("senha").isLength({ min: 6 }).withMessage("Senha deve ter pelo menos 6 caracteres")
], register);

router.post("/login", [
    body("email").isEmail().withMessage("Email inválido"),
    body("senha").notEmpty().withMessage("Senha é obrigatória")
], login);

router.get("/me", verificarJWT, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;