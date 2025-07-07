// stores/useUserStore.js
import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { showToastUtils } from "@/shared/utils/toast";
import { postRequest, getRequest } from "@/shared/utils/requests";
import { SERVERS } from "@/shared/constants/general";

const useUserStore = create(
  devtools(
    persist(
      (set, get) => ({
        isLoading: false,
        error: null,
        currentUser: null,

        reset: () => set({ isLoading: false, error: null, currentUser: null }),

        signInUser: async ({ email, password }) => {
          set({ isLoading: true, error: null });
          try {
            const response = await postRequest({ server: SERVERS.java.value })({
              endpoint: "/auth/login",
              payload: { email, password },
            });

            showToastUtils({ type: "success", message: response.data.message });
            set({ currentUser: response.data.body });
            return response.data.body;
          } catch (err) {
            showToastUtils({ type: "error", message: err.message });
            set({ error: err });
            throw err;
          } finally {
            set({ isLoading: false });
          }
        },

        createUser: async ({ firstName, lastName, email, password }) => {
          set({ isLoading: true, error: null });
          try {
            const response = await postRequest({ server: SERVERS.java.value })({
              endpoint: "/auth/signup",
              payload: { firstName, lastName, email, password },
            });

            showToastUtils({ type: "success", message: response.data.message });
            set({ currentUser: response.data.body });
          } catch (err) {
            showToastUtils({ type: "error", message: err.message });
            set({ error: err });
            throw err;
          } finally {
            set({ isLoading: false });
          }
        },

        verifyGoogleOAuth: async ({ token }) => {
          set({ isLoading: true, error: null });
          try {
            const response = await getRequest({
              server: SERVERS.java.value,
              headers: { token },
            })({
              endpoint: "/google/profile",
            });

            set({ currentUser: { ...response.data.body, accessToken: token } });
          } catch (err) {
            showToastUtils({ type: "error", message: err.message });
            set({ error: err });
            throw err;
          } finally {
            set({ isLoading: false });
          }
        },
      }),
      {
        name: "user-storage",
        storage: typeof window !== "undefined" ? localStorage : undefined,
      }
    )
  )
);

export default useUserStore;
