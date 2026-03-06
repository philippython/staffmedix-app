import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/users/`;

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("Authorization", `Token ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    createUser: builder.mutation({
      query: (credentials) => ({
        url: "",
        method: "POST",
        body: credentials,
      }),
    }),

    whoAmI: builder.query({
      query: () => "who-am-i",
    }),
  }),
});

export const { useCreateUserMutation, useWhoAmIQuery } = userApi;
