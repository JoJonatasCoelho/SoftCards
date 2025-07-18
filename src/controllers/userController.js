const { validationResult } = require("express-validator");
const { authenticateUser, registerUser, refreshAccessToken} = require("../services/userService");
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

exports.refreshToken = async (req, res, next) => {
  try{
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw new ApiError(401, "Refresh token é obrigatório", true);
    }
    const newAccessToken = await refreshAccessToken(refreshToken);
    if (!newAccessToken) {
      throw new ApiError(403, "Refresh token inválido ou expirado", true);
    }
    res.json(newAccessToken);
  }
  catch (err) {
    next(err);
  }
};