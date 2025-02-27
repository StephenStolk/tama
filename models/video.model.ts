import mongoose, { Document, Schema } from "mongoose";

interface IVideo extends Document {
  title: string;
  type: "video";
  videoUrl: string;
  author: mongoose.Schema.Types.ObjectId;
  slug: string;
  tags: string[];
  views: number;
  score: number;
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
    slug: { type: String, required: true, unique: true, index: true },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: (tags: string[]) => tags.length <= 2,
        message: "You can select upto 2 tags only.",
      },
    },
    views: { type: Number, default: 0 },
    score: {type: Number, default: 0},

  },
  { timestamps: true }
);

VideoSchema.index({ createdAt: -1 });
//VideoSchema.index({ slug: 1 });
VideoSchema.index({ tags: 1 });
VideoSchema.index({ author: 1 });

const Video = mongoose.models.Video || mongoose.model<IVideo>("Video", VideoSchema);
export default Video;
