import { handleError } from "@/utils";

const tryCatchFn =
  <T>(fn: (param: T) => Promise<void>) =>
  async (param: T): Promise<void> => {
    if (typeof fn === "function") {
      try {
        await fn(param);
      } catch (error: unknown) {
        handleError(error);
      }
    }
  };

export default tryCatchFn;
