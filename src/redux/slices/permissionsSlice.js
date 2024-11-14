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
            const permissionsString = action.payload || '';

    // Tạo một đối tượng permissions mặc định
    const permissionsObject = {
        canManageProducts: false,
        canManageOrders: false,
        canManageCustomers: false,
        canManageShops: false,
    };

    // Tách chuỗi thành mảng và kiểm tra từng quyền
    const permissionsArray = permissionsString.split(',').map(item => item.trim());

    permissionsObject.canManageProducts = permissionsArray.includes('Manage products');
    permissionsObject.canManageOrders = permissionsArray.includes('Manage orders');
    permissionsObject.canManageCustomers = permissionsArray.includes('Manage customers');
    permissionsObject.canManageShops = permissionsArray.includes('Manage Shops');

    // Cập nhật state với đối tượng permissions mới
    state.permissions = permissionsObject;

    // Lưu permissions vào localStorage
            localStorage.setItem('permissions', permissionsObject);
            
},
      loadPermissions: (state) => {
    const storedPermissions = localStorage.getItem('permissions');
    if (storedPermissions) {
        try {
            state.permissions = JSON.parse(storedPermissions);
        } catch (error) {
            console.error('Error parsing permissions from localStorage:', error);
            // Đặt lại permissions về default nếu có lỗi
            state.permissions = {
                canManageProducts: false,
                canManageOrders: false,
                canManageCustomers: false,
                canManageShops: false,
            };
        }
    }
},
    },
});
// Xuất actions và reducer
export const { setPermissions, loadPermissions } = permissionsSlice.actions;
export default permissionsSlice.reducer;