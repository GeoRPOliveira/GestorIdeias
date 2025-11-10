import Idea from "../models/Idea.js";

const voteController = {
  async voteIdea(req, res) {
    try {
      const { id } = req.params;
      const userId = req.session.userId; 

      const idea = await Idea.findById(id);
      if (!idea) {
        return res.status(404).send("Ideia não encontrada.");
      }

      if (idea.votes.includes(userId)) {
        return res.redirect(`/ideas/${id}`);
      }

      idea.votes.push(userId);
      await idea.save();

      console.log(`✅ Usuário ${userId} votou na ideia ${id}`);
      res.redirect(`/ideas/${id}`);
    } catch (err) {
      console.error("❌ Erro ao votar:", err);
      res.status(500).send("Erro ao registrar voto.");
    }
  },

  async unvoteIdea(req, res) {
    try {
      const { id } = req.params;
      const userId = req.session.userId;

      const idea = await Idea.findById(id);
      if (!idea) {
        return res.status(404).send("Ideia não encontrada.");
      }

      idea.votes = idea.votes.filter(
        (voterId) => voterId.toString() !== userId.toString()
      );

      await idea.save();

      console.log(`🔄 Usuário ${userId} removeu voto da ideia ${id}`);
      res.redirect(`/ideas/${id}`);
    } catch (err) {
      console.error("❌ Erro ao remover voto:", err);
      res.status(500).send("Erro ao remover voto.");
    }
  },

  async listUserVotes(req, res) {
    try {
      const userId = req.session.userId;

      const votedIdeas = await Idea.find({ votes: userId });

      res.render("votes/myVotes", { votedIdeas });
    } catch (err) {
      console.error("Erro ao listar votos:", err);
      res.status(500).send("Erro ao carregar seus votos.");
    }
  },
};

export default voteController;
