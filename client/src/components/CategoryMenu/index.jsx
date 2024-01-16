import { useQuery } from '@apollo/client'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { idbPromise } from '../../utils/helpers'
import { QUERY_CATEGORIES } from '../../utils/queries'

import { updateCategories } from '../../redux/categoriesSlice'
import { updateCurrentCategory } from '../../redux/currentCategorySlice'

function CategoryMenu() {
	// Initialize useDispatch and useSelector hooks from React Redux
	const dispatch = useDispatch()
	const categories = useSelector((state) => state.categories)

	// Use Apollo useQuery hook to fetch category data
	const { loading, data: categoryData } = useQuery(QUERY_CATEGORIES)

	// useEffect hook to handle updates when categoryData or loading changes
	useEffect(() => {
		// Check if categoryData is available
		if (categoryData) {
			// Dispatch the updateCategories action to update Redux store
			dispatch(updateCategories(categoryData.categories))

			// Update IndexedDB with the new categories data
			categoryData.categories.forEach((category) => {
				idbPromise('categories', 'put', category)
			})
		} else if (!loading) {
			// If categoryData is not available and not loading, retrieve data from IndexedDB
			idbPromise('categories', 'get').then((categories) => {
				dispatch(updateCategories(categories))
			})
		}
	}, [categoryData, loading, dispatch])

	// Handle click event for category buttons
	const handleClick = (id) => {
		// Dispatch the updateCurrentCategory action with the selected category ID
		dispatch(updateCurrentCategory(id))
	}

	return (
		<div>
			<h2>Choose a Category:</h2>
			{categories.map((item) => (
				<button
					key={item._id}
					onClick={() => {
						handleClick(item._id)
					}}>
					{item.name}
				</button>
			))}
			<button
				onClick={() => {
					handleClick('')
				}}>
				All
			</button>
		</div>
	)
}

export default CategoryMenu
