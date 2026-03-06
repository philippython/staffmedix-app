import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/talents/`;

export const talentApi = createApi({
  reducerPath: "talentApi",
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
  tagTypes: ["TalentProfile", "Applications"],
  endpoints: (builder) => ({
    createTalentProfile: builder.mutation({
      query: ({ data }) => ({ url: "talent/", method: "POST", body: data }),
      invalidatesTags: ["TalentProfile"],
    }),

    getTalents: builder.query({
      query: ({ limit = 100, offset = 0 } = {}) => ({
        url: "talent/",
        params: { limit, offset },
      }),
      providesTags: ["TalentProfile"],
    }),

    getTalentProfile: builder.query({
      query: (talentId) => `talent/${talentId}/`,
      providesTags: (result, error, talentId) => [
        { type: "TalentProfile", id: talentId },
      ],
    }),

    getMyProfile: builder.query({
      query: (talentId) => `talent/${talentId}/`,
      providesTags: (result, error, talentId) => [
        { type: "TalentProfile", id: talentId },
      ],
    }),

    updateTalentProfile: builder.mutation({
      query: ({ talentId, data }) => ({
        url: `talent/${talentId}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { talentId }) => [
        { type: "TalentProfile", id: talentId },
      ],
    }),

    getTalentApplications: builder.query({
      query: (talentId) => `talent/${talentId}/applications/`,
      providesTags: ["Applications"],
    }),

    getTalentStats: builder.query({
      query: (talentId) => `talent/${talentId}/stats/`,
    }),

    // ── Read-only list queries (for TalentDetailView public profile) ──────
    getWorkExperiences: builder.query({
      query: (talentId) => ({
        url: "work-experience/",
        params: { talent: talentId },
      }),
      providesTags: ["TalentProfile"],
    }),

    getEducations: builder.query({
      query: (talentId) => ({
        url: "education/",
        params: { talent: talentId },
      }),
      providesTags: ["TalentProfile"],
    }),

    getSkills: builder.query({
      query: (talentId) => ({ url: "skill/", params: { talent: talentId } }),
      providesTags: ["TalentProfile"],
    }),

    getCredentials: builder.query({
      query: (talentId) => ({
        url: "credential/",
        params: { talent: talentId },
      }),
      providesTags: ["TalentProfile"],
    }),

    // ── Work Experience mutations ─────────────────────────────────────────
    addWorkExperience: builder.mutation({
      query: ({ talentId, data }) => ({
        url: "work-experience/",
        method: "POST",
        body: { ...data, talent: talentId },
      }),
      invalidatesTags: (result, error, { talentId }) => [
        { type: "TalentProfile", id: talentId },
      ],
    }),

    updateWorkExperience: builder.mutation({
      query: ({ workId, data }) => ({
        url: `work-experience/${workId}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { talentId }) => [
        { type: "TalentProfile", id: talentId },
      ],
    }),

    deleteWorkExperience: builder.mutation({
      query: ({ workId }) => ({
        url: `work-experience/${workId}/`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { talentId }) => [
        { type: "TalentProfile", id: talentId },
      ],
    }),

    // ── Education mutations ───────────────────────────────────────────────
    addEducation: builder.mutation({
      query: ({ talentId, data }) => ({
        url: "education/",
        method: "POST",
        body: { ...data, talent: talentId },
      }),
      invalidatesTags: (result, error, { talentId }) => [
        { type: "TalentProfile", id: talentId },
      ],
    }),

    updateEducation: builder.mutation({
      query: ({ educationId, data }) => ({
        url: `education/${educationId}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { talentId }) => [
        { type: "TalentProfile", id: talentId },
      ],
    }),

    deleteEducation: builder.mutation({
      query: ({ educationId }) => ({
        url: `education/${educationId}/`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { talentId }) => [
        { type: "TalentProfile", id: talentId },
      ],
    }),

    // ── Skill mutations ───────────────────────────────────────────────────
    addSkill: builder.mutation({
      query: ({ talentId, data }) => ({
        url: "skill/",
        method: "POST",
        body: { ...data, talent: talentId },
      }),
      invalidatesTags: (result, error, { talentId }) => [
        { type: "TalentProfile", id: talentId },
      ],
    }),

    deleteSkill: builder.mutation({
      query: ({ skillId }) => ({ url: `skill/${skillId}/`, method: "DELETE" }),
      invalidatesTags: (result, error, { talentId }) => [
        { type: "TalentProfile", id: talentId },
      ],
    }),

    // ── Credential mutations ──────────────────────────────────────────────
    uploadCredential: builder.mutation({
      query: ({ talentId, data }) => {
        data.append("talent", talentId);
        return { url: "credential/", method: "POST", body: data };
      },
      invalidatesTags: (result, error, { talentId }) => [
        { type: "TalentProfile", id: talentId },
      ],
    }),

    deleteCredential: builder.mutation({
      query: ({ credentialId }) => ({
        url: `credential/${credentialId}/`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { talentId }) => [
        { type: "TalentProfile", id: talentId },
      ],
    }),

    // ── Profile Image ─────────────────────────────────────────────────────
    uploadProfileImage: builder.mutation({
      query: ({ talentId, formData }) => {
        formData.append("talent", talentId);
        return { url: "talent-profile-image/", method: "POST", body: formData };
      },
      invalidatesTags: (result, error, { talentId }) => [
        { type: "TalentProfile", id: talentId },
      ],
    }),
  }),
});

export const {
  useGetTalentsQuery,
  useCreateTalentProfileMutation,
  useGetTalentProfileQuery,
  useGetMyProfileQuery,
  useUpdateTalentProfileMutation,
  useGetTalentApplicationsQuery,
  useGetTalentStatsQuery,
  useGetWorkExperiencesQuery,
  useGetEducationsQuery,
  useGetSkillsQuery,
  useGetCredentialsQuery,
  useAddWorkExperienceMutation,
  useUpdateWorkExperienceMutation,
  useDeleteWorkExperienceMutation,
  useAddEducationMutation,
  useUpdateEducationMutation,
  useDeleteEducationMutation,
  useAddSkillMutation,
  useDeleteSkillMutation,
  useUploadCredentialMutation,
  useDeleteCredentialMutation,
  useUploadProfileImageMutation,
} = talentApi;
