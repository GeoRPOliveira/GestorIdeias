import express from "express";
import voteController from "../controllers/voteController.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const router = express.Router();

// Votar em uma ideia (POST)
router.post("/:id/vote", isLoggedIn, voteController.voteIdea);

// Remover voto (se quiser implementar "desvotar")
router.post("/:id/unvote", isLoggedIn, voteController.unvoteIdea);

// Listar votos do usuário (opcional)
router.get("/my-votes", isLoggedIn, voteController.listUserVotes);

export default router;
