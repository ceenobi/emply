import express from "express";
import * as LeaveController from "../controllers/leave.js";
import { requiresAuth, Roles } from "../middleware/auth.js";

const router = express.Router();

router.get("/", requiresAuth(Roles.All), LeaveController.getAllUserLeaves);
router.get("/all", requiresAuth(Roles.Admin), LeaveController.getAllLeaves);
router.get("/search", requiresAuth(Roles.All), LeaveController.searchLeaves);

router.post("/apply", requiresAuth(Roles.All), LeaveController.createLeave);

router.patch(
  "/:id/update",
  requiresAuth(Roles.All),
  LeaveController.updateLeave
);
router.patch(
  "/:id/approve",
  requiresAuth(Roles.Admin),
  LeaveController.approveLeave
);

router.delete(
  "/:id/delete",
  requiresAuth(Roles.All),
  LeaveController.deleteLeave
);

export default router;
