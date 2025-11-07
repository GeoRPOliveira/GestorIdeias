import mongoose from "mongoose";

const voteSchema = new mongoose.Schema(
  {
    ideaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Idea",      
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",  
      required: true,
    },
    type: {
      type: String,
      enum: ["like", "dislike"], 
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);

voteSchema.index({ ideaId: 1, userId: 1 }, { unique: true });

const Vote = mongoose.model("Vote", voteSchema);
export default Vote;
