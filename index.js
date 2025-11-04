  // index.js
  import express from "express";
  import exphbs from "express-handlebars";
  import authRoutes from "./routes/authRoutes.js";
  import ideaRoutes from "./routes/ideaRoutes.js";
  import path from "path";
  import { fileURLToPath } from "url";
  import { connectDB } from "./db/conn.js";

  // Configuração do __dirname para ES Modules
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const app = express();
  const PORT = 3000;

  // Middlewares para processar JSON e forms
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // Arquivos estáticos
  app.use(express.static(path.join(__dirname, "public")));

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

  // Rotas
  app.use("/ideas", ideaRoutes);
  app.use("/login", authRoutes);

  // Redireciona raiz para login
  app.get("/", (req, res) => res.redirect("/login"));

  connectDB();

  // Inicia servidor
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
