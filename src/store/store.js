import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from "./slices/authSlice";
import jobFilterReducer from "./slices/jobFilterSlice";
import { jobsApi } from "../services/jobsApi";
import { authApi } from "../services/authApi";
import { userApi } from "../services/userApi";
import { talentApi } from "../services/talentApi";
import { employerApi } from "../services/employerApi";

const store = configureStore({
  reducer: {
    // Api services
    [jobsApi.reducerPath]: jobsApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [talentApi.reducerPath]: talentApi.reducer,
    [employerApi.reducerPath]: employerApi.reducer,

    // reducers
    auth: authReducer,
    jobFilter: jobFilterReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      jobsApi.middleware,
      authApi.middleware,
      userApi.middleware,
      talentApi.middleware,
      employerApi.middleware,
    ),
});

setupListeners(store.dispatch);

export default store;
