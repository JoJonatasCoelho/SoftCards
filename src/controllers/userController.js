const { validationResult } = require("express-validator");
const { authenticateUser, registerUser } = require("../services/userService");

exports.register = async (req, res, next) => {
  try {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(400).json({ errors: validationErrors.array() });
    }
    const user = await registerUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const token = await authenticateUser(req.body);
    if (!token) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }
    res.json({ token });
  } catch (err) {
    next(err);
  }
};