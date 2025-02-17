import mongoose, { Document, Schema} from "mongoose";

interface IVideo extends Document {
    title: string;
        type: "video";
        videoUrl: string;
        author: mongoose.Schema.Types.ObjectId;
        slug: string;
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
    videoUrl: { type: String, required: true},
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    slug: { type: String, required: true, unique: true },
  },
  { timestamps: true }
)

export default mongoose.model<IVideo>("Video", VideoSchema);