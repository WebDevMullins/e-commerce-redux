import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './productsSlice';
import cartReducer from './cartSlice';
import categoriesReducer from './categoriesSlice';
import currentCategoryReducer from './currentCategorySlice';

export default configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    categories: categoriesReducer,
    currentCategory: currentCategoryReducer,
  },
});