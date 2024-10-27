import mongoose, { Schema, model } from "mongoose";

const deptSchema = new Schema(
  {
    photo: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    supervisor: {
      type: String,
      required: true,
    },
    supervisorEmployeeId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Dept = mongoose.models.Dept || model("Dept", deptSchema);

export default Dept;
