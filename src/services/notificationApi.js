import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/notifications/`;

export const notificationApi = createApi({
  reducerPath: "notificationApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("Authorization", `Token ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Notification"],
  endpoints: (builder) => ({

    // GET /notifications/?user=<id>  — fetch notifications for a user
    getNotifications: builder.query({
      query: ({ userId } = {}) => ({
        url: "",
        params: userId ? { user: userId } : {},
      }),
      providesTags: ["Notification"],
    }),

    // GET /notifications/<id>/
    getNotificationById: builder.query({
      query: (id) => `${id}/`,
      providesTags: (result, error, id) => [{ type: "Notification", id }],
    }),

    // POST /notifications/  — admin sends a query/message to a user
    // 'user' must be the PK of the User (int or UUID) — matches the model FK
    sendNotification: builder.mutation({
      query: ({ userId, subject, content }) => ({
        url: "",
        method: "POST",
        body: {
          user: userId,   // FK — must be the user's PK, not a nested object
          subject,
          content,
        },
      }),
      invalidatesTags: ["Notification"],
    }),

    // DELETE /notifications/<id>/
    deleteNotification: builder.mutation({
      query: (id) => ({
        url: `${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notification"],
    }),

  }),
});

export const {
  useGetNotificationsQuery,
  useGetNotificationByIdQuery,
  useSendNotificationMutation,
  useDeleteNotificationMutation,
} = notificationApi;