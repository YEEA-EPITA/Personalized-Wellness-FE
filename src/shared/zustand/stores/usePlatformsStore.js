import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import { deleteRequest, getRequest } from "@/shared/utils/requests";
import { showToastUtils } from "@/shared/utils/toast";
import { SERVERS } from "@/shared/constants/general";

const usePlatformsStore = create(
  devtools(
    persist(
      (set, get) => ({
        platforms: [],
        isLoading: false,
        error: null,

        setPlatforms: (data) => set({ platforms: data }),
        removePlatform: (platformId) =>
          set((state) => ({
            platforms: state.platforms.filter(
              (platform) => platform.id !== platformId
            ),
          })),

        reset: () =>
          set({
            platforms: [],
            isLoading: false,
            error: null,
          }),

        generateGoogleAuthUrl: async () => {
          try {
            const response = await getRequest({ server: SERVERS.node.value })({
              endpoint: "/google/auth",
            });
            window.location.href = response.data.body.url;
          } catch (err) {
            throw err;
          }
        },

        generateOutlookAuthUrl: async () => {
          try {
            const response = await getRequest({ server: SERVERS.node.value })({
              endpoint: "/outlook/auth",
            });
            window.location.href = response.data.body.url;
          } catch (err) {
            throw err;
          }
        },

        generateJiraAuthUrl: async () => {
          try {
            const response = await getRequest({ server: SERVERS.java.value })({
              endpoint: "/jira/login",
            });
            window.location.href = response.data.body;
          } catch (err) {
            throw err;
          }
        },

        generateTrelloAuthUrl: async () => {
          try {
            const response = await getRequest({ server: SERVERS.java.value })({
              endpoint: "/trello/login",
            });
            window.location.href = response.data.body;
          } catch (err) {
            throw err;
          }
        },

        fetchAccounts: async () => {
          set({ isLoading: true, error: null });
          try {
            const response = await getRequest({ server: SERVERS.node.value })({
              endpoint: "/google/accounts",
            });

            get().setPlatforms(response.data.body.accounts);
            return response.data.body.accounts;
          } catch (err) {
            showToastUtils({ type: "error", message: err.message });
            set({ error: err });
            throw err;
          } finally {
            set({ isLoading: false });
          }
        },

        deleteConnectedAccount: async ({ accountId }) => {
          try {
            const response = await deleteRequest({
              server: SERVERS.node.value,
            })({
              endpoint: `/google/${accountId}`,
            });
            showToastUtils({ type: "success", message: response.data.message });
            get().removePlatform(accountId);
            return response.data.body.accounts;
          } catch (err) {
            showToastUtils({ type: "error", message: err.message });
            set({ error: err });
            throw err;
          }
        },
      }),
      {
        name: "platforms-storage",
        version: 1,
        storage: createJSONStorage(() =>
          typeof window !== "undefined" ? localStorage : undefined
        ),
        // partialize: (state) => ({ platforms: state.platforms }),
        migrate: (persistedState, version) => {
          if (typeof persistedState !== "object" || !persistedState.platforms) {
            return { platforms: [], isLoading: false, error: null };
          }
          return persistedState;
        },
      }
    )
  )
);

export default usePlatformsStore;
