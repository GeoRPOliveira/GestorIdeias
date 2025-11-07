import express from "express";
import ideaController from "../controllers/ideaController.js";

const router = express.Router();

// Listar todas as ideias
router.get("/", ideaController.showIdeas);

// Página de criação de nova ideia
router.get("/create", ideaController.createIdea);

// Receber os dados do formulário e salvar a ideia
router.post("/create", ideaController.saveIdea);

// Detalhes de uma ideia específica
router.get("/:id", ideaController.ideaDetails);

router.get("", ideaController.showIdeas)

export default router;
