require("dotenv").config();
const mongoose = require("mongoose");

const app = require("./src/app");
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => console.error("Error connecting to MongoDB:", err));

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
