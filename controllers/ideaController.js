import Idea from "../models/Idea.js";
import Vote from "../models/Vote.js";

const ideaController = {
  async showIdeas(req, res) {
    try {
      const ideas = await Idea.find().sort({ createdAt: -1 }).lean();

      for (let idea of ideas) {
        const totalVotes = await Vote.countDocuments({ ideaId: idea._id });
        idea.totalVotes = totalVotes;
      }

      res.render("ideas/list", { ideas });
    } catch (err) {
      console.error("Erro ao listar ideias:", err);
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
      });

      console.log("NOVA IDEIA: ",newIdea);

      await newIdea.save();
      res.redirect("/ideas");
    } catch (err) {
      console.error("❌ Erro ao criar ideia:", err);
      res.status(500).send("Erro ao criar ideia.");
    }
  },

  async ideaDetails(req, res) {
    try {
      const { id } = req.params;

      const idea = await Idea.findById(id)
        .populate("author", "username")
        .lean();

      if (!idea) return res.status(404).send("Ideia não encontrada.");

      const totalVotes = await Vote.countDocuments({ ideaId: id });

      res.render("ideas/details", { idea, totalVotes });
    } catch (err) {
      console.error("❌ Erro ao carregar detalhes da ideia:", err);
      res.status(500).send("Erro ao carregar detalhes da ideia.");
    }
  },
};

export default ideaController;
