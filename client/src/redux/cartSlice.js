import { createSlice } from '@reduxjs/toolkit'

export const cartSlice = createSlice({
	name: 'cart',
	initialState: { open: false, cart: [] },
	reducers: {
		addToCart: (state, action) => {
			state.open = true
			state.cart.push(action.payload)
		},
		addMultipleToCart: (state, action) => {
			state.cart.push(...action.payload)
		},
		updateCartQuantity: (state, action) => {
			state.open = true
			state.cart = state.cart.map((item) => {
				if (item._id === action.payload._id) {
					item.purchaseQuantity = action.payload.purchaseQuantity
				}
				return item
			})
		},
		removeFromCart: (state, action) => {
			state.open = state.cart.length > 1
			state.cart = state.cart.filter((item) => {
				return item._id !== action.payload
			})
		},
		clearCart: (state) => {
			state.open = false
			state.cart = []
		},
		toggleCart: (state) => {
			state.open = !state.open
		}
	}
})

export const { addToCart, addMultipleToCart, updateCartQuantity, removeFromCart, clearCart, toggleCart } =
	cartSlice.actions

export default cartSlice.reducer
