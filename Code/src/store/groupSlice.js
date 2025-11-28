import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  groupName: "",
  members: [],
};

export const groupSlice = createSlice({
  name: "group",
  initialState,
  reducers: {
    setGoupName: (state, action) => {
      state.groupName = action.payload;
    },
    addMember: (state, action) => {
      state.members.push(action.payload);
    },
    removeMember: (state, action) => {
      state.members = state.members.filter((_, i) => i !== action.payload);
    },
  },
});

// Action creators are generated for each case reducer function
export const { setGoupName, addMember, removeMember } = groupSlice.actions;

export default groupSlice.reducer;
