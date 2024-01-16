import { createSlice } from '@reduxjs/toolkit';

export const productsSlice = createSlice({
	name: 'products',
	initialState: [],
	reducers: {
		updateProducts: (state, action) => {
			return action.payload;
		},
	},
});

export const { updateProducts } = productsSlice.actions;

export default productsSlice.reducer;