const mongoose = require("mongoose");

const FlashcardSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, "A pergunta é obrigatória."],
    trim: true,
  },
  answer: {
    type: String,
    required: [true, "A resposta é obrigatória."],
    trim: true,
  },
  deck: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Deck',
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Flashcard", FlashcardSchema);
