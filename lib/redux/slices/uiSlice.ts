import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type ThemeMode = "light" | "dark" | "system";
export type TempUnit = "celsius" | "fahrenheit";

export interface UiState {
  theme: ThemeMode;
  tempUnit: TempUnit;
  currencyBase: string;
  /** Set at runtime from navigator.onLine + online/offline events; not persisted. */
  isOnline: boolean;
}

const initialState: UiState = {
  theme: "system",
  tempUnit: "celsius",
  currencyBase: "USD",
  isOnline: true,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<ThemeMode>) {
      state.theme = action.payload;
    },
    setTempUnit(state, action: PayloadAction<TempUnit>) {
      state.tempUnit = action.payload;
    },
    setCurrencyBase(state, action: PayloadAction<string>) {
      state.currencyBase = action.payload;
    },
    setOnlineStatus(state, action: PayloadAction<boolean>) {
      state.isOnline = action.payload;
    },
  },
});

export const { setTheme, setTempUnit, setCurrencyBase, setOnlineStatus } = uiSlice.actions;
export default uiSlice.reducer;
