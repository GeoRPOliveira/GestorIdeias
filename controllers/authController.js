import User from "../models/User.js";
import bcrypt from "bcryptjs";

const authController = {
  // Registrar novo usuário
  async register(req, res) {
    try {
      const { name, username, email, password } = req.body;

      // Verifica se usuário ou email já existe
      const existingUser = await User.findOne({ $or: [{ email }, { username }] });
      if (existingUser) {
        return res.status(400).send("Usuário ou email já existe!");
      }

      // Cria hash da senha
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // Cria novo usuário
      const newUser = new User({
        name,
        username,
        email,
        passwordHash,
        createdAt: Date.now(),
      });

      await newUser.save();

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

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).send("Email ou senha incorretos.");
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
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

  logout(req, res) {
    req.session.destroy(() => {
      res.redirect("/login");
    });
  }
};

export default authController;