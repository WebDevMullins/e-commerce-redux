import { useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'

import spinner from '../assets/spinner.gif'
import Cart from '../components/Cart'

import { idbPromise } from '../utils/helpers'
import { QUERY_PRODUCTS } from '../utils/queries'

import { addToCart, removeFromCart, updateCartQuantity } from '../redux/cartSlice'
import { updateProducts } from '../redux/productsSlice'

function Detail() {
	// Initialize useDispatch and useSelector hooks from React Redux
	const dispatch = useDispatch()
	const { cart } = useSelector((state) => state.cart)
	const products = useSelector((state) => state.products)

	// Get product ID from route parameters
	const { id } = useParams()

	// State to hold the current product details
	const [currentProduct, setCurrentProduct] = useState({})

	// Use Apollo useQuery hook to fetch product data
	const { loading, data } = useQuery(QUERY_PRODUCTS)

	// useEffect hook to update currentProduct based on product ID
	useEffect(() => {
		// If products are already in the global store, find the current product
		if (products.length) {
			setCurrentProduct(products.find((product) => product._id === id))
		}
		// If data is retrieved from the server, update the products in the Redux store and IndexedDB
		else if (data) {
			dispatch(updateProducts(data.products))

			data.products.forEach((product) => {
				idbPromise('products', 'put', product)
			})
		}
		// If data is not available and not loading, get products from IndexedDB
		else if (!loading) {
			idbPromise('products', 'get').then((indexedProducts) => {
				dispatch(updateProducts(indexedProducts))
			})
		}
	}, [products, data, loading, dispatch, id])

	// Function to handle adding the current product to the cart
	const addToCartClick = () => {
		const itemInCart = cart.find((cartItem) => cartItem._id === id)
		if (itemInCart) {
			// If item is in cart, update the quantity in the Redux store and IndexedDB
			dispatch(updateCartQuantity({ _id: id, purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1 }))
			idbPromise('cart', 'put', {
				...itemInCart,
				purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
			})
		} else {
			// If item is not in cart, add it to the Redux store and IndexedDB
			dispatch(addToCart({ ...currentProduct, purchaseQuantity: 1 }))
			idbPromise('cart', 'put', { ...currentProduct, purchaseQuantity: 1 })
		}
	}

	// Function to handle removing the current product from the cart
	const removeFromCartClick = () => {
		dispatch(removeFromCart(currentProduct._id))

		// Remove the item from IndexedDB
		idbPromise('cart', 'delete', { ...currentProduct })
	}

	return (
		<>
			{currentProduct && cart ? (
				<div className='container my-1'>
					<Link to='/'>← Back to Products</Link>

					<h2>{currentProduct.name}</h2>

					<p>{currentProduct.description}</p>

					<p>
						<strong>Price:</strong>${currentProduct.price} <button onClick={addToCartClick}>Add to Cart</button>
						<button disabled={!cart.find((p) => p._id === currentProduct._id)} onClick={removeFromCartClick}>
							Remove from Cart
						</button>
					</p>

					<img src={`/images/${currentProduct.image}`} alt={currentProduct.name} />
				</div>
			) : null}
			{loading ? <img src={spinner} alt='loading' /> : null}
			<Cart />
		</>
	)
}

export default Detail
