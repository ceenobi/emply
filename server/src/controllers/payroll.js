import createHttpError from "http-errors";
import Payroll from "../models/payroll.js";
import User from "../models/user.js";
import { createPayroll, updatePayroll } from "../services/payroll.service.js";
import tryCatch from "../utils/tryCatchFn.js";
import { getMonthValue } from "../utils/generateRandomId.js";

// export const setPayrollDate = tryCatch(async (req, res, next) => {
//   const { payrollDate } = req.body;
//   if (!payrollDate) {
//     return next(createHttpError(400, "Please set a payroll date for payments"));
//   }
//   const existPayroll = await CreatePayroll.find({ payrollDate });
//   if (!existPayroll.payrollDate === payrollDate) {
//     return next(
//       createHttpError(404, "Payroll record for this date already created")
//     );
//   }
//   const payroll = await CreatePayroll.create({
//     payrollDate,
//   });
//   res.status(201).json({ payroll, msg: "Payroll date set!" });
// });

export const createEmployeePayroll = tryCatch(async (req, res, next) => {
  const {
    employeeId,
    salary,
    deductions,
    tax,
    allowance,
    lwp,
    lateDays,
    comment,
    payrollDate,
  } = req.body;
  if (!employeeId || !salary || !tax || !payrollDate) {
    return next(createHttpError(400, "Please fill the required fields"));
  }
  const user = await User.findOne({ employeeId: employeeId });
  if (!user) {
    return next(createHttpError(404, "User not found"));
  }
  const payrollUser = await Payroll.findOne({ employeeId });
  const getPayrollDate = await Payroll.findOne({ payrollDate });
  if (payrollUser && getPayrollDate) {
    return next(
      createHttpError(
        404,
        "Employee has already been added to the payroll date"
      )
    );
  }
  const payrollBody = {
    employeeId,
    salary,
    deductions,
    tax,
    allowance,
    lwp,
    lateDays,
    comment,
    payrollDate,
  };
  const payroll = await createPayroll(user, payrollBody);
  res.status(201).json({ payroll, msg: "Payroll created" });
});

export const getAllPayrolls = tryCatch(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skipCount = (page - 1) * limit;
  const count = await Payroll.countDocuments();
  const totalPages = Math.ceil(count / limit);
  const payrolls = await Payroll.find()
    .populate("userId", "photo firstName lastName")
    .lean()
    .sort({ _id: -1 })
    .skip(skipCount)
    .limit(limit);
  if (!payrolls) {
    return next(createHttpError(400, "No payroll found"));
  }
  const getPayrollNetpay = payrolls.reduce((acc, curr) => acc + curr.net, 0);
  const getPayrollAllowance = payrolls.reduce(
    (acc, curr) => acc + curr.allowance,
    0
  );
  const getPayrollDeductions = payrolls.reduce(
    (acc, curr) => acc + curr.deductions,
    0
  );
  const getPayrollDates = payrolls.map((date) => date.payrollDate);
  const getPaymentDates = payrolls.map((date) => date.paymentDate);
  const data = {
    currentPage: page,
    totalPages,
    count,
    totalNetPay: getPayrollNetpay,
    totalAllowance: getPayrollAllowance,
    totalDeductions: getPayrollDeductions,
    payrollDate: getPayrollDates,
    paymentDate: getPaymentDates,
    payroll: payrolls,
  };
  res.status(200).json(data);
});

export const getAnEmployeePayroll = tryCatch(async (req, res, next) => {
  const { firstName, employeeId, payrollDate } = req.params;
  if (!firstName || !employeeId || !payrollDate) {
    return next(createHttpError(400, "Param values are required"));
  }
  const findPayroll = await Payroll.findOne({
    employeeId,
    payrollDate,
  }).populate("userId", "photo firstName lastName");
  if (!findPayroll) {
    return next(createHttpError(404, "Employee payroll not found"));
  }
  res.status(200).json(findPayroll);
});

export const editEmployeePayroll = tryCatch(async (req, res, next) => {
  const { firstName, employeeId, payrollDate } = req.params;
  const { salary, deductions, tax, allowance, lwp, lateDays, comment } =
    req.body;
  if (!firstName || !employeeId || !payrollDate) {
    return next(createHttpError(400, "Param values are required"));
  }
  const findPayroll = await Payroll.findOne({
    employeeId,
    payrollDate,
  });
  if (!findPayroll) {
    return next(createHttpError(404, "Employee payroll not found"));
  }
  const employeeBody = {
    salary,
    deductions,
    tax,
    allowance,
    lwp,
    lateDays,
    comment,
  };
  const updatedPayroll = await updatePayroll(findPayroll, employeeBody);
  res.status(200).json({ updatedPayroll, msg: "Payroll details updated" });
});

export const togglePayrollStatus = tryCatch(async (req, res, next) => {
  const { firstName, employeeId, payrollDate } = req.params;
  const { isPaid, comment } = req.body;
  if (!firstName || !employeeId || !payrollDate || !isPaid) {
    return next(createHttpError(400, "Param values are required"));
  }
  const findPayroll = await Payroll.findOne({
    employeeId,
    payrollDate,
  });
  if (!findPayroll) {
    return next(createHttpError(404, "Employee payroll not found"));
  }
  findPayroll.isPaid = isPaid === "true" ? true : false;
  findPayroll.status = "paid";
  findPayroll.paymentDate = new Date();
  findPayroll.comment =
    comment ||
    `Suceess, your salary for the month of ${getMonthValue()} has been paid`;
  await findPayroll.save();
  res.status(200).json({ findPayroll, msg: "Payroll status updated" });
});

export const getEmployeePayrollHistory = tryCatch(async (req, res, next) => {
  const userId = req.userId;
  const { firstName, employeeId } = req.params;
  if (!firstName || !employeeId) {
    if (!userId) {
      return next(createHttpError(403, "User not authenticated"));
    }
    return next(createHttpError(400, "Param values are required"));
  }
  const getUser = await User.findById(userId);
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skipCount = (page - 1) * limit;
  const count = await Payroll.countDocuments({
    employeeId,
    userId,
    isPaid: true,
  });
  const totalPages = Math.ceil(count / limit);
  const findPayroll = await Payroll.find({ employeeId, userId })
    .populate("userId", "_id firstName lastName")
    .sort({ _id: -1 })
    .skip(skipCount)
    .limit(limit);

  if (!findPayroll || findPayroll.length === 0) {
    return next(createHttpError(404, "Employee payroll not found"));
  }
  const getPayrollNetpay = findPayroll.reduce((acc, curr) => acc + curr.net, 0);
  const getPayrollAllowance = findPayroll.reduce(
    (acc, curr) => acc + curr.allowance,
    0
  );
  const getPayrollDeductions = findPayroll.reduce(
    (acc, curr) => acc + curr.deductions,
    0
  );
  if (getUser.employeeId !== employeeId) {
    return next(createHttpError(403, "Access denied"));
  }
  const data = {
    currentPage: page,
    totalPages,
    count,
    totalNetPay: getPayrollNetpay,
    totalAllowance: getPayrollAllowance,
    totalDeductions: getPayrollDeductions,
    payroll: findPayroll,
  };
  res.status(200).json(data);
});

export const trackPayrollStatus = tryCatch(async (req, res, next) => {
  const userId = req.userId;
  const { firstName, employeeId } = req.params;
  if (!firstName || !employeeId) {
    return next(createHttpError(400, "Param values are required"));
  }
  const getUser = await User.findById(userId);
  const findPayroll = await Payroll.find({ employeeId })
    .sort({ _id: -1 })
    .limit(1);

  if (!findPayroll || findPayroll.length === 0) {
    return next(createHttpError(404, "Employee payroll not found"));
  }
  if (getUser.employeeId !== employeeId) {
    return next(createHttpError(403, "Access denied"));
  }
  res.status(200).json(findPayroll);
});

export const searchPayroll = tryCatch(async (req, res, next) => {
  const query = req.query.q;
  if (!query) {
    return next(createHttpError(400, "Search query is required"));
  }
  const sanitizeQuery = query.toLowerCase().replace(/[^\w\s]/gi, "");
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skipCount = (page - 1) * limit;
  const count = await Payroll.countDocuments();
  const totalPages = Math.ceil(count / limit);
  const payroll = await Payroll.find({ $text: { $search: sanitizeQuery } })
    .populate("userId", "photo firstName lastName")
    .sort({ _id: -1 })
    .skip(skipCount)
    .limit(limit);
  if (!payroll) {
    return next(createHttpError(400, "Search did not return a match"));
  }
  const results = {
    currentPage: page,
    totalPages,
    count,
    payroll,
  };
  res.status(200).json(results);
});
