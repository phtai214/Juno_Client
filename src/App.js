import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import CustomerLayout from './layouts/CustomerLayout.js';
import AdminLayout from './layouts/AdminLayout';
import EmployeeLayout from './layouts/EmployeeLayout';
import Login from './pages/customer/Login.js';
import Register from './pages/customer/Register.js';
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/customer/Products.js';
import Home from './pages/customer/Home.js';
import ProductDetail from './pages/customer/ProductDetail.js';
import Cart from './pages/customer/Cart.js';
import Checkout from './pages/customer/Checkout.js';
import Orders from './pages/admin/Orders';
import Employees from './pages/admin/Employees';
import { checkAuth } from './redux/slices/authSlice'; // Action để kiểm tra trạng thái đăng nhập
import Product from "./pages/admin/Product.js";
import UsersPage from "./pages/admin/User.js";
import ProductCreateForm from "./pages/admin/ProductCreateForm.js"
import Cookies from 'js-cookie';
import UserView from "./pages/customer/UserView.js";
import ProductSearch from "./pages/customer/ProductSearch.js";
import OrderUpdate from "./pages/admin/UpdateOrder.js";
import NewProduct from "./pages/customer/NewProduct.js";
import AddEmployee from "./components/Admin/AddEmployee.js";
import EmployeePermissions from "./components/Admin/EmployeePermissions.js";
import ProductList from "./pages/customer/ProductList.js";
import ProductAll from "./pages/customer/ProductAll.js";
import OrderDetail from "./pages/customer/OrderDetail.js";
import ProductPage from "./pages/customer/ProductPage.js";
import UpdateProduct from "./pages/admin/UpdateProduct.js"
import UpdateUser from "./pages/admin/UpdateUser.js";
import UsersPageEmployee from "./pages/employee/User.js";
import UpdateUserEmployee from "./pages/employee/UpdateUser.js";
import UpdateProductEmployee from "./pages/employee/UpdateProduct.js";
import OrderUpdateEmployee from "./pages/employee/UpdateOrder.js";
import ProductEmployee from "./pages/employee/Product.js";
import OrdersEmployee from "./pages/employee/Orders.js";
import DashboardEmployee from "./pages/employee/Dashboard.js";
import ProductCreateFormEmployee from "./pages/employee/ProductCreateForm.js"
import { loadPermissions } from './redux/slices/permissionsSlice';
import AccessDenied from "./components/common/AccessDenied.js";
import ReturnPolicy from './pages/customer/ReturnPolicy.js';
import PaymentDelivery from "./pages/customer/PaymentDelivery.js";
import ShopList from "./pages/admin/ShopList.js";
import CreateShop from "./pages/admin/CreateShop.js";
import UpdateShop from "./pages/admin/UpdateShop.js";
import ShopListEmployee from "./pages/employee/ShopList.js";
import CreateShopEmployee from "./pages/employee/CreateShop.js";
import UpdateShopEmployee from "./pages/employee/UpdateShop.js";
import Showroom from "./pages/customer/Showroom.js";
import RedirectPage from "./pages/customer/RedirectPage.js";
import IpnPage from "./pages/customer/IpnPage.js";
import PrivacyPolicy from "./pages/customer/PrivacyPolicy.js";
import Intro from "./pages/customer/Introduce.js";
import Contact from "./pages/customer/Contact.js";
import FAQ from "./pages/customer/FAQ.js";
import News from "./pages/customer/News.js";
import CreateUser from "./pages/admin/CreateUser.js"
const App = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const { isAuthenticated, user } = auth;
  const permissions = useSelector((state) => state.permissions.permissions); // Thay đổi để lấy permissions chung

  // Kiểm tra trạng thái đăng nhập khi app load
useEffect(() => {
    const userFromCookies = Cookies.get('user');
    if (userFromCookies) {
        dispatch(checkAuth());
        dispatch(loadPermissions());
    }
}, [dispatch]);

  return (
    <Routes>
      {/* Routes dành cho khách hàng */}
      <Route path="/customer" element={<CustomerLayout />}>
        <Route path="sale-thuong-thuong" element={<Products />} />
        <Route path="home" element={<Home />} />
        <Route path="showroom" element={<Showroom />} />
        <Route path="product/slug/:slug" element={<ProductDetail />} />
        <Route path="new-product" element={<NewProduct />} />
        <Route path="product/search" element={<ProductSearch />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={isAuthenticated ? <Checkout /> : <Navigate to="/login" />} />
        <Route path="user-view/:id" element={isAuthenticated ? <UserView /> : <Navigate to="/login" />} />
        <Route path="order-detail/:id" element={<OrderDetail />} />
        <Route path="product-all" element={<ProductAll />} />
        <Route path="chinh-sach-doi-tra" element={<ReturnPolicy />} />
        <Route path="thanh-toan-giao-nhan" element={<PaymentDelivery />} />
        <Route path="chinh-sach-bao-mat" element={<PrivacyPolicy />} />
        <Route path="cau-hoi-thuong-gap" element={<FAQ />} />
        <Route path="gioi-thieu" element={<Intro />} />
        <Route path="lien-he" element={<Contact />} />
        <Route path="tin-tuc" element={<News />} />
        <Route path="/customer/product/category/:category" element={<ProductPage />} />
        <Route path="/customer/product/tag/:tag" element={<ProductList />} />
        <Route path="redirect" element={<RedirectPage />} />
        <Route path="ipn" element={<IpnPage />} />
      </Route>

      {/* Routes dành cho admin */}
      {user?.role === 'admin' && (
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="user" element={<UsersPage />} />
          <Route path="createUser" element={<CreateUser />} />
          <Route path="updateUser/:userId" element={<UpdateUser />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/update/:id" element={<OrderUpdate />} />
          <Route path="employees" element={<Employees />} />
          <Route path="employees/add" element={<AddEmployee />} />
          <Route path="shops" element={<ShopList />} />
          <Route path="shops/add" element={<CreateShop />} />
          <Route path="shops/edit/:id" element={<UpdateShop />} />
          <Route path="employees/employee-permissions/:employeeId" element={<EmployeePermissions />} />
          <Route path="products" element={<Product />} />
          <Route path="update-product/:id" element={<UpdateProduct />} />
          <Route path="products/create" element={<ProductCreateForm />} />

        </Route>
      )}

      {/* Routes dành cho nhân viên */}
      {user?.role === 'employee' && (
        <Route path="/employee" element={<EmployeeLayout />}>
          <Route path="dashboard" element={<DashboardEmployee />} />
          {permissions.canManageCustomers ? (
            <Route path="user" element={<UsersPageEmployee />} />
          ) : (
            <Route path="user" element={<AccessDenied />} />
          )}

          {permissions.canManageCustomers ? (
            <Route path="updateUser/:userId" element={<UpdateUserEmployee />} />
          ) : (
            <Route path="updateUser/:userId" element={<AccessDenied />} />
          )}

          {permissions.canManageOrders ? (
            <Route path="orders" element={<OrdersEmployee />} />
          ) : (
            <Route path="orders" element={<AccessDenied />} />
          )}

          {permissions.canManageOrders ? (
            <Route path="orders/update/:id" element={<OrderUpdateEmployee />} />
          ) : (
            <Route path="orders/update/:id" element={<AccessDenied />} />
          )}

          {permissions.canManageProducts ? (
            <Route path="products" element={<ProductEmployee />} />
          ) : (
            <Route path="products" element={<AccessDenied />} />
          )}

          {permissions.canManageProducts ? (
            <Route path="products/create" element={<ProductCreateFormEmployee />} />
          ) : (
            <Route path="products/create" element={<AccessDenied />} />
          )}

          {permissions.canManageProducts ? (
            <Route path="update-product/:id" element={<UpdateProductEmployee />} />
          ) : (
            <Route path="update-product/:id" element={<AccessDenied />} />
          )}
          {permissions.canManageShops ? (
            <Route path="shops" element={<ShopListEmployee />} />
          ) : (
            <Route path="shops" element={<AccessDenied />} />
          )}
          {permissions.canManageShops ? (
            <Route path="shops/add" element={<CreateShopEmployee />} />
          ) : (
            <Route path="shops/add" element={<AccessDenied />} />
          )}

          {permissions.canManageShops ? (
            <Route path="shops/edit/:id" element={<UpdateShopEmployee />} />
          ) : (
            <Route path="shops/edit/:id" element={<AccessDenied />} />

          )}
        </Route>
      )}

      {/* Routes đăng nhập/đăng ký */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Redirect mặc định */}
      <Route path="/" element={<Navigate to="/customer/sale-thuong-thuong" />} />
    </Routes>

  );
};

export default App;
