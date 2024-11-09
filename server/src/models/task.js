import mongoose, { Schema, model } from "mongoose";

const taskSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      index: "text",
    },
    description: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["planned", "completed", "inprogress", "postponed"],
      required: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    members: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.models.Task || model("Task", taskSchema);

export default Task;
