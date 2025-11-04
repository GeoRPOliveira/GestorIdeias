import express from "express";
import authController from "../controllers/authController.js";

const router = express.Router();


// Rota GET para abrir o formulário de login
router.get("/", (req, res) => {
  res.render("auth/login");
});

// Rota POST para fazer login
router.post("/login", authController.login);

// Rota GET para abrir o formulário de registro
router.get("/register", (req, res) => {
  res.render("auth/register");
});

// Rota POST para registrar ou fazer login
router.post("/register", authController.register);

export default router;