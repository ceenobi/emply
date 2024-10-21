import express from "express";
import * as EventController from "../controllers/event.js";
import { requiresAuth, Roles } from "../middleware/auth.js";

const router = express.Router();

router.post("/create", requiresAuth(Roles.All), EventController.createAnEvent);

router.get("/", requiresAuth(Roles.All), EventController.getEvents);
router.get(
  "/upcoming",
  requiresAuth(Roles.All),
  EventController.getUpcomingEvents
);
router.get("/search", requiresAuth(Roles.All), EventController.searchEvents);

router.patch(
  "/:id/update",
  requiresAuth(Roles.All),
  EventController.updateEvent
);

router.delete(
  "/:id/delete",
  requiresAuth(Roles.All),
  EventController.deleteEvent
);

export default router;
