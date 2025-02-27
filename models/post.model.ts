import mongoose, { Schema, Document } from "mongoose";

interface IPost extends Document {
  title: string;
  content: string;
  imageUrl?: string;
  author: mongoose.Types.ObjectId; 
  slug: string;
  tags: string[];
  views: number;
  score: number;
  createdAt: Date;
  updatedAt: Date;
}

//mongoose.Schema.Types.ObjectId;

const PostSchema = new Schema<IPost>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String, default: null }, // Optional image
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  slug: { type: String, required: true, unique: true, index: true},
  tags: {
    type: [String],
    default: [],
    validate: {
        validator: (tags: string[]) => tags.length <=2,
        message: "You can select upto 2 tags only.",
    },
},
views: { type: Number, default: 0 },
score: {type: Number, default: 0},
}, {timestamps: true});

PostSchema.index({ createdAt: -1 }); 
//PostSchema.index({ slug: 1 }); 
PostSchema.index({ tags: 1 }); 
PostSchema.index({ author: 1 }); 


const Post = mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);
export default Post;
