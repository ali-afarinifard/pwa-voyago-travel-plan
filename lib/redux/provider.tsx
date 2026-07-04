"use client";

import { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import { setupListeners } from "@reduxjs/toolkit/query";
import { persistStore, type Persistor } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { makeStore, type AppStore } from "./store";
import { setOnlineStatus } from "./slices/uiSlice";

/**
 * Tracks browser connectivity into Redux so any component can render an
 * "offline" state, and re-enables RTK Query refetch-on-reconnect.
 */
function ConnectivitySync({ store }: { store: AppStore }) {
  useEffect(() => {
    const update = () => store.dispatch(setOnlineStatus(navigator.onLine));
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, [store]);

  return null;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore | null>(null);
  const persistorRef = useRef<Persistor | null>(null);

  if (!storeRef.current) {
    storeRef.current = makeStore();
    persistorRef.current = persistStore(storeRef.current);
    setupListeners(storeRef.current.dispatch);
  }

  return (
    <Provider store={storeRef.current}>
      <PersistGate loading={null} persistor={persistorRef.current!}>
        <ConnectivitySync store={storeRef.current} />
        {children}
      </PersistGate>
    </Provider>
  );
}
