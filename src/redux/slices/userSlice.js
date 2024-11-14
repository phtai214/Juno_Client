import { createSlice } from '@reduxjs/toolkit';

// Khởi tạo state ban đầu từ localStorage nếu có
const initialState = {
    name: localStorage.getItem('userName') || '',
    id: localStorage.getItem('userId') ? parseInt(localStorage.getItem('userId')) : 0,
    email: localStorage.getItem('userEmail') || '',
    avatar: localStorage.getItem('userAvatar') || '',
    role: localStorage.getItem('userRole') || false,
    redirectTo: null, // Thêm biến trạng thái để lưu trữ URL chuyển hướng
};

// Tạo slice cho user
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // Action để set user
        setUser: (state, action) => {
            state.id = action.payload.id;
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.avatar = action.payload.avatar;
            state.role = action.payload.role;
            state.redirectTo = action.payload.redirectTo || null; // Thiết lập redirectTo

            // Lưu thông tin vào localStorage
            localStorage.setItem('userId', action.payload.id);
            localStorage.setItem('userName', action.payload.name);
            localStorage.setItem('userEmail', action.payload.email);
            localStorage.setItem('userAvatar', action.payload.avatar);
            localStorage.setItem('userRole', action.payload.role);
        },
        // Clear user và xóa dữ liệu khỏi localStorage
        clearUser: (state) => {
            state.id = 0;
            state.name = '';
            state.email = '';
            state.avatar = '';
            state.role = false;
            state.redirectTo = null; // Xóa redirectTo

            // Xóa dữ liệu khỏi localStorage
            localStorage.removeItem('userId');
            localStorage.removeItem('userName');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userAvatar');
            localStorage.removeItem('userRole');
        },
    },
});

// Export các action
export const { setUser, clearUser } = userSlice.actions;

// Export reducer
export default userSlice.reducer;