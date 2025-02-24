import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
  title: string;
  content: string;
  imageUrl?: string;
  author: mongoose.Types.ObjectId;
  slug: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String, default: null }, // Optional image
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  slug: { type: String, required: true, unique: true},
  tags: {
    type: [String],
    default: [],
    validate: {
        validator: (tags: string[]) => tags.length <=2,
        message: "You can select upto 2 tags only.",
    },
},
}, {timestamps: true});

PostSchema.index({ createdAt: -1 }); 
PostSchema.index({ slug: 1 }); 
PostSchema.index({ tags: 1 }); 
PostSchema.index({ author: 1 }); 


const Post = mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);
export default Post;
