import mongoose, { Document, Schema } from "mongoose";

interface IVideo extends Document {
  title: string;
  type: "video";
  videoUrl: string;
  author: mongoose.Schema.Types.ObjectId;
  slug: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const VideoSchema = new Schema<IVideo>(
  {
    title: { type: String, required: true },
    type: {
      type: String,
      default: "video",
      required: true,
    },
    videoUrl: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    slug: { type: String, required: true, unique: true },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: (tags: string[]) => tags.length <= 2,
        message: "You can select upto 2 tags only.",
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model<IVideo>("Video", VideoSchema);
