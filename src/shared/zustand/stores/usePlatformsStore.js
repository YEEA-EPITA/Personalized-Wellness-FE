import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
} from "@/shared/utils/requests";
import { showToastUtils } from "@/shared/utils/toast";
import { SERVERS } from "@/shared/constants/general";

const usePlatformsStore = create(
  devtools(
    persist(
      (set, get) => ({
        platforms: [],
        accounts: [],
        isLoading: false,
        error: null,
        jiraProjectsList: [],
        jiraTasksList: [],
        trelloBoardsList: [],
        trelloListsIds: [],

        setPlatforms: (data) => set({ platforms: data }),
        setAccounts: (data) => set({ accounts: data }),
        removePlatform: (platformId) =>
          set((state) => ({
            platforms: state.platforms.filter(
              (platform) => platform.id !== platformId
            ),
          })),

        // Jira specific
        setJiraProjectsList: (data) => set({ jiraProjectsList: data }),

        setJiraTasksList: (data) => set({ jiraTasksList: data }),

        setTrelloBoardsList: (data) => set({ trelloBoardsList: data }),

        setTrelloListsIds: (data) => set({ trelloListsIds: data }),

        reset: () =>
          set({
            platforms: [],
            accounts: [],
            jiraProjectsList: [],
            jiraTasksList: [],
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
            get().setAccounts(response.data.body.accounts);
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

        // JIRA specific methods
        // Fetch Jira projects
        fetchJiraProjects: async ({ email = "" }) => {
          set({ error: null });
          try {
            const response = await getRequest({ server: SERVERS.java.value })({
              endpoint: `/jira/projects?jiraEmail=${email}`,
            });

            get().setJiraProjectsList(response.data.body);
            return response.data.body.projects;
          } catch (err) {
            showToastUtils({ type: "error", message: err.message });
            set({ error: err });
            throw err;
          }
        },

        // Fetch Jira Tasks
        fetchJiraTasks: async ({
          jiraEmail = "",
          jiraProjects = [],
          startDate = "2025-01-01T00:00:00.000+0100",
          endDate = "2025-12-31T23:59:59.999+0100",
        }) => {
          set({ isLoading: true, error: null });
          try {
            const response = await postRequest({ server: SERVERS.java.value })({
              endpoint: `/jira/tasks`,
              payload: { jiraEmail, jiraProjects, startDate, endDate },
            });

            get().setJiraTasksList(response.data.body);
            return response.data.body;
          } catch (err) {
            showToastUtils({ type: "error", message: err.message });
            set({ error: err });
            throw err;
          } finally {
            set({ isLoading: false });
          }
        },

        createJiraTask: async ({ payload }) => {
          set({ isLoading: true, error: null });
          try {
            const response = await postRequest({ server: SERVERS.java.value })({
              endpoint: `/jira/task/create`,
              payload,
            });
            return response.data.body;
          } catch (err) {
            showToastUtils({ type: "error", message: err.message });
            set({ error: err });
            throw err;
          } finally {
            set({ isLoading: false });
          }
        },

        updateJiraTask: async ({ payload }) => {
          set({ isLoading: true, error: null });
          try {
            const response = await putRequest({ server: SERVERS.java.value })({
              endpoint: `/jira/task/update`,
              payload,
            });
            return response.data.body;
          } catch (err) {
            showToastUtils({ type: "error", message: err.message });
            set({ error: err });
            throw err;
          } finally {
            set({ isLoading: false });
          }
        },

        updateJiraTaskStatus: async ({ payload }) => {
          console.log(payload);
          set({ isLoading: true, error: null });
          try {
            const response = await putRequest({ server: SERVERS.java.value })({
              endpoint: `/jira/status/update`,
              payload,
            });
            return response.data.body;
          } catch (err) {
            showToastUtils({ type: "error", message: err.message });
            set({ error: err });
            throw err;
          } finally {
            set({ isLoading: false });
          }
        },

        deleteJiraTask: async ({ payload }) => {
          set({ isLoading: true, error: null });
          try {
            const response = await postRequest({ server: SERVERS.java.value })({
              endpoint: `/jira/task/delete`,
              payload,
            });
            return response.data.body;
          } catch (err) {
            showToastUtils({ type: "error", message: err.message });
            set({ error: err });
            throw err;
          } finally {
            set({ isLoading: false });
          }
        },

        // Fetch Trello Boards
        fetchTrelloBoards: async ({ email = "" }) => {
          set({ error: null });
          try {
            const response = await getRequest({ server: SERVERS.java.value })({
              endpoint: `/trello/boards?trelloEmail=${email}`,
            });

            get().setTrelloBoardsList(response.data.body);
            const lists = await get().fetchTrelloLists({
              email,
              boardId: response.data.body[0]?.id,
            });
            return response.data.body.boards;
          } catch (err) {
            showToastUtils({ type: "error", message: err.message });
            set({ error: err });
            throw err;
          }
        },

        // Fetch Trello Lists
        fetchTrelloLists: async ({ email, boardId }) => {
          set({ error: null });
          try {
            const response = await postRequest({ server: SERVERS.java.value })({
              endpoint: `/trello/lists`,
              payload: {
                trelloEmail: email,
                boardIds: Array.isArray(boardId) ? boardId : [boardId],
              },
            });
            const listsObj = response.data || {};

            const transformedLists = Object.entries(listsObj)[0][1].map(
              (list) => list.id
            );
            get().setTrelloListsIds(transformedLists);
            return transformedLists;
          } catch (err) {
            showToastUtils({ type: "error", message: err.message });
            set({ error: err });
            throw err;
          }
        },

        // Fetch Trello Tasks
        fetchTrelloTasks: async ({ email }) => {
          set({ isLoading: true, error: null });
          try {
            const payload = {
              trelloEmail: email,
              listIds: get().trelloListsIds,
            };
            const response = await postRequest({ server: SERVERS.java.value })({
              endpoint: `/trello/cards/from-lists`,
              payload,
            });

            return response.data.body;
          } catch (err) {
            showToastUtils({ type: "error", message: err.message });
            set({ error: err });
            throw err;
          } finally {
            set({ isLoading: false });
          }
        },

        createTrelloTask: async ({ payload }) => {
          set({ isLoading: true, error: null });
          try {
            const response = await postRequest({ server: SERVERS.java.value })({
              endpoint: `/trello/card`,
              payload,
            });
            return response.data;
          } catch (err) {
            showToastUtils({ type: "error", message: err.message });
            set({ error: err });
            throw err;
          } finally {
            set({ isLoading: false });
          }
        },

        updateTrelloTask: async ({ payload }) => {
          set({ isLoading: true, error: null });
          try {
            const response = await putRequest({ server: SERVERS.java.value })({
              endpoint: `/trello/card`,
              payload,
            });
            return response.data.body;
          } catch (err) {
            showToastUtils({ type: "error", message: err.message });
            set({ error: err });
            throw err;
          } finally {
            set({ isLoading: false });
          }
        },

        deleteTrelloTask: async ({ payload }) => {
          set({ isLoading: true, error: null });
          try {
            const response = await postRequest({ server: SERVERS.java.value })({
              endpoint: `/trello/card/delete`,
              payload,
            });
            return response.data.body;
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
