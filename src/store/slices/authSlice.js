// features/auth/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  expiry: null,
  token: null,
  isAuthenticated: false,
  role: "talent",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.expiry = action.payload.expiry;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    roleToggle: (state) => {
      state.role = state.role === "talent" ? "employer" : "talent";
    },
  },
});

export const { loginSuccess, logout, roleToggle } = authSlice.actions;
export default authSlice.reducer;
