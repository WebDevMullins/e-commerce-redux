import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { idbPromise, pluralize } from '../../utils/helpers'

import { addToCart, updateCartQuantity } from '../../redux/cartSlice'

function ProductItem(item) {
	// Initialize useDispatch and useSelector hooks from React Redux
	const dispatch = useDispatch()
	const { cart } = useSelector((state) => state.cart)

	// Destructure properties from the item object
	const { image, name, _id, price, quantity } = item

	// Function to handle adding a product to the cart
	const addToCartClick = () => {
		// Check if the item is already in the cart
		const itemInCart = cart.find((cartItem) => cartItem._id === _id)

		if (itemInCart) {
			// If item is in cart, update the quantity in the Redux store
			dispatch(
				updateCartQuantity({
					_id: _id,
					purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
				})
			)

			// Update the quantity in IndexedDB
			idbPromise('cart', 'put', {
				...itemInCart,
				purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
			})
		} else {
			// If item is not in cart, add it to the Redux store
			dispatch(addToCart({ ...item, purchaseQuantity: 1 }))

			// Add the item to IndexedDB with quantity 1
			idbPromise('cart', 'put', { ...item, purchaseQuantity: 1 })
		}
	}

	return (
		<div className='card px-1 py-1'>
			<Link to={`/products/${_id}`}>
				<img alt={name} src={`/images/${image}`} />
				<p>{name}</p>
			</Link>
			<div>
				<div>
					{quantity} {pluralize('item', quantity)} in stock
				</div>
				<span>${price}</span>
			</div>
			<button onClick={addToCartClick}>Add to cart</button>
		</div>
	)
}

export default ProductItem
