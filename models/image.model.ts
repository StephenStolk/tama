import mongoose, { Document, Schema } from "mongoose";

interface IImage extends Document {
    title: string;
    type: "image";
    imageUrl: string;
    author: mongoose.Schema.Types.ObjectId;
    slug: string;
    tags: string[];
    views: number;
    score: number;
    createdAt: Date;
    updatedAt: Date;
}

const ImageSchema = new Schema<IImage>(
  {
    title: { type: String, required: true },
    type: {
      type: String,
      default: "image",
      required: true,
    },
    imageUrl: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    slug: { type: String, required: true, unique: true, index: true},
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

ImageSchema.index({ createdAt: -1 });
//ImageSchema.index({ slug: 1 });
ImageSchema.index({ tags: 1 });
ImageSchema.index({ author: 1 });

const Image = mongoose.models.Image || mongoose.model<IImage>("Image", ImageSchema);
export default Image;
