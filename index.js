// index.js
import express from "express";
import exphbs from "express-handlebars";
import authRoutes from "./routes/authRoutes.js";
import ideaRoutes from "./routes/ideaRoutes.js";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

// Configuração do __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use("/ideas", ideaRoutes);

// Configuração do Handlebars
app.engine(
  "handlebars",
  exphbs.engine({
    defaultLayout: "main", // nome do layout padrão
    layoutsDir: path.join(__dirname, "views/layouts"), // pasta onde ficam os layouts
  })
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views")); // pasta raiz das views

// Middlewares para processar dados de formulários
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rotas
app.use("/login", authRoutes);

// Redireciona raiz para login
app.get("/", (req, res) => res.redirect("/login"));

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
