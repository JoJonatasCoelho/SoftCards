const Flashcard = require('../models/Flashcard');
const Deck = require('../models/Deck');

async function addCardToDeck(userId, deckId, cardData) {
  const deck = await Deck.findOne({ _id: deckId, owner: userId });
  if (!deck) {
    return null; 
  }
  const flashcard = new Flashcard({
    ...cardData,
    deck: deckId,
    owner: userId,
  });
    
  return await flashcard.save();
}

async function getCardsFromDeck(userId, deckId) {
  const deck = await Deck.findOne({ _id: deckId, owner: userId });
  if (!deck) {
    return null; 
  }

  return await Flashcard.find({ deck: deckId });
}

async function updateCard(cardId, userId, updateData) {
  const query = { _id: cardId, owner: userId };
  const options = { new: true }; 
  return await Flashcard.findOneAndUpdate(query, updateData, options);
}

async function deleteCard(cardId, userId) {
  const query = { _id: cardId, owner: userId };
  return await Flashcard.findOneAndDelete(query);
}

module.exports = {
  addCardToDeck,
  updateCard,
  getCardsFromDeck,
  deleteCard
};