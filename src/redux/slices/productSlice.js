import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Khởi tạo trạng thái mặc định
const initialState = {
    products: [],
    loading: false,
    error: null,
};

// Tạo action async để lấy sản phẩm
export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async () => {
        const response = await fetch('/api/products'); // Thay thế với API thực tế
        if (!response.ok) {
            throw new Error('Không thể lấy sản phẩm');
        }
        const data = await response.json();
        return data.products || []; // Đảm bảo trả về mảng sản phẩm
    }
);

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        addProduct(state, action) {
            state.products.push(action.payload); // Thêm sản phẩm mới
        },
        removeProduct(state, action) {
            state.products = state.products.filter(product => product.id !== action.payload); // Xóa sản phẩm theo ID
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload; // Lưu trữ danh sách sản phẩm
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message; // Lưu trữ lỗi
            });
    },
});

// Xuất các action
export const {
    addProduct,
    removeProduct,
} = productSlice.actions;

// Xuất reducer
export default productSlice.reducer;