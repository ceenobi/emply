import express from "express";
import * as TaskController from "../controllers/task.js";
import { requiresAuth, Roles } from "../middleware/auth.js";

const router = express.Router();

router.post("/create", requiresAuth(Roles.All), TaskController.createATask);


export default router;