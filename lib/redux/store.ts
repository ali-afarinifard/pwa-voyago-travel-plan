import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { createIndexedDbStorage } from "./storage";
import { baseApi } from "./api/baseApi";
import uiReducer from "./slices/uiSlice";
import tripsReducer from "./slices/tripsSlice";
import offlineQueueReducer from "./slices/offlineQueueSlice";

// `ui` is small and read on every paint (theme, units) -> localStorage is fine.
const uiPersistConfig = {
  key: "voyago:ui",
  storage,
  whitelist: ["theme", "tempUnit", "currencyBase"],
};

// `trips` and the offline queue can grow and must survive offline ->
// back them with IndexedDB instead of localStorage.
const tripsPersistConfig = {
  key: "voyago:trips",
  storage: createIndexedDbStorage("trips"),
};

const offlineQueuePersistConfig = {
  key: "voyago:offlineQueue",
  storage: createIndexedDbStorage("offlineQueue"),
};

const rootReducer = combineReducers({
  ui: persistReducer(uiPersistConfig, uiReducer),
  trips: persistReducer(tripsPersistConfig, tripsReducer),
  offlineQueue: persistReducer(offlineQueuePersistConfig, offlineQueueReducer),
  [baseApi.reducerPath]: baseApi.reducer,
});

export function makeStore() {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(baseApi.middleware),
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
