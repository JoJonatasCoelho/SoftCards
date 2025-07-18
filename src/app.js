const express = require("express");
const helmet = require("helmet");
const morgan = require('morgan')
const rateLimit = require("express-rate-limit");
const compression = require('compression');
const userRoutes = require("./routes/userRoutes");
const deckRoutes = require("./routes/deckRoutes");
const flashcardRoutes = require("./routes/flashcardRoutes");
const errorHandler = require("./middlewares/errorHandler");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./docs/swagger.json");

const app = express();

app.use(helmet());
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100,
	standardHeaders: true,
	legacyHeaders: false,
    message: "Muitas requisições feitas a partir deste IP, por favor, tente novamente após 15 minutos."
});
app.use(express.json());
app.use(morgan('dev')); 
app.use(compression());
app.use('/api', limiter);
app.use("/api/users", userRoutes);
app.use("/api/decks", deckRoutes);
app.use("/api/decks/:deckId/cards", flashcardRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(errorHandler);

module.exports = app;
