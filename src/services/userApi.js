import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/users/`;

export const userApi = createApi({
  reducerPath: "userApi",
  tagTypes: ["User"],
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
    /** POST /users/ */
    createUser: builder.mutation({
      query: (credentials) => ({
        url: "",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),

    /** GET /users/who-am-i/ */
    whoAmI: builder.query({
      query: () => "who-am-i",
    }),

    /** GET /users/?role=&is_active=&search=&limit=&offset= */
    getAllUsers: builder.query({
      query: ({ role, is_active, search, limit = 20, offset = 0 } = {}) => ({
        url: "",
        params: {
          ...(role      !== undefined && { role }),
          ...(is_active !== undefined && { is_active }),
          ...(search    && { search }),
          limit,
          offset,
        },
      }),
      providesTags: ["User"],
    }),

    /** PATCH /users/<id>/ */
    toggleUserStatus: builder.mutation({
      query: ({ userId, is_active }) => ({
        url: `${userId}/`,
        method: "PATCH",
        body: { is_active },
      }),
      invalidatesTags: ["User"],
    }),

    /** DELETE /users/<id>/ */
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `${userId}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useCreateUserMutation,
  useWhoAmIQuery,
  useGetAllUsersQuery,
  useToggleUserStatusMutation,
  useDeleteUserMutation,
} = userApi;