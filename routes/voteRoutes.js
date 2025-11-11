import express from "express";
import voteController from "../controllers/voteController.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const router = express.Router();

router.use((req, res, next) => {
  console.log(`🛰️ [voteRoutes] ${req.method} ${req.originalUrl}`);
  next();
});

console.log("✅ voteRoutes carregado!");

router.post("/:ideaId", isLoggedIn, voteController.voteIdea);

router.post("/:ideaId/vote", isLoggedIn, voteController.voteIdea);

router.get("/my-votes", isLoggedIn, voteController.listUserVotes);

export default router;
