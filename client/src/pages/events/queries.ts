import { QueryClient } from "@tanstack/react-query";
import { eventService } from "@/api";

const queryClient = new QueryClient();
export const getEvents = async (page: string | number) => {
  return await queryClient.fetchQuery({
    queryKey: ["events", page],
    queryFn: () => eventService.getEvents(page),
  });
};
export const getUpcomingEvents = async () => {
  return await queryClient.fetchQuery({
    queryKey: ["upcomingEvents"],
    queryFn: eventService.getUpcomingEvents,
  });
};

export const searchEvents = async (
  searchQuery: string,
  page: string | number
) => {
  return await queryClient.fetchQuery({
    queryKey: ["searchEvents", searchQuery, page],
    queryFn: () => eventService.searchEvents(searchQuery, page),
  });
};
