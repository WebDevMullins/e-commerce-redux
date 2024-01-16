import { useQuery } from '@apollo/client'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import spinner from '../../assets/spinner.gif'
import { idbPromise } from '../../utils/helpers'
import { QUERY_PRODUCTS } from '../../utils/queries'
import ProductItem from '../ProductItem'

import { updateProducts } from '../../redux/productsSlice'

function ProductList() {
	// Initialize useDispatch and useSelector hooks from React Redux
	const dispatch = useDispatch()
	const { currentCategory, products } = useSelector((state) => state)

	// Use Apollo useQuery hook to fetch product data
	const { loading, data } = useQuery(QUERY_PRODUCTS)

	// useEffect hook to handle updates when data or loading changes
	useEffect(() => {
		// Check if data is available
		if (data) {
			// Dispatch the updateProducts action to update Redux store
			dispatch(updateProducts(data.products))

			// Update IndexedDB with the new products data
			data.products.forEach((product) => {
				idbPromise('products', 'put', product)
			})
		} else if (!loading) {
			// If data is not available and not loading, retrieve data from IndexedDB
			idbPromise('products', 'get').then((products) => {
				dispatch(updateProducts(products))
			})
		}
	}, [data, loading, dispatch])

	// Function to filter products based on the current category
	function filterProducts() {
		if (!currentCategory) {
			return products
		}

		return products.filter((product) => product.category._id === currentCategory)
	}

	return (
		<div className='my-2'>
			<h2>Our Products:</h2>
			{/* Check if products are available */}
			{products.length ? (
				<div className='flex-row'>
					{/* Map through filtered products and render ProductItem for each product */}
					{filterProducts().map((product) => (
						<ProductItem
							key={product._id}
							_id={product._id}
							image={product.image}
							name={product.name}
							price={product.price}
							quantity={product.quantity}
						/>
					))}
				</div>
			) : (
				/* Display message if no products are available */
				<h3>You haven&apos;t added any products yet!</h3>
			)}
			{/* Display spinner if data is still loading */}
			{loading ? <img src={spinner} alt='loading' /> : null}
		</div>
	)
}

export default ProductList
