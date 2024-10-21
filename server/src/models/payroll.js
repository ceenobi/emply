import mongoose, { Schema, model } from "mongoose";

const payrollSchema = new Schema(
  {
    comment: {
      type: [String],
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paymentDate: {
      type: Date,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    payrollId: {
      type: String,
      required: true,
    },
    employeeId: {
      type: String,
      required: true,
    },
    salary: {
      type: Number,
      required: true,
    },
    allowance: {
      type: Number,
    },
    deductions: {
      type: Number,
    },
    tax: {
      type: Number,
      required: true,
    },
    net: {
      type: Number,
      required: true,
    },
    lateDays: {
      type: Number,
      required: true,
      default: 0,
    },
    lwp: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["paid", "pending"],
      default: "pending",
    },
    payrollDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Payroll = mongoose.models.Payroll || model("Payroll", payrollSchema);

export default Payroll;

// const createPayrollSchema = new Schema(
//   {
//     payrollDate: {
//       type: Date,
//       required: true,
//     },
//     details: {
//       type: Schema.Types.ObjectId,
//       ref: "Payroll",
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// const CreatePayroll =
//   mongoose.models.CreatePayroll || model("CreatePayroll", createPayrollSchema);

// frequency: {
//       type: String,
//       enum: ["daily", "weekly", "bi-weekly", "monthly"],
//       required: true,
//     },
//     nextPaymentDate: {
//       type: Date,
//       required: true,
//     },
//     endDate: {
//       type: Date,
//     },
