import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  senhaHash: { type: String, required: true },
  criadoEm: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
export default User;
