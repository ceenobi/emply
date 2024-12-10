import express from "express";
import * as TaskController from "../controllers/task.js";
import { requiresAuth, Roles } from "../middleware/auth.js";

const router = express.Router();

router.post("/create", requiresAuth(Roles.Admin), TaskController.createATask);

router.get("/", requiresAuth(Roles.All), TaskController.getAllTask);
router.get("/:taskId", requiresAuth(Roles.All), TaskController.getATask);

router.patch("/:taskId", requiresAuth(Roles.Admin), TaskController.updateTask);
router.delete("/:taskId", requiresAuth(Roles.Admin), TaskController.deleteTask);

export default router;
