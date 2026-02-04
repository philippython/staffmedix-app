import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  title: "",
  location: "",
  ordering: "Most recent",
  shift_type: [],
  employment_type: [],
  experience: [],
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

      let processedValue = value;

      // Special handling for experience level
      if (field === "experience") {
        const match = value.match(/\((\d+)(?:-|[+])/);
        if (match) {
          processedValue = Number(match[1]);
        }
      }

      if (state[field].includes(processedValue)) {
        state[field] = state[field].filter((v) => v !== processedValue);
      } else {
        state[field].push(processedValue);
      }
    },
  },
});

export const { updateFilters, clearAllFilters, toggleMultiFilter } =
  jobFilterSlice.actions;

export default jobFilterSlice.reducer;
