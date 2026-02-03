import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from "./slices/authSlice";
import jobFilterReducer from "./slices/jobFilterSlice";
import { jobsApi } from "../services/jobsApi";
import { authApi } from "../services/authApi";
import { userApi } from "../services/userApi";

const store = configureStore({
  reducer: {
    // Api services
    [jobsApi.reducerPath]: jobsApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,

    // reducers
    auth: authReducer,
    jobFilter: jobFilterReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      jobsApi.middleware,
      authApi.middleware,
      userApi.middleware,
    ),
});

setupListeners(store.dispatch);

export default store;
