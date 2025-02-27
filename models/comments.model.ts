import mongoose, { Schema, Document } from "mongoose";

// Interface for Comments
interface IComment extends Document {
  author: mongoose.Schema.Types.ObjectId;
  postId: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
}

// Define Comment Schema
const CommentSchema = new Schema<IComment>({
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  postId: { type: Schema.Types.ObjectId, required: true }, // ✅ Works for all post types
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Check if the model already exists, if not, create it
const Comment = mongoose.models.Comment || mongoose.model<IComment>("Comment", CommentSchema);

export { Comment };
