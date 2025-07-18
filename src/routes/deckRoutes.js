const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const deckController = require("../controllers/deckController");
const verifyJWT = require("../middlewares/auth");

router.use(verifyJWT);

router.post("/", [
  body("name").notEmpty().withMessage("O nome do deck é obrigatório"),
], deckController.create);

router.get("/", deckController.getAllForUser);

router.get("/:id", deckController.getById);

router.patch("/:id", [
  body("name").optional().notEmpty().withMessage("O nome do deck não pode ser vazio"),
  body("description").optional(),
], deckController.update);

router.delete("/:id", deckController.remove);

module.exports = router;