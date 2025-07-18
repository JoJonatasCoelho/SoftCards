const { validationResult } = require("express-validator");
const { authenticateUser, registerUser } = require("../services/userService");
const ApiError = require('../utils/ApiError');

exports.register = async (req, res, next) => {
  try {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      throw new ApiError(400, "Dados inválidos", true, validationErrors.array());
    }
    const user = await registerUser(req.body);
    if (!user) {
      throw new ApiError(400, "Usuário já existe", true, "Usuário com este email já registrado.");
    }
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const token = await authenticateUser(req.body);
    if (!token) {
      throw new ApiError(401, "Credenciais inválidas", true, "Email ou senha incorretos.");
    }
    res.json({ token });
  } catch (err) {
    next(err);
  }
};