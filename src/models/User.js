const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, "Nome é obrigatório."],
    trim: true
  },
  email: { 
    type: String, 
    required: [true, "Email é obrigatório."], 
    unique: true,
  },
  password: { 
    type: String, 
    required: [true, "Senha é obrigatória."],
  }
});

module.exports = mongoose.model("User", UserSchema);