import mongoose, { Schema, type Document } from "mongoose"

export interface IBugReport extends Document {
  title: string
  description: string
  status: "open" | "in-progress" | "resolved" | "closed"
  createdAt: Date
  updatedAt: Date
  userId?: string
  userEmail?: string
}

const BugReportSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title for the bug report"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please provide a description of the bug"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["open", "in-progress", "resolved", "closed"],
      default: "open",
    },
    userId: {
      type: String,
      required: false,
    },
    userEmail: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  },
)

// Check if the model is already defined to prevent overwriting during hot reloads
export default mongoose.models.BugReport || mongoose.model<IBugReport>("BugReport", BugReportSchema)

