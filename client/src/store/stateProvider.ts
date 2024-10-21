import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useToggleSidebar = create(
  persist(
    (set) => ({
      isOpenSideBar: true,
      hideSideBar: false,
      setIsOpenSideBar: (state: boolean) => set({ isOpenSideBar: state }),
      setHideSideBar: (state: boolean) => set({ hideSideBar: state }),
    }),
    {
      name: "sidebar-controls",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useEditMode = create(
  persist(
    (set) => ({
      isEditMode: false,
      setIsEditMode: (state: boolean) => set({ isEditMode: state }),
    }),
    {
      name: "edit-mode",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
