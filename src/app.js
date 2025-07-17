const express = require("express");
const mongoose = require("mongoose");
const morgan = require('morgan')
const compression = require('compression');
const userRoutes = require("./routes/userRoutes");
const deckRoutes = require("./routes/deckRoutes");
const flashcardRoutes = require("./routes/flashcardRoutes");
const errorHandler = require("./middlewares/errorHandler");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./docs/swagger.json");

const app = express();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => console.error("Error connecting to MongoDB:", err));

app.use(express.json());
app.use(morgan('dev')); 
app.use(compression());

app.use("/api/usuarios", userRoutes);
app.use("/api/decks", deckRoutes);
app.use("/api/decks/:deckId/cards", flashcardRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(errorHandler);

module.exports = app;
