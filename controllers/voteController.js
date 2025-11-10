import Vote from "../models/Vote.js";

const voteController = {
  async voteIdea(req, res) {
    try {
      const { ideaId } = req.params;
      const { type } = req.body;
      const userId = req.session.userId;

      // Evita votos duplicados
      let vote = await Vote.findOne({ ideaId, userId });

      if (vote) {
        vote.type = type; // atualiza se tipo diferente
        await vote.save();
      } else {
        vote = await Vote.create({ ideaId, userId, type });
      }

      // Retorna votos atualizados com usernames
      const votes = await Vote.find({ ideaId }).populate("userId", "username").lean();
      const likes = votes.filter(v => v.type === "like").map(v => v.userId.username);
      const dislikes = votes.filter(v => v.type === "dislike").map(v => v.userId.username);

      res.json({ message: "Voto computado!", likes, dislikes });
    } catch (err) {
      console.error("Erro ao registrar voto:", err);
      res.status(500).json({ message: "Erro ao registrar voto" });
    }
  },

  async listUserVotes(req, res) {
    try {
      const userId = req.session.userId;

      const votedIdeas = await Vote.find({ userId }).populate("ideaId").lean();

      res.render("votes/myVotes", { votedIdeas });
    } catch (err) {
      console.error("Erro ao listar votos:", err);
      res.status(500).send("Erro ao carregar seus votos.");
    }
  },
};

export default voteController;
