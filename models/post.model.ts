import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
  title: string;
  content: string;
  imageUrl?: string;
  author: mongoose.Types.ObjectId;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String, default: null }, // Optional image
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  slug: { type: String, required: true, unique: true },
}, {timestamps: true});

const Post = mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);
export default Post;
