import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Base URL points to /ads/ — router registers 'organizations' and 'images'
const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/ads/`;

export const adsApi = createApi({
  reducerPath: "adsApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) headers.set("Authorization", `Token ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Ad", "AdImage"],
  endpoints: (builder) => ({
    // ── Ads (/ads/organizations/) ──────────────────────────────────────────
    getAds: builder.query({
      query: ({ company } = {}) => ({
        url: "organizations/",
        params: company ? { company } : {},
      }),
      providesTags: ["Ad"],
    }),

    getAdById: builder.query({
      query: (id) => `organizations/${id}/`,
      providesTags: (result, error, id) => [{ type: "Ad", id }],
    }),

    createAd: builder.mutation({
      query: (data) => ({
        url: "organizations/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Ad"],
    }),

    updateAd: builder.mutation({
      query: ({ id, data }) => ({
        url: `organizations/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Ad"],
    }),

    deleteAd: builder.mutation({
      query: (id) => ({
        url: `organizations/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Ad"],
    }),

    toggleAd: builder.mutation({
      query: ({ id, active }) => ({
        url: `organizations/${id}/`,
        method: "PATCH",
        body: { active },
      }),
      invalidatesTags: ["Ad"],
    }),

    // ── Ad Images (/ads/images/) ───────────────────────────────────────────
    // AdsImage is OneToOneField on Ad — so one image object per ad
    // but image field itself is a single file. To support up to 5 images,
    // create up to 5 Ad objects each with their own AdsImage.
    // OR if your backend extends AdsImage to allow multiple: use this API.

    getAdImages: builder.query({
      query: ({ company, ad } = {}) => ({
        url: "images/",
        params: {
          ...(company ? { company } : {}),
          ...(ad ? { ad } : {}),
        },
      }),
      providesTags: ["AdImage"],
    }),

    // Single image upload — ForeignKey means one AdsImage record per image
    createAdImage: builder.mutation({
      query: ({ adId, companyId, imageFile }) => {
        const formData = new FormData();
        formData.append("ad", adId);
        formData.append("company", companyId);
        formData.append("image", imageFile);
        return {
          url: "images/",
          method: "POST",
          body: formData,
          formData: true,
        };
      },
      invalidatesTags: ["AdImage", "Ad"],
    }),

    deleteAdImage: builder.mutation({
      query: (id) => ({
        url: `images/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["AdImage", "Ad"],
    }),
  }),
});

export const {
  useGetAdsQuery,
  useGetAdByIdQuery,
  useCreateAdMutation,
  useUpdateAdMutation,
  useDeleteAdMutation,
  useToggleAdMutation,
  useGetAdImagesQuery,
  useCreateAdImageMutation,
  useDeleteAdImageMutation,
} = adsApi;
