import express from "express";
import exphbs from "express-handlebars";
import authRoutes from "./routes/authRoutes.js";
import ideaRoutes from "./routes/ideaRoutes.js";
import voteRoutes from "./routes/voteRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./db/conn.js";
import session from "express-session";
import dotenv from "dotenv";
import helmet from "helmet";
import MongoStore from "connect-mongo";
import { errorHandler } from "./middlewares/errorHandler.js";

dotenv.config();

const app = express();
const PORT = 3000;
const secretSession = process.env.SECRET_SESSION;

app.use(helmet());

app.use(session({
  secret: secretSession,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URL,
    dbName: "idea_manager",
    collectionName: "sessions"
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 
  }
}));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Disponibiliza o user para todas as views
app.use((req, res, next) => {
  console.log(">>> Sessão atual:", req.session.user);
  res.locals.user = req.session.user || null;
  next();
});

app.use(express.static(path.join(__dirname, "public")));

app.engine(
  "handlebars",
  exphbs.engine({
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "views/layouts"),
  })
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use("/", authRoutes);
app.use("/ideas", ideaRoutes);
app.use("/votes", voteRoutes);

app.get("/", (req, res) => res.redirect("/login"));

app.use(errorHandler);

connectDB();

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
