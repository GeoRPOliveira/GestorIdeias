import Idea from "../models/Idea.js";

const ideaController = {
  // Listar todas as ideias
  async showIdeas(req, res) {
    try {
      const ideas = await Idea.find().populate("autor", "username").sort({ criadoEm: -1 });
      res.render("ideas/list", { ideas });
    } catch (err) {
      console.error(err);
      res.status(500).send("Erro ao carregar ideias.");
    }
  },

  // Renderizar formulário de criação
  createIdea(req, res) {
    res.render("ideas/create");
  },

  // Salvar nova ideia
  async saveIdea(req, res) {
    try {
      const { titulo, descricao, categoria } = req.body;

      const newIdea = new Idea({
        titulo,
        descricao,
        categoria,
        autor: req.user?._id || null, // usar usuário logado
      });

      await newIdea.save();
      res.redirect("/ideas");
    } catch (err) {
      console.error(err);
      res.status(500).send("Erro ao criar ideia.");
    }
  },

  // Detalhes de uma ideia
  async ideaDetails(req, res) {
    try {
      const { id } = req.params;
      const idea = await Idea.findById(id).populate("autor", "username");
      if (!idea) return res.status(404).send("Ideia não encontrada");

      res.render("ideas/details", { idea });
    } catch (err) {
      console.error(err);
      res.status(500).send("Erro ao carregar detalhes da ideia.");
    }
  },
};

export default ideaController;
