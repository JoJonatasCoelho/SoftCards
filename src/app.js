const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
var morgan = require('morgan')
const errorHandler = require("./middlewares/errorHandler");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./docs/swagger.json");

const app = express();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectado"))
  .catch(err => console.error("Erro na conexão com MongoDB:", err));

app.use(express.json());
app.use(morgan('dev')); 
app.use("/api/usuarios", userRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(errorHandler);

module.exports = app;
