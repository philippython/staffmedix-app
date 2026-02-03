import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  title: "",
  location: "",
  ordering: null,
  shift_type: [],
  employment_type: [],
  experience_level: null,
};

const jobFilterSlice = createSlice({
  name: "jobFilter",
  initialState,
  reducers: {
    // Update one or multiple filters
    updateFilters: (state, action) => {
      Object.assign(state, action.payload);
    },

    // Clear all filters
    clearAllFilters: () => initialState,

    toggleMultiFilter: (state, action) => {
      const { field, value } = action.payload;

      if (!state[field]) return;

      if (state[field].includes(value)) {
        state[field] = state[field].filter((v) => v !== value);
      } else {
        state[field].push(value);
      }
    },
  },
});

export const { updateFilters, clearAllFilters, toggleMultiFilter } =
  jobFilterSlice.actions;

export default jobFilterSlice.reducer;
