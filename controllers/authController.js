import User from "../models/User.js";
import bcrypt from "bcryptjs";        // Para hash de senha

const authController = {
  // Registrar novo usuário
  async register(req, res) {
    try {
      const { nome, username, email, password } = req.body;

      // Verifica se usuário ou email já existe
      const existingUser = await User.findOne({ $or: [{ email }, { username }] });
      if (existingUser) {
        return res.status(400).send("Usuário ou email já existe!");
      }

      // Cria hash da senha
      const salt = await bcrypt.genSalt(10);
      const senhaHash = await bcrypt.hash(password, salt);

      // Cria novo usuário
      const newUser = new User({ nome, username, email, senhaHash });
      await newUser.save();

      // Redireciona para /ideas após registro
      res.redirect("/ideas");
    } catch (err) {
      console.error(err);
      res.status(500).send("Erro ao registrar usuário.");
    }
  },

  // Login de usuário
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Verifica se o usuário existe
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).send("Email ou senha incorretos.");
      }

      // Verifica a senha
      const isMatch = await bcrypt.compare(password, user.senhaHash);
      if (!isMatch) {
        return res.status(400).send("Email ou senha incorretos.");
      }

      // Redireciona para /ideas após login
      res.redirect("/ideas");
    } catch (err) {
      console.error(err);
      res.status(500).send("Erro ao fazer login.");
    }
  },
};

export default authController;
