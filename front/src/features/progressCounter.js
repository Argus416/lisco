import { createSlice } from "@reduxjs/toolkit";

const initalValues = { start: 1 };

export const progressCounterSlice = createSlice({
	name: "progressCounter",
	initialState: initalValues,
	reducers: {
		updateProgressCounter: (state, action) => {
			state.value = action.payload;
		},
	},
});

export const { updateProgressCounter } = progressCounterSlice.actions;

export default progressCounterSlice.reducer;
