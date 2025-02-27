import mongoose, {Schema, Document} from "mongoose";

interface IPoll extends Document {
    title: string;
    type: "poll";
    pollOptions?: {
        option: string,
        votes: number
    }[];
    author: mongoose.Schema.Types.ObjectId | unknown;
    slug: string;
    tags: string[];
    views: number;
    score: number;
    createdAt: Date;
    updatedAt: Date;
}

const PollSchema = new Schema<IPoll>(
    {
        title: { type: String, required: true },
    type: {
        type: String,
        default: "poll",
        required: true
    },
    pollOptions: [
      {
        option: { type: String },
        votes: { type: Number, default: 0 },
      },
    ],
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    slug: { type: String, required: true, unique: true , index: true},
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

  },
  { timestamps: true }
)

PollSchema.index({ createdAt: -1 }); 
PollSchema.index({ tags: 1 }); 
//PollSchema.index({ slug: 1 }); 
PollSchema.index({ author: 1 }); 


const Poll = mongoose.models.Poll || mongoose.model<IPoll>("Poll", PollSchema);
export default Poll;