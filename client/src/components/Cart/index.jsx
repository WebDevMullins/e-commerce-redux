import { useLazyQuery } from '@apollo/client'
import { loadStripe } from '@stripe/stripe-js'
import { useEffect } from 'react'

import Auth from '../../utils/auth'
import { idbPromise } from '../../utils/helpers'
import { QUERY_CHECKOUT } from '../../utils/queries'
import CartItem from '../CartItem'
import './style.css'

import { useDispatch, useSelector } from 'react-redux'
import { addMultipleToCart, toggleCart } from '../../redux/cartSlice'

const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx')

const Cart = () => {
	// Initialize useDispatch and useSelector hooks from React Redux
	const dispatch = useDispatch()
	const { cart, open } = useSelector((state) => state.cart)

	// Use Apollo useLazyQuery hook to fetch checkout data
	const [getCheckout, { data }] = useLazyQuery(QUERY_CHECKOUT)

	// useEffect hook to handle redirects after successful checkout
	useEffect(() => {
		if (data) {
			// Redirect to Stripe checkout using the obtained session ID
			stripePromise.then((res) => {
				res.redirectToCheckout({ sessionId: data.checkout.session })
			})
		}
	}, [data])

	// useEffect hook to get cart data from IndexedDB and update Redux store
	useEffect(() => {
		async function getCart() {
			const cart = await idbPromise('cart', 'get')
			dispatch(addMultipleToCart([...cart]))
		}

		// Check if cart is empty and fetch data if needed
		if (!cart.length) {
			getCart()
		}
	}, [cart.length, dispatch])

	// Function to toggle cart visibility
	function toggleCartClick() {
		dispatch(toggleCart())
	}

	// Function to calculate the total price of items in the cart
	function calculateTotal() {
		let sum = 0
		cart.forEach((item) => {
			sum += item.price * item.purchaseQuantity
		})
		return sum.toFixed(2)
	}

	// Function to submit checkout request with product IDs
	function submitCheckout() {
		const productIds = []

		cart.forEach((item) => {
			for (let i = 0; i < item.purchaseQuantity; i++) {
				productIds.push(item._id)
			}
		})

		// Trigger the getCheckout function with product IDs
		getCheckout({
			variables: { products: productIds }
		})
	}

	if (!open) {
		return (
			<div className='cart-closed' onClick={toggleCartClick}>
				<span role='img' aria-label='trash'>
					🛒
				</span>
			</div>
		)
	}

	return (
		<div className='cart'>
			<div className='close' onClick={toggleCartClick}>
				[close]
			</div>
			<h2>Shopping Cart</h2>
			{cart.length ? (
				<div>
					{cart.map((item) => (
						<CartItem key={item._id} item={item} />
					))}

					<div className='flex-row space-between'>
						<strong>Total: ${calculateTotal()}</strong>

						{Auth.loggedIn() ? <button onClick={submitCheckout}>Checkout</button> : <span>(log in to check out)</span>}
					</div>
				</div>
			) : (
				<h3>
					<span role='img' aria-label='shocked'>
						😱
					</span>
					You haven&apos;t added anything to your cart yet!
				</h3>
			)}
		</div>
	)
}

export default Cart
