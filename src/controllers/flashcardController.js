const { validationResult } = require("express-validator");
const flashcardService = require('../services/flashcardService');
const ApiError = require('../utils/ApiError');

exports.create = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, "Dados inválidos", true, errors.array());
    }
    const userId = req.user.id;
    const deckId = req.params.deckId;
    const card = await flashcardService.addCardToDeck(userId, deckId, req.body);
    if (!card) {
      throw new ApiError(404, "Deck não encontrado ou acesso não permitido.", true);
    }
    res.status(201).json(card);
  } catch (err) {
    next(err);
  }
};

exports.getAllFromDeck = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const deckId = req.params.deckId;
        const cards = await flashcardService.getCardsFromDeck(userId, deckId);
        if (!cards || cards.length === 0) {
            throw new ApiError(404, "Nenhum flashcard encontrado para o deck", true);
        }
        res.status(200).json(cards);
    } catch (err) {
        next(err);
    }
};

exports.update = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          throw new ApiError(400, "Dados inválidos", true, errors.array());
        }
        const userId = req.user.id;
        const cardId = req.params.cardId;
        const updatedCard = await flashcardService.updateCard(cardId, userId, req.body);
        if (!updatedCard) {
            throw new ApiError(404, "Flashcard não encontrado ou acesso não permitido.", true);
        }
        res.status(200).json(updatedCard);
    } catch (err) {
        next(err);
    }
};

exports.remove = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const cardId = req.params.cardId;
        const result = await flashcardService.deleteCard(cardId, userId);
        if (!result) {
            throw new ApiError(404, "Flashcard não encontrado ou acesso não permitido.", true);
        }
        res.status(204).json();
    } catch (err) {
        next(err);
    }
};