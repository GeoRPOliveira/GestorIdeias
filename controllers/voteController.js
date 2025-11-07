import Idea from "../models/Idea.js"; // modelo da ideia
import User from "../models/User.js"; // modelo do usuário (se precisar validar)
import mongoose from "mongoose";

const voteController = {
  // Registrar um voto em uma ideia
  async voteIdea(req, res) {
    try {
      const { id } = req.params; // ID da ideia
      const userId = req.session.userId; // ID do usuário logado

      // Verifica se a ideia existe
      const idea = await Idea.findById(id);
      if (!idea) {
        return res.status(404).send("Ideia não encontrada.");
      }

      // Se o usuário já votou, impede voto duplicado
      if (idea.votes.includes(userId)) {
        return res.redirect(`/ideas/${id}`);
      }

      // Adiciona o voto
      idea.votes.push(userId);
      await idea.save();

      console.log(`✅ Usuário ${userId} votou na ideia ${id}`);
      res.redirect(`/ideas/${id}`);
    } catch (err) {
      console.error("❌ Erro ao votar:", err);
      res.status(500).send("Erro ao registrar voto.");
    }
  },

  // Remover um voto (caso queira permitir "desvotar")
  async unvoteIdea(req, res) {
    try {
      const { id } = req.params;
      const userId = req.session.userId;

      const idea = await Idea.findById(id);
      if (!idea) {
        return res.status(404).send("Ideia não encontrada.");
      }

      // Remove o voto do array
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

  // Listar as ideias que o usuário votou
  async listUserVotes(req, res) {
    try {
      const userId = req.session.userId;

      // Encontra ideias em que o usuário votou
      const votedIdeas = await Idea.find({ votes: userId });

      res.render("votes/myVotes", { votedIdeas });
    } catch (err) {
      console.error("❌ Erro ao listar votos:", err);
      res.status(500).send("Erro ao carregar seus votos.");
    }
  },
};

export default voteController;
