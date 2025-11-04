import User from "../models/User.js";
import bcrypt from "bcryptjs"; 

const authController = {
  async register(req, res) {
    try {
      const { nome, username, email, password } = req.body;

      const existingUser = await User.findOne({ $or: [{ email }, { username }] });
      if (existingUser) {
        return res.status(400).send("Usuário ou email já existe!");
      }

      const salt = await bcrypt.genSalt(10);
      const senhaHash = await bcrypt.hash(password, salt);

      const newUser = new User({ nome, username, email, senhaHash });
      await newUser.save();

      res.redirect("/ideas");
    } catch (err) {
      console.error(err);
      res.status(500).send("Erro ao registrar usuário.");
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).send("Email ou senha incorretos.");
      }

      const isMatch = await bcrypt.compare(password, user.senhaHash);
      if (!isMatch) {
        return res.status(400).send("Email ou senha incorretos.");
      }

      req.session.userId = user._id;

      res.redirect("/ideas");
    } catch (err) {
      console.error(err);
      res.status(500).send("Erro ao fazer login.");
    }
  },

};

export default authController;
