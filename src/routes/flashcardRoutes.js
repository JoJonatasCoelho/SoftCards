const express = require("express");
const { body } = require("express-validator");
const router = express.Router({ mergeParams: true });
const flashcardController = require("../controllers/flashcardController");
const verifyJWT = require("../middlewares/auth");

router.use(verifyJWT);
router.post("/", [
    body("question").notEmpty().withMessage("A pergunta é obrigatória"),
    body("answer").notEmpty().withMessage("A resposta é obrigatória"),
], flashcardController.create);

router.get("/", flashcardController.getAllFromDeck);

router.patch("/:cardId", [
    body("question").optional().notEmpty().withMessage("A pergunta não pode ser vazia"),
    body("answer").optional().notEmpty().withMessage("A resposta não pode ser vazia"),
], flashcardController.update);

router.delete("/:cardId", flashcardController.remove);

module.exports = router;
