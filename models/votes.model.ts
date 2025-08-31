import mongoose, { Document, Schema } from "mongoose";

interface IVote extends Document {
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
});

// Indexing for optimized queries
VoteSchema.index({ postId: 1, author: 1 }, { unique: true }); // Prevent duplicate votes
VoteSchema.index({ createdAt: -1 }); // Speed up fetching latest votes
VoteSchema.index({ postId: 1, voteType: 1 }); // Optimize vote aggregation

const Vote =  mongoose.models.Vote || mongoose.model<IVote>("Vote", VoteSchema);

export default Vote;