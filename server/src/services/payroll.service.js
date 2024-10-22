import Payroll from "../models/payroll.js";
import User from "../models/user.js";
import { generatePayrollId, getMonthValue } from "../utils/generateRandomId.js";
export const createPayroll = async (user, payrollBody) => {
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
  } = payrollBody;
  // Ensure values are treated as numbers
  const calcTaxPercentage = +tax / 100;
  const calcTax = +salary * calcTaxPercentage;
  const less = +deductions + calcTax;
  const gross = parseFloat(salary) + parseFloat(allowance);
  const calcNet = gross - less;

  const newPayroll = await Payroll.create({
    userId: user.id,
    employeeId,
    payrollId: generatePayrollId(),
    salary,
    deductions,
    tax,
    allowance,
    lwp: lwp === null ? 0 : lwp,
    lateDays,
    comment,
    net: calcNet,
    isPaid: false,
    payrollDate,
    comment:
      comment ||
      `A payroll has been opened for you for the month of ${getMonthValue()}`,
  });
  const getUser = await User.findOne({ employeeId: employeeId });
  getUser.salary = salary;
  getUser.allowance = allowance;
  await getUser.save();
  const payroll = await newPayroll.save();
  return payroll;
};

export const updatePayroll = async (findPayroll, employeeeBody) => {
  const { salary, deductions, tax, allowance, lwp, lateDays, comment } =
    employeeeBody;
  const updatedFields = {
    salary,
    deductions,
    tax,
    allowance,
    lwp,
    lateDays,
    comment,
  };
  Object.keys(updatedFields).forEach(
    (key) =>
      updatedFields[key] === "" ||
      null ||
      (undefined && delete updatedFields[key])
  );
  const updatedPayroll = await Payroll.findByIdAndUpdate(
    findPayroll.id,
    updatedFields,
    {
      new: true,
    }
  );
  //Recalc net salary
  const calcTaxPercentage = +updatedPayroll.tax / 100;
  const calcTax = +updatedPayroll.salary * calcTaxPercentage;
  const less = +updatedPayroll.deductions + calcTax;
  const gross =
    parseFloat(updatedPayroll.salary) + parseFloat(updatedPayroll.allowance);
  const calcNet = gross - less;
  updatedPayroll.net = calcNet;
  await updatedPayroll.save();
  return updatedPayroll;
};
