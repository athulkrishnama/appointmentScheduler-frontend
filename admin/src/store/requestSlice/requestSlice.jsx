import { createSlice } from '@reduxjs/toolkit';


const requestSlice = createSlice({
  name: 'requests',
  initialState: {
    items: [],
  },
  reducers: {
    setRequests: (state, action) => {
      state.items = action.payload;
    },
    removeRequest: (state, action) => {
      state.items = state.items.filter(item => item._id !== action.payload);
    },
  },
});

export const { setRequests, removeRequest } = requestSlice.actions;
export default requestSlice.reducer;