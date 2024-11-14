import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import productReducer from './slices/productSlice';
import userReducer from './slices/userSlice';
import cartReducer from "./slices/cartSlice";
import permissionsReducer from './slices/permissionsSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        products: productReducer,
        user: userReducer,
        permissions: permissionsReducer,
        cart: cartReducer,
    },
});