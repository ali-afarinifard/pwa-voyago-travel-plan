import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { OfflineMutationKind, OfflineQueueItem } from "@/lib/types/travel";

export interface OfflineQueueState {
  items: OfflineQueueItem[];
}

const initialState: OfflineQueueState = {
  items: [],
};

const offlineQueueSlice = createSlice({
  name: "offlineQueue",
  initialState,
  reducers: {
    enqueueMutation: {
      reducer(state, action: PayloadAction<OfflineQueueItem>) {
        state.items.push(action.payload);
      },
      prepare(input: { kind: OfflineMutationKind; payload: unknown }) {
        return {
          payload: {
            id: crypto.randomUUID(),
            kind: input.kind,
            payload: input.payload,
            createdAt: new Date().toISOString(),
          } satisfies OfflineQueueItem,
        };
      },
    },
    dequeueMutation(state, action: PayloadAction<{ id: string }>) {
      state.items = state.items.filter((item) => item.id !== action.payload.id);
    },
    clearQueue(state) {
      state.items = [];
    },
  },
});

export const { enqueueMutation, dequeueMutation, clearQueue } = offlineQueueSlice.actions;
export default offlineQueueSlice.reducer;
