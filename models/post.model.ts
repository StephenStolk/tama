import mongoose, { Schema, Document } from "mongoose";

interface IPost extends Document {
  title: string;
  type: "text" | "image" | "video" | "poll" | "link";
  content?: string;
  media?: string[]; // Array of URLs for images, GIFs, or videos
  pollOptions?: { option: string; votes: number }[];
  linkUrl?: string;
  author: mongoose.Schema.Types.ObjectId;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ["text", "image", "video", "poll", "link"], required: true },
    content: { type: String },
    media: { type: [String], default: [] },
    pollOptions: [
      {
        option: { type: String },
        votes: { type: Number, default: 0 },
      },
    ],
    linkUrl: { type: String },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    slug: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export default mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);
