import mongoose, { Schema, model } from "mongoose";

const eventSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    photo: {
      type: String,
    },
    location: {
      type: String,
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
      enum: ["ongoing", "ended", "cancelled", "postponed", "upcoming"],
      index: "text",
    },
    time: {
      type: String,
      validate: {
        validator: function (v) {
          return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v); // HH:mm format
        },
        message: (props) => `${props.value} is not a valid time format!`,
      },
    },
    members:  {
        type: [Schema.Types.ObjectId],
        ref: "User",
        default: [],
      },
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.models.Event || model("Event", eventSchema);

export default Event;
