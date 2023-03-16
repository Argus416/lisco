import { createSlice } from "@reduxjs/toolkit";

const initalValues = {};

export const userSlice = createSlice({
	name: "students",
	initialState: initalValues,
	reducers: {
		updateStudents: (state, action) => {
			state.value = action.payload;
		},
	},
});

export const { updateStudents } = userSlice.actions;

export default userSlice.reducer;
