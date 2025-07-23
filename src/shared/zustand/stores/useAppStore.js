import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

const useAppStore = create(
  devtools(
    persist(
      (set) => ({
        sidebarOpen: true,

        toggleSidebar: () =>
          set((state) => ({ sidebarOpen: !state.sidebarOpen })),

        reset: () => set({ sidebarOpen: true }),
      }),
      {
        name: "app-storage",
        storage: typeof window !== "undefined" ? localStorage : undefined,
      }
    )
  )
);

export default useAppStore;
