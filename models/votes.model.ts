import mongoose, { Document, Schema } from "mongoose";

export interface IVote extends Document {
    author: mongoose.Schema.Types.ObjectId;
    postId: mongoose.Types.ObjectId;
    voteType: "upvote" | "downvote";
    createdAt: Date;
}

const VoteSchema = new Schema<IVote>({
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    postId: { type: Schema.Types.ObjectId, required: true },
    voteType: { type: String, enum: ["upvote", "downvote"], required: true },
    createdAt: { type: Date, default: Date.now },
})

export const Vote = mongoose.model<IVote>("Vote", VoteSchema);