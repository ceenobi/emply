import express from "express";
import * as PayrollController from "../controllers/payroll.js";
import { requiresAuth, Roles } from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/create",
  requiresAuth(Roles.Admin),
  PayrollController.createEmployeePayroll
);

router.get("/", requiresAuth(Roles.Admin), PayrollController.getAllPayrolls);
router.get(
  "/search",
  requiresAuth(Roles.Admin),
  PayrollController.searchPayroll
);
router.get(
  "/get/:firstName/:employeeId/:payrollDate",
  requiresAuth(Roles.Admin),
  PayrollController.getAnEmployeePayroll
);
router.get(
  "/history/:firstName/:employeeId",
  requiresAuth(Roles.All),
  PayrollController.getEmployeePayrollHistory
);

router.get(
  "/track/:firstName/:employeeId",
  requiresAuth(Roles.All),
  PayrollController.trackPayrollStatus
);

router.patch(
  "/update/:firstName/:employeeId/:payrollDate",
  requiresAuth(Roles.Admin),
  PayrollController.editEmployeePayroll
);

router.patch(
  "/status/:firstName/:employeeId/:payrollDate",
  requiresAuth(Roles.Super),
  PayrollController.togglePayrollStatus
);

export default router;
