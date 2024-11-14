import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    permissions: {
        canManageProducts: false,
        canManageOrders: false,
        canManageCustomers: false,
        canManageShops: false,
    },
};

const permissionsSlice = createSlice({
    name: 'permissions',
    initialState,
    reducers: {
        setPermissions: (state, action) => {
            const permissionsArray = action.payload
                .replace(/^"(.*)"$/, '$1')  // Loại bỏ dấu ngoặc kép
                .split(',');  // Tách chuỗi thành mảng

            // Kiểm tra từng quyền và cập nhật state
            state.permissions.canManageProducts = permissionsArray.includes('Manage products');
            state.permissions.canManageOrders = permissionsArray.includes('Manage orders');
            state.permissions.canManageCustomers = permissionsArray.includes('Manage customers');
            state.permissions.canManageShops = permissionsArray.includes('Manage Shops');

            // Lưu permissions vào localStorage
            localStorage.setItem('permissions', JSON.stringify(state.permissions));
        },
        loadPermissions: (state) => {
            const storedPermissions = localStorage.getItem('permissions');
            if (storedPermissions) {
                state.permissions = JSON.parse(storedPermissions);
            }
        },
    },
});

// Xuất actions và reducer
export const { setPermissions, loadPermissions } = permissionsSlice.actions;
export default permissionsSlice.reducer;