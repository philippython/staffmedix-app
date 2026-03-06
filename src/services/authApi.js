import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/auth/`;

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "login/",
        method: "POST",
        body: credentials,
      }),
    }),

    passwordReset: builder.mutation({
      query: (email) => ({
        url: "password_reset/",
        method: "POST",
        body: email,
      }),
    }),
    passwordResetConfirm: builder.mutation({
      query: (credentials) => ({
        url: "password_reset/confirm/",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  usePasswordResetMutation,
  usePasswordResetConfirmMutation,
} = authApi;
