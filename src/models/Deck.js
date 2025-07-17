const mongoose = require("mongoose");

const DeckSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "O nome do deck é obrigatório."],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Deck", DeckSchema);
