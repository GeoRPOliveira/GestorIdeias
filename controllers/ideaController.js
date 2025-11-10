import Idea from "../models/Idea.js";

const ideaController = {
  async showIdeas(req, res) {
    try {
      const ideas = await Idea.find().sort({ createdAt: -1 }).lean();
      res.render("ideas/list", { ideas });
    } catch (err) {
      console.error(err);
      res.status(500).send("Erro ao carregar ideias.");
    }
  },

  createIdea(req, res) {
    res.render("ideas/create");
  },

  async saveIdea(req, res) {
    try {
      const { title, description, category } = req.body;

      const newIdea = new Idea({
        title,
        description,
        category,
        author: req.user?._id || null,
      });

      await newIdea.save();
      res.redirect("/ideas");
    } catch (err) {
      console.error(err);
      res.status(500).send("Erro ao criar ideia.");
    }
  },

  async ideaDetails(req, res) {
    try {
      const { id } = req.params;

      const idea = await Idea.findById(id)
        .populate("author", "username")
        .lean();

      if (!idea) return res.status(404).send("Ideia não encontrada");

      res.render("ideas/details", { idea });
    } catch (err) {
      console.error(err);
      res.status(500).send("Erro ao carregar detalhes da ideia.");
    }
  },
};

export default ideaController;
