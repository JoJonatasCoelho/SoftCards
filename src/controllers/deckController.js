const { validationResult } = require("express-validator");
const deckService = require('../services/deckService');
const ApiError = require('../utils/ApiError')

exports.create = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, "Dados inválidos", true, errors.array());
    }
    const userId = req.user.id;
    const deck = await deckService.createDeck(userId, req.body);
    if (!deck) {
      throw new ApiError(400, "Falha ao criar deck");
    }
    res.status(201).json(deck);
  } catch (err) {
    next(err);
  }
};

exports.getAllForUser = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const decks = await deckService.getDecksByUser(userId);
        if (!decks || decks.length === 0) {
            throw new ApiError(404, "Nenhum deck encontrado para o usuário", true);
        }
        res.status(200).json(decks);
    } catch (err) {
        next(err);
    }
};

exports.getById = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const deckId = req.params.id;
        const deck = await deckService.getDeckById(deckId, userId);
        if (!deck) {
            throw new ApiError(404, "Deck não encontrado", true);
        }
        res.status(200).json(deck);
    } catch (err) {
        next(err);
    }
};

exports.update = async (req, res, next) => {
    try {
        const errors = validationResult(req);   
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const userId = req.user.id;
        const deckId = req.params.id;
        const updatedDeck = await deckService.updateDeck(deckId, userId, req.body);
        if (!updatedDeck) {
            throw new ApiError(404, "Deck não encontrado ou acesso não permitido.", true);
        }
        res.status(200).json(updatedDeck);
    } catch (err) {
        next(err);
    }
};

exports.remove = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const deckId = req.params.id;
        const result = await deckService.deleteDeck(deckId, userId);

        if (!result) {
            throw new ApiError(404, "Deck não encontrado ou acesso não permitido.", true);
        }
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};