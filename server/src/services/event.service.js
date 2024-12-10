import Event from "../models/event.js";
import User from "../models/user.js";
import dayjs from "dayjs";

export const createEvent = async (user, eventBody) => {
  if (!user || typeof user !== "string") {
    throw new Error("Invalid user input");
  }
  if (!eventBody || typeof eventBody !== "object") {
    throw new Error("Invalid eventBody input");
  }
  const { eventPhoto, title, description, startDate, endDate, time, location } =
    eventBody;
  const getUser = await User.findById(user);
  const newEvent = await Event.create({
    photo: eventPhoto,
    title,
    description,
    startDate,
    endDate,
    time,
    location,
    userId: getUser.id,
  });
  const event = await newEvent.save();
  return event;
};

export const checkEventStatus = async (events) => {
  const updatedEvents = await Promise.all(
    events.map(async (event) => {
      let startDateObj = dayjs(event.startDate);
      let endDateObj = dayjs(event.endDate);
      let currentDate = dayjs();
      if (event.status === "cancelled" || event.status === "postponed") {
        event.status === "cancelled" ? "cancelled" : "postponed";
      } else if (
        startDateObj.isSame(currentDate, "minute") &&
        event.endDate === null
      ) {
        event.status = "ongoing";
      } else if (
        startDateObj.isBefore(currentDate, "minute") &&
        endDateObj.isAfter(currentDate, "minute")
      ) {
        event.status = "ongoing";
      } else if (
        startDateObj.isBefore(currentDate, "minute") &&
        event.endDate === null
      ) {
        event.status = "ongoing";
      } else if (
        startDateObj.isBefore(currentDate, "minute") &&
        endDateObj.isBefore(currentDate, "minute")
      ) {
        event.status = "ended";
      } else if (endDateObj.isBefore(currentDate, "minute")) {
        event.status = "ended";
      } else {
        event.status = "upcoming";
      }
      await event.save();
      return event;
    })
  );
  return updatedEvents;
};

export const updateEventDetails = async (eventId, eventBody) => {
  const updatedFields = {
    ...eventBody,
    endDate: eventBody.endDate === "null" ? null : eventBody.endDate,
  };
  Object.keys(updatedFields).forEach(
    (key) =>
      updatedFields[key] === "" ||
      updatedFields[key] === null ||
      (undefined && delete updatedFields[key])
  );
  const updatedEvent = await Event.findByIdAndUpdate(eventId, updatedFields, {
    new: true,
  });
  return updatedEvent;
};
