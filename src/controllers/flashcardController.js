const { validationResult } = require("express-validator");
const flashcardService = require('../services/flashcardService');

exports.create = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const userId = req.user.id;
    const deckId = req.params.deckId;
    const card = await flashcardService.addCardToDeck(userId, deckId, req.body);
    if (!card) {
      return res.status(400).json({ error: "Deck não encontrado ou acesso não permitido." });
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
            return res.status(400).json({ message: "Nenhum cartão encontrado no deck." });
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
          return res.status(400).json({ errors: errors.array() });
        }
        const userId = req.user.id;
        const cardId = req.params.cardId;
        const updatedCard = await flashcardService.updateCard(cardId, userId, req.body);
        if (!updatedCard) {
            return res.status(400).json({ message: "Flashcard não encontrado ou acesso não permitido." });
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
            return res.status(400).json({ message: "Flashcard não encontrado ou acesso não permitido." });
        }
        res.status(200).json({ message: "Flashcard deletado com sucesso." });
    } catch (err) {
        next(err);
    }
};