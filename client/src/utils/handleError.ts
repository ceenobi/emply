import { toast } from "sonner";

const customId = "custom-id-toast";

const handleError = (error: unknown): void => {
  console.error(error);
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  ) {
    toast.error((error as { message: string }).message, {
      id: customId,
    });
  }

  if (typeof error === "object" && error !== null && "response" in error) {
    const axiosError = error as { response?: { data?: { error?: string } } };
    toast.error(axiosError.response?.data?.error, { id: customId });
  } else {
    toast.error("An unknown error occurred", { id: customId });
  }
};

export default handleError;
