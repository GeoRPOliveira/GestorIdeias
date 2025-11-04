// index.js
import express from "express";
import exphbs from "express-handlebars";
import authRoutes from "./routes/authRoutes.js";
import ideaRoutes from "./routes/ideaRoutes.js";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import MongoStore from "connect-mongo"; // ✅ para salvar sessão no MongoDB
import { isLoggedIn } from "./middlewares/isLoggedIn.js"; // ✅ middleware de login

// Configuração do __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Configuração do Handlebars
app.engine(
  "handlebars",
  exphbs.engine({
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "views/layouts"),
  })
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Middlewares para formulários
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// 🔐 Configuração de sessão
app.use(
  session({
    secret: "chave_secreta_segura_aqui",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: "mongodb://localhost:27017/gestorideias",
      collectionName: "sessions",
    }),
    cookie: { secure: false }, // true se HTTPS
  })
);

// 🔹 Rotas
app.use("/login", authRoutes);

// ✅ Protege as rotas de ideias com middleware isLoggedIn
app.use("/ideas", isLoggedIn, ideaRoutes);

// Redireciona raiz para login
app.get("/", (req, res) => res.redirect("/login"));

// 🔓 Logout (opcional)
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) console.error(err);
    res.redirect("/login");
  });
});

// Conecta ao MongoDB
mongoose
  .connect("mongodb://localhost:27017/gestorideias", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB conectado!"))
  .catch((err) => console.error("Erro ao conectar MongoDB:", err));

// Inicia servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
