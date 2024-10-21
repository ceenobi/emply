import { eventService } from "@/api";
import { EventProps } from "@/types/event";
import { handleError } from "@/utils";

export const handleUpdateOrDeleteEventAction = async ({
  request,
}: {
  request: Request;
}) => {
  const formData = await request.formData();
  switch (request.method) {
    case "DELETE":
      {
        const event = Object.fromEntries(formData);
        try {
          const res = await eventService.deleteEvent(event.id as string);
          return res;
        } catch (error) {
          handleError(error);
        }
      }
      break;
    case "PATCH":
      {
        const eventBody = Object.fromEntries(formData);     
        try {
          const res = await eventService.updateEvent(
            eventBody.id as string,
            eventBody as unknown as EventProps
          );
          return res;
        } catch (error) {
          handleError(error);
        }
      }
      break;
    default:
      return new Response("Method not allowed", { status: 405 });
  }
  return null;
};

export const createEventAction = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const eventBody = Object.fromEntries(formData);
  try {
    const res = await eventService.createEvent(
      eventBody as unknown as EventProps
    );
    return res;
  } catch (error) {
    handleError(error);
  }
  return null;
};
