import express from "express";
import * as UserController from "../controllers/user.js";
import { requiresAuth, Roles } from "../middleware/auth.js";

const router = express.Router();

router.get("/", requiresAuth(Roles.All), UserController.getAllUsers);
router.get(
  "/:firstName/:employeeId",
  requiresAuth(Roles.All),
  UserController.getAUser
);
router.get("/search", requiresAuth(Roles.All), UserController.searchEmployee);

router.patch(
  "/profile-update/:employeeId",
  requiresAuth(Roles.All),
  UserController.updateUserProfile
);

export default router;
