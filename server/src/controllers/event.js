import Event from "../models/event.js";
import createHttpError from "http-errors";
import tryCatch from "../utils/tryCatchFn.js";
import {
  checkEventStatus,
  createEvent,
  updateEventDetails,
} from "../services/event.service.js";
import { validateField } from "../utils/validateForm.js";
import { uploadSingleImage } from "../services/upload.service.js";
import { isValidObjectId } from "mongoose";

export const createAnEvent = tryCatch(async (req, res, next) => {
  const { photo, title, description, startDate, endDate, time, location } =
    req.body;
  const userId = req.userId;
  if (!title || !description || !time || !startDate) {
    return next(createHttpError(400, "All fields are required"));
  }
  let errors = {
    title: validateField(title, "Event title is required"),
    description: validateField(description, "Describe your event"),
    time: validateField(time, "Event time is required "),
    startDate: validateField(startDate, "Event start date is required"),
  };
  if (errors.title || errors.description || errors.time || errors.startDate) {
    return next(
      createHttpError(
        400,
        errors.title
          ? errors.title
          : errors.description
            ? errors.description
            : errors.time
              ? errors.time
              : errors.startDate
                ? errors.startDate
                : "Form validation failed"
      )
    );
  }
  let eventPhoto;
  if (photo) {
    try {
      const photoUploaded = await uploadSingleImage(photo);
      eventPhoto = photoUploaded;
    } catch (error) {
      console.error(error);
      return next(createHttpError(500, "failed to upload image"));
    }
  }
  const eventBody = {
    eventPhoto,
    title,
    description,
    startDate,
    endDate,
    time,
    location,
  };
  const event = await createEvent(userId, eventBody);
  res.status(201).json({ event, msg: "Event created!" });
});

export const getEvents = tryCatch(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skipCount = (page - 1) * limit;
  const count = await Event.countDocuments();
  const totalPages = Math.ceil(count / limit);
  const events = await Event.find()
    .populate("userId", "photo firstName lastName")
    .sort({ _id: -1 })
    .skip(skipCount)
    .limit(limit);
  if (!events) {
    return next(createHttpError(400, "No events found"));
  }
  const eventProgress = await checkEventStatus(events);
  const event = {
    currentPage: page,
    totalPages,
    count,
    events: eventProgress,
  };
  res.status(200).json(event);
});

export const getUpcomingEvents = tryCatch(async (req, res, next) => {
  const events = await Event.find({ status: "upcoming" })
    .populate("userId", "photo firstName lastName")
    .sort({ _id: -1 })
    .limit(7);
  if (!events) {
    return next(createHttpError(400, "No upcoming events found"));
  }
  const eventProgress = await checkEventStatus(events);
  res.status(200).json(eventProgress);
});

export const updateEvent = tryCatch(async (req, res, next) => {
  const userId = req.userId;
  const { id: eventId } = req.params;
  const { title, description, startDate, endDate, time, location, status } =
    req.body;
  if (!isValidObjectId(eventId) || !eventId) {
    return next(createHttpError(400, "Invalid event ID"));
  }
  let errors = {
    title: validateField(title, "Event title is required"),
    description: validateField(description, "Describe your event"),
    time: validateField(time, "Event time is required "),
    startDate: validateField(startDate, "Event start date is required"),
  };
  if (errors.title || errors.description || errors.time || errors.startDate) {
    return next(
      createHttpError(
        400,
        errors.title
          ? errors.title
          : errors.description
            ? errors.description
            : errors.time
              ? errors.time
              : errors.startDate
                ? errors.startDate
                : "Form validation failed"
      )
    );
  }
  const event = await Event.findById(eventId);
  if (event.userId.toString() !== userId) {
    return next(createHttpError(403, "Unauthorized to update this event"));
  }
  const eventBody = {
    title,
    description,
    startDate,
    endDate,
    time,
    location,
    status,
  };
  const updatedEvent = await updateEventDetails(eventId, eventBody);
  res.status(200).json({ updatedEvent, msg: "Event details updated" });
});

export const deleteEvent = tryCatch(async (req, res, next) => {
  const userId = req.userId;
  const { id: eventId } = req.params;
  if (!isValidObjectId(eventId) || !eventId) {
    return next(createHttpError(400, "Invalid event ID"));
  }
  const event = await Event.findById(eventId);
  if (!event) {
    return next(createHttpError(404, "Event not found"));
  }
  if (event.userId.toString() !== userId) {
    return next(createHttpError(403, "Unauthorized to delete this event"));
  }
  await event.deleteOne();
  res.status(200).json({ msg: "Event deleted!" });
});

export const searchEvents = tryCatch(async (req, res, next) => {
  const query = req.query.q;
  if (!query) {
    return next(createHttpError(400, "Search query is required"));
  }
  const sanitizeQuery = query.toLowerCase().replace(/[^\w\s]/gi, "");
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 15;
  const skipCount = (page - 1) * limit;
  const count = await Event.countDocuments();
  const totalPages = Math.ceil(count / limit);
  const events = await Event.find({
    $text: { $search: sanitizeQuery },
  })
    .populate("userId", "photo firstName lastName")
    .sort({ _id: -1 })
    .skip(skipCount)
    .limit(limit);
  if (!events) {
    return next(createHttpError(400, "Search did not return a match"));
  }
  const event = {
    currentPage: page,
    totalPages,
    count,
    events,
  };
  res.status(200).json(event);
});
