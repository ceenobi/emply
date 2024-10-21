import express from "express";
import * as DeptController from "../controllers/dept.js";
import { requiresAuth, Roles } from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/create",
  requiresAuth(Roles.Admin),
  DeptController.createDepartment
);
router.get("/", DeptController.getDepartments);

export default router;
