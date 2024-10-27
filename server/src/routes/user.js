import express from "express";
import * as UserController from "../controllers/user.js";
import { requiresAuth, Roles } from "../middleware/auth.js";

const router = express.Router();

router.get("/", requiresAuth(Roles.All), UserController.getAllEmployees);
router.get("/all", requiresAuth(Roles.All), UserController.getEmployees);
router.get(
  "/:firstName/:employeeId",
  requiresAuth(Roles.All),
  UserController.getAEmployee
);
router.get("/search", requiresAuth(Roles.All), UserController.searchEmployee);
router.get(
  "/:dept",
  requiresAuth(Roles.All),
  UserController.getEmployeesByDept
);

router.patch(
  "/profile-update/:employeeId",
  requiresAuth(Roles.All),
  UserController.updateEmployeeProfile
);

export default router;
