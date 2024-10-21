import express from "express";
import * as AuthController from "../controllers/auth.js";
import { requiresAuth, Roles } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", requiresAuth(Roles.Admin), AuthController.register);
router.post("/login", AuthController.login);
router.post("/verify-email", AuthController.verifyEmail);
router.post("/logout", AuthController.logout);
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password/:token", AuthController.resetPassword);
router.post(
  "/update-password",
  requiresAuth(Roles.All),
  AuthController.changePassword
);

router.get("/", requiresAuth(Roles.All), AuthController.authenticatedUser);

router.delete(
  "/delete-account",
  requiresAuth(Roles.All),
  AuthController.deleteUserAccount
);
router.delete(
  "/:id/delete-account",
  requiresAuth(Roles.Super),
  AuthController.adminDeleteUserAccount
);

export default router;
