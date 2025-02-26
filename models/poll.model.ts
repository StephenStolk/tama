import mongoose, { Schema, Document } from "mongoose";

interface IPoll extends Document {
    title: string;
    type: "poll";
    pollOptions?: {
        option: string;
        votes: number;
    }[];
    author: mongoose.Schema.Types.ObjectId | unknown;
    slug: string;
    tags: string[];
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
        slug: { type: String, required: true, unique: true },
        tags: {
            type: [String],
            default: [],
            validate: {
                validator: (tags: string[]) => tags.length <= 2,
                message: "You can select up to 2 tags only.",
            },
        },
    },
    { timestamps: true }
);

// Use `mongoose.models` to check if the model already exists
const Poll = mongoose.models.Poll || mongoose.model<IPoll>("Poll", PollSchema);

export default Poll;
