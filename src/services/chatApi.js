import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/messaging/`;

export const chatApi = createApi({
  reducerPath: "chatApi",
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
  tagTypes: ["Chat", "Message"],
  endpoints: (builder) => ({
    getChats: builder.query({
      query: () => "chats/",
      providesTags: ["Chat"],
    }),

    // Get single chat by ID
    getChatById: builder.query({
      query: (chatId) => `chats/${chatId}/`,
      providesTags: (result, error, chatId) => [{ type: "Chat", id: chatId }],
    }),

    // Start a new chat — pass { organization, talent } UUIDs
    createChat: builder.mutation({
      query: (data) => ({
        url: "chats/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Chat"],
    }),

    // Get messages for a specific chat
    getMessages: builder.query({
      query: ({ chatId, limit = 50, offset = 0 } = {}) => ({
        url: "messages/",
        params: { chat: chatId, limit, offset },
      }),
      providesTags: (result, error, { chatId }) => [
        { type: "Message", id: chatId },
      ],
    }),

    // Send a message — pass { chat, content }
    sendMessage: builder.mutation({
      query: (data) => ({
        url: "messages/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { chat }) => [
        { type: "Message", id: chat },
        "Chat", // refresh chat list so last message updates
      ],
    }),
  }),
});

export const {
  useGetChatsQuery,
  useGetChatByIdQuery,
  useCreateChatMutation,
  useGetMessagesQuery,
  useSendMessageMutation,
} = chatApi;
