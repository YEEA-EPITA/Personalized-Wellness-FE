import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import { getRequest, postRequest, putRequest } from "@/shared/utils/requests";
import { showToastUtils } from "@/shared/utils/toast";
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

        fetchUserProfile: async () => {
          set({ isLoading: true, error: null });
          try {
            const response = await getRequest({ server: SERVERS.java.value })({
              endpoint: "/api/profile/me",
            });
            set({ currentUser: response.data.body });
            return response.data.body;
          } catch (err) {
            set({ error: err });
            throw err;
          } finally {
            set({ isLoading: false });
          }
        },

        updateUserProfile: async ({ payload }) => {
          set({ isLoading: true, error: null });
          try {
            const res = await putRequest({ server: SERVERS.java.value })({
              endpoint: "/api/profile/me",
              payload,
            });
            set({ currentUser: res.data.body });
            showToastUtils({
              type: "success",
              message: res.data.message,
            });
            return res.data.body;
          } catch (err) {
            showToastUtils({ type: "error", message: err.message });
            set({ error: err });
            throw err;
          } finally {
            set({ isLoading: false });
          }
        },

        deleteUserProfile: async ({ password }) => {
          set({ isLoading: true, error: null });
          try {
            const response = await putRequest({
              server: SERVERS.java.value,
            })({
              endpoint: "/api/profile/me/delete",
              payload: { password },
            });
            localStorage.clear();
            showToastUtils({
              type: "success",
              message: response.data.message,
            });
            set({ currentUser: null });
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
        version: 1,
        storage: createJSONStorage(() =>
          typeof window !== "undefined" ? localStorage : undefined
        ),
        // partialize: (state) => ({ platforms: state.platforms }),
        migrate: (persistedState, version) => {
          if (typeof persistedState !== "object" || !persistedState.user) {
            return { currentUser: null, isLoading: false, error: null };
          }
          return persistedState;
        },
      }
    )
  )
);

export default useUserStore;
