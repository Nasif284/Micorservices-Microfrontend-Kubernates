import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SettingsState {
  theme: "light" | "dark";
  notifications: boolean;
}

const initialState: SettingsState = {
  theme: "light",
  notifications: true,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,

  reducers: {
    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.theme = action.payload;
    },

    setNotifications: (state, action: PayloadAction<boolean>) => {
      state.notifications = action.payload;
    },
  },
});

export const { setTheme, setNotifications } = settingsSlice.actions;

export default settingsSlice.reducer;
