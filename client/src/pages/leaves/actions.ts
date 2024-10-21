import { leaveService } from "@/api";
import { LeaveProps } from "@/types/leave";
import { handleError } from "@/utils";
export const handleUpdateOrDeleteLeaveAction = async ({
  request,
}: {
  request: Request;
}) => {
  const formData = await request.formData();
  switch (request.method) {
    case "DELETE":
      {
        const leave = Object.fromEntries(formData);
        try {
          const res = await leaveService.deleteLeave(leave.id as string);
          return res;
        } catch (error) {
          handleError(error);
        }
      }
      break;
    case "PATCH":
      {
        const leaveBody = Object.fromEntries(formData);
        try {
          const res = await leaveService.updateLeave(
            leaveBody.id as string,
            leaveBody as unknown as LeaveProps
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

export const applyLeaveAction = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const leaveBody = Object.fromEntries(formData);
  try {
    const res = await leaveService.applyLeave(
      leaveBody as unknown as LeaveProps
    );
    return res;
  } catch (error) {
    handleError(error);
  }
  return null;
};

export const approveLeaveAction = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const leave = Object.fromEntries(formData);
  try {
    const res = await leaveService.approveLeave(
      leave.id as string,
      leave as unknown as LeaveProps
    );
    return res;
  } catch (error) {
    handleError(error);
  }
  return null;
};
