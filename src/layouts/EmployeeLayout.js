// src/layouts/AdminLayout.js
import React from 'react';
import { Outlet, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AccessDenied from '../components/common/AccessDenied'; // Import component thông báo truy cập
import HeadEmployee from "../components/Employee/HeadEmployee";
import NavEmployee from "../components/Employee/navEmployee"
import "../style/layouts/admin.scss"
const ProtectedRoute = ({ element }) => {
    const user = useSelector((state) => state.user); // Lấy thông tin người dùng từ Redux
    const isAdmin = user.role === 'employee'; // Kiểm tra vai trò của người dùng

    return isAdmin ? element : <AccessDenied />; // Nếu không phải admin, hiển thị thông báo
};

const AdminLayout = () => {
    return (
        <div className="admin-layout row">
            <div className="sidebar-admin col-md-2 col-sm-2"> <HeadEmployee /></div>
            <main className="data-admin col-md-10 col-sm-10">
                <NavEmployee />
                <ProtectedRoute element={<Outlet />} /> {/* Kiểm tra quyền truy cập trước khi hiển thị Outlet */}
            </main>
        </div>
    );
};

export default AdminLayout; // Đảm bảo xuất khẩu mặc định
