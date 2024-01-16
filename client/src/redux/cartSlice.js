import { createSlice } from '@reduxjs/toolkit';

export const cartSlice = createSlice({
	name: 'cart',
	initialState: { open: false, items: [] },
	reducers: {
		addToCart: (state, action) => {
			state.open = true;
			state.items.push(action.payload);
		},
		addMultipleToCart: (state, action) => {
			state.items.push(...action.payload);
		},
		updateCartQuantity: (state, action) => {
			state.open = true;
			state.items = state.items.map((item) => {
				if (item._id === action.payload._id) {
					item.purchaseQuantity = action.payload.purchaseQuantity;
				}
				return item;
			});
		},
		removeFromCart: (state, action) => {
			state.open = state.items.length > 1;
			state.items = state.items.filter((item) => {
				return item._id !== action.payload;
			});
		},
		clearCart: (state) => {
			state.open = false;
			state.items = [];
		},
		toggleCart: (state) => {
			state.open = !state.open;
		},
	},
});

export const { addToCart, addMultipleToCart, updateCartQuantity, removeFromCart, clearCart, toggleCart } = cartSlice.actions;

export default cartSlice.reducer;