import useUserStore from "@/shared/zustand/stores/useUserStore";
import useAppStore from "@/shared/zustand/stores/useAppStore";
import usePlatformsStore from "@/shared/zustand/stores/usePlatformsStore";

export const resetAllStores = () => {
  useUserStore.getState().reset();
  useAppStore.getState().reset();
  usePlatformsStore.getState().reset();
};
