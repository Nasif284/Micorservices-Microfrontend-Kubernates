import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  name: string;
  email: string;
  role?: "user" | "admin";
}

interface AuthState {
  user: User | null;
  userId: string | null;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  userId: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    login: (
      state,
      action: PayloadAction<{
        user: User;
        token: string;
      }>,
    ) => {
      state.user = action.payload.user;
      state.userId = action.payload.user.id;
      state.token = action.payload.token;
    },

    logout: (state) => {
      state.user = null;
      state.userId = null;
      state.token = null;
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
