import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { SyncStatus, Trip, TripActivity, TripDay } from "@/lib/types/travel";

export interface TripsState {
  items: Trip[];
}

const initialState: TripsState = {
  items: [],
};

function nowIso() {
  return new Date().toISOString();
}

function findTrip(state: TripsState, tripId: string) {
  const trip = state.items.find((t) => t.id === tripId);
  if (!trip) throw new Error(`Trip ${tripId} not found`);
  return trip;
}

function findDay(trip: Trip, dayId: string) {
  const day = trip.days.find((d) => d.id === dayId);
  if (!day) throw new Error(`Day ${dayId} not found on trip ${trip.id}`);
  return day;
}

function touch(trip: Trip) {
  trip.updatedAt = nowIso();
  if (trip.syncStatus === "synced") trip.syncStatus = "pending";
}

const tripsSlice = createSlice({
  name: "trips",
  initialState,
  reducers: {
    addTrip: {
      reducer(state, action: PayloadAction<Trip>) {
        state.items.unshift(action.payload);
      },
      prepare(input: {
        destinationCode: string;
        destinationName: string;
        destinationEmoji: string;
        startDate: string;
        endDate: string;
        budget: number;
        currency: string;
        days: TripDay[];
      }) {
        const timestamp = nowIso();
        const trip: Trip = {
          id: crypto.randomUUID(),
          createdAt: timestamp,
          updatedAt: timestamp,
          syncStatus: "offline",
          ...input,
        };
        return { payload: trip };
      },
    },

    updateTripMeta(
      state,
      action: PayloadAction<{
        tripId: string;
        changes: Partial<
          Pick<
            Trip,
            "destinationCode" | "destinationName" | "destinationEmoji" | "startDate" | "endDate" | "budget" | "currency"
          >
        >;
      }>,
    ) {
      const trip = findTrip(state, action.payload.tripId);
      Object.assign(trip, action.payload.changes);
      touch(trip);
    },

    setTripDays(state, action: PayloadAction<{ tripId: string; days: TripDay[] }>) {
      const trip = findTrip(state, action.payload.tripId);
      trip.days = action.payload.days;
      touch(trip);
    },

    deleteTrip(state, action: PayloadAction<{ tripId: string }>) {
      state.items = state.items.filter((t) => t.id !== action.payload.tripId);
    },

    addActivity: {
      reducer(
        state,
        action: PayloadAction<{ tripId: string; dayId: string; activity: TripActivity }>,
      ) {
        const trip = findTrip(state, action.payload.tripId);
        const day = findDay(trip, action.payload.dayId);
        day.activities.push(action.payload.activity);
        touch(trip);
      },
      prepare(input: { tripId: string; dayId: string; activity: Omit<TripActivity, "id"> }) {
        return {
          payload: {
            tripId: input.tripId,
            dayId: input.dayId,
            activity: { ...input.activity, id: crypto.randomUUID() },
          },
        };
      },
    },

    updateActivity(
      state,
      action: PayloadAction<{
        tripId: string;
        dayId: string;
        activityId: string;
        changes: Partial<Omit<TripActivity, "id">>;
      }>,
    ) {
      const trip = findTrip(state, action.payload.tripId);
      const day = findDay(trip, action.payload.dayId);
      const activity = day.activities.find((a) => a.id === action.payload.activityId);
      if (!activity) throw new Error("Activity not found");
      Object.assign(activity, action.payload.changes);
      touch(trip);
    },

    removeActivity(
      state,
      action: PayloadAction<{ tripId: string; dayId: string; activityId: string }>,
    ) {
      const trip = findTrip(state, action.payload.tripId);
      const day = findDay(trip, action.payload.dayId);
      day.activities = day.activities.filter((a) => a.id !== action.payload.activityId);
      touch(trip);
    },

    /**
     * Reorders or moves an activity, supporting both same-day reordering
     * and cross-day drag and drop (used by the itinerary board).
     */
    moveActivity(
      state,
      action: PayloadAction<{
        tripId: string;
        fromDayId: string;
        toDayId: string;
        activityId: string;
        toIndex: number;
      }>,
    ) {
      const trip = findTrip(state, action.payload.tripId);
      const fromDay = findDay(trip, action.payload.fromDayId);
      const toDay = findDay(trip, action.payload.toDayId);
      const fromIndex = fromDay.activities.findIndex((a) => a.id === action.payload.activityId);
      if (fromIndex === -1) return;
      const [activity] = fromDay.activities.splice(fromIndex, 1);
      const clampedIndex = Math.max(0, Math.min(action.payload.toIndex, toDay.activities.length));
      toDay.activities.splice(clampedIndex, 0, activity);
      touch(trip);
    },

    setSyncStatus(state, action: PayloadAction<{ tripId: string; status: SyncStatus }>) {
      const trip = findTrip(state, action.payload.tripId);
      trip.syncStatus = action.payload.status;
    },

    hydrateTrips(state, action: PayloadAction<Trip[]>) {
      state.items = action.payload;
    },
  },
});

export const {
  addTrip,
  updateTripMeta,
  setTripDays,
  deleteTrip,
  addActivity,
  updateActivity,
  removeActivity,
  moveActivity,
  setSyncStatus,
  hydrateTrips,
} = tripsSlice.actions;

export default tripsSlice.reducer;
