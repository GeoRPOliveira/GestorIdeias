import express from "express";
import Vote from "../models/Vote.js";

const router = express.Router();

router.post("/:ideaId", async (req, res) => {
  const { ideaId } = req.params;
  const { type } = req.body;
  const userId = req.session.userId;

  try {
    // Evita que o mesmo usuário vote duas vezes do mesmo tipo
    const existingVote = await Vote.findOne({ ideaId, userId });
    if (existingVote) {
      // Atualiza o tipo caso seja diferente
      if (existingVote.type !== type) {
        existingVote.type = type;
        await existingVote.save();
      }
    } else {
      const newVote = new Vote({ ideaId, userId, type });
      await newVote.save();
    }

    const likes = await Vote.countDocuments({ ideaId, type: "like" });
    const dislikes = await Vote.countDocuments({ ideaId, type: "dislike" });

    res.json({ message: "Voto computado!", likes, dislikes });
    console.log("userId:", userId, "ideaId:", ideaId, "type:", type);
  } catch (error) {
    console.error("Erro ao registrar voto:", error);
    res.status(500).json({ message: "Erro ao registrar voto" });
  }
});

export default router;
