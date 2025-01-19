import mongoose, { Document, Schema } from "mongoose";

interface IPost extends Document {
  title: string;
  content: string;
  author: mongoose.Types.ObjectId;
  createdAt: Date;
}

const PostSchema = new Schema<IPost>({
  title: { type: String, required: true, minlength: 5 },
  content: { type: String, required: true, minlength: 20 },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

const Post = mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);

export default Post;
