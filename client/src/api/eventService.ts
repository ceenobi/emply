import { EventProps } from "@/types/event";
import { http } from "@/utils";

const createEvent = async (formData: EventProps) => {
  return await http.post("/events/create", formData);
};
const getEvents = async (page: string | number) => {
  return await http.get(`/events/?page=${page}`);
};
const getUpcomingEvents = async () => {
  return await http.get("/events/upcoming");
};
const searchEvents = async (searchQuery: string, page: string | number) => {
  return await http.get(`/events/search?q=${searchQuery}&page=${page}`);
};
const updateEvent = async (eventId: string, formData: EventProps) => {
  return await http.patch(`/events/${eventId}/update`, formData);
};
const deleteEvent = async (eventId: string) => {
  return await http.delete(`/events/${eventId}/delete`);
};

export default {
  createEvent,
  getEvents,
  getUpcomingEvents,
  updateEvent,
  deleteEvent,
  searchEvents,
};
