const Deck = require('../models/Deck');

async function createDeck(userId, deckData) {
  const deck = new Deck({
    ...deckData,
    owner: userId,
  });
  return await deck.save();
}

async function getDecksByUser(userId) {
  return await Deck.find({ owner: userId });
}

async function getDeckById(deckId, userId) {
    return await Deck.findOne({ _id: deckId, owner: userId });
}

async function updateDeck(deckId, userId, updateData) {
    const query = { _id: deckId, owner: userId };
    const options = { new: true };
    return await Deck.findOneAndUpdate(query, updateData, options);
}

async function deleteDeck(deckId, userId) {
    const deck = await Deck.findOne({ _id: deckId, owner: userId });
    if (!deck) {
        return null;
    }
    await Flashcard.deleteMany({ deck: deckId });
    return await Deck.findByIdAndDelete(deckId);
}

module.exports = {
    createDeck,
    getDecksByUser,
    getDeckById,
    updateDeck,
    deleteDeck
};
