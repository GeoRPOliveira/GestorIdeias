import express from "express";
import voteController from "../controllers/voteController.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const router = express.Router();

router.post("/:ideaId", isLoggedIn, voteController.voteIdea);

router.get("/my-votes", isLoggedIn, voteController.listUserVotes);

export default router;
