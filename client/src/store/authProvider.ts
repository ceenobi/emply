import { create } from "zustand";
import { handleError } from "@/utils";
import { authService } from "@/api";

type authType = {
  user: null | unknown;
  checkAuth: () => void;
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  error: unknown | null;
  isLoading: boolean;
  message: string | null;
  logout: () => void;
};

const useAuthProvider = create<authType>((set) => ({
  user: null as unknown,
  isAuthenticated: false,
  error: null as unknown,
  isLoading: false,
  isCheckingAuth: true,
  message: null as string | null,
  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await authService.getAuthenticatedUser();
      set({
        user: response.data,
        isAuthenticated: true,
        isCheckingAuth: false,
        message: response.data.msg,
      });
    } catch (error) {
      set({ error: error, isCheckingAuth: false, isAuthenticated: false });
    }
  },
  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await authService.logoutUser();
      set({
        user: null,
        isAuthenticated: false,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      set({ error: "Error logging out", isLoading: false });
      handleError(error);
    }
  },
}));

export { useAuthProvider };
