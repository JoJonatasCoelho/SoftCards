const { validationResult } = require("express-validator");
const deckService = require('../services/deckService');

exports.create = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const userId = req.user.id;
    const deck = await deckService.createDeck(userId, req.body);
    if (!deck) {
      return res.status(400).json({ error: "Falha ao criar deck" });
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
            return res.status(400).json({ message: "Decks não encontrados" });
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
            return res.status(400).json({ message: "Deck não encontrado" });
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
            return res.status(404).json({ message: "Deck não encontrado ou acesso não permitido." });
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
            return res.status(400).json({ message: "Deck não encontrado ou acesso não permitido." });
        }
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};