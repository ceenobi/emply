import express from "express";
import * as DeptController from "../controllers/dept.js";
import { requiresAuth, Roles } from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/create",
  requiresAuth(Roles.Admin),
  DeptController.createDepartment
);
router.get("/", requiresAuth(Roles.All), DeptController.getDepartments);
router.get(
  "/:departmentName",
  requiresAuth(Roles.Admin),
  DeptController.getADepartment
);

router.patch(
  "/update/:departmentId",
  requiresAuth(Roles.Admin),
  DeptController.updateDepartment
);

export default router;
