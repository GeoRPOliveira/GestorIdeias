// config/conn.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export async function connectDB() {
  try {
    const mongoURI = process.env.MONGO_URL;

    if (!mongoURI) {
      throw new Error("❌ MONGO_URI não definida no arquivo .env");
    }

    await mongoose.connect(mongoURI); // opções removidas

    console.log("✅ Conectado ao MongoDB!");

    // Seleciona o database específico
    const db = mongoose.connection.useDb("idea_manager");

    console.log("📂 Database selecionado: idea_manager");

    return db;
  } catch (err) {
    console.error("❌ Erro ao conectar ao MongoDB:", err.message);
    process.exit(1);
  }
}
