import mongoose, { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    employeeId: {
      type: String,
      required: true,
      unique: true,
    },
    photo: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    address: {
      homeAddress: { type: String },
      state: { type: String },
      country: { type: String },
    },
    bio: {
      type: String,
      default: "Nothing to see here",
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    phone: {
      type: String,
      unique: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    maritalStatus: {
      type: String,
      enum: ["single", "married", "divorced", "widowed"],
    },
    dept: {
      type: String,
      enum: ["human resources", "operations", "marketing", "products"],
    },
    jobType: {
      type: String,
      enum: ["full-time", "part-time", "contract", "hybrid", "remote"],
      default: "full-time",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "leave", "sick", "other"],
      default: "active",
    },
    jobTitle: {
      type: String,
      enum: [
        "Web developer",
        "Customer service",
        "Student laison",
        "Facility manager",
        "Utility",
        "Social media handler",
        "Head of Products",
        "HR manager",
        "UI/UX designer",
        "Data scientist",
      ],
    },
    role: {
      type: String,
      enum: ["user", "admin", "super-admin"],
      default: "user",
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordTokenExpires: {
      type: Date,
    },
    verificationToken: {
      type: String,
    },
    verificationTokenExpires: {
      type: Date,
    },
    leaveCount: {
      type: Number,
      default: 20,
    },
    salary: {
      type: Number,
    },
    allowance: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.User || model("User", userSchema);

export default User;
