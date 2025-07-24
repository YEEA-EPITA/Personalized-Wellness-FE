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

const useDashboardStore = create(
  devtools(
    persist(
      (set, get) => ({
        isLoading: false,
        dailyStats: {},
        error: null,
        googleCalendarEvents: [],

        setGoogleCalendarEvents: (events) => {
          set({ googleCalendarEvents: events });
        },

        reset: () =>
          set({
            dailyStats: {},
            isLoading: false,
            error: null,
          }),

        fetchDailyStats: async () => {
          set({ isLoading: true, error: null });
          try {
            const response = await getRequest({ server: SERVERS.java.value })({
              endpoint: `/api/burnout/daily-status`,
            });
            set({ dailyStats: response.data.body });
            return response.data.body;
          } catch (error) {
            showToastUtils({ type: "error", message: error.message });
            set({ error: error.message });
          } finally {
            set({ isLoading: false });
          }
        },

        fetchGoogleCalendarEvents: async () => {
          set({ isLoading: true, error: null });
          try {
            const response = await getRequest({ server: SERVERS.node.value })({
              endpoint: `/google/calendar/events?limit=10&pageToken=&startDate=2025-07-21&endDate=2025-07-27`,
            });
            set({ googleCalendarEvents: response.data.body.items });
            return response.data.body.items;
          } catch (error) {
            set({ error: error.message });
          } finally {
            set({ isLoading: false });
          }
        },

        // Create Google Calendar Event
        createGoogleCalendarEvent: async ({ payload }) => {
          set({ isLoading: true, error: null });
          try {
            const response = await postRequest({ server: SERVERS.node.value })({
              endpoint: `/google/calendar/events`,
              payload,
            });
            showToastUtils({
              type: "success",
              message: "Event created successfully!",
            });
            return response.data.body;
          } catch (error) {
            showToastUtils({ type: "error", message: error.message });
            set({ error: error.message });
          } finally {
            set({ isLoading: false });
          }
        },
      }),
      {
        name: "dashboard-storage",
        version: 1,
        storage: createJSONStorage(() =>
          typeof window !== "undefined" ? localStorage : undefined
        ),
        // partialize: (state) => ({ platforms: state.platforms }),
        migrate: (persistedState, version) => {
          if (
            typeof persistedState !== "object" ||
            !persistedState.dailyStats
          ) {
            return {
              dailyStats: {},
              isLoading: false,
              error: null,
            };
          }
          return persistedState;
        },
      }
    )
  )
);

export default useDashboardStore;
