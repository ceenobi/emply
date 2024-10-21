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
  },
  {
    timestamps: true,
  }
);

// deptSchema.pre("save", function (next) {
//   if (this.isNew && this.dept.length === 0) {
//     this.dept = [
//       { name: "human resources" },
//       { name: "facility" },
//       { name: "marketing" },
//       { name: "products" },
//     ];
//   }
//   next();
// });

const Dept = mongoose.models.Dept || model("Dept", deptSchema);

export default Dept;
