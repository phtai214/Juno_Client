import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../style/components/admin/sidebar.scss";
import { icons } from '../../app/data/icon'; // Import các biểu tượng

const HeadAdmin = () => {
    const location = useLocation(); // Lấy thông tin đường dẫn hiện tại
    const userRole = localStorage.getItem('userRole');
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleToggle = () => {
        setIsCollapsed(!isCollapsed); // Đảo trạng thái collapse
    };

    useEffect(() => {
        setIsCollapsed(false); // Đặt trạng thái collapse về false khi địa chỉ URL thay đổi
    }, [location]);

    return (
        <header className="box-sidebar">
            <nav className="navbar navbar-expand-lg navbar-light">
                <div className="container-nav">
                    <div className="box-nav">
                        <div className="logo-container">
                            <Link className="navbar-brand" to="/admin/dashboard">
                                <img src="https://res.cloudinary.com/dhjrrk4pg/image/upload/v1729458521/logo-juno-Photoroom_odhvyp.png" alt="Logo" className="logo" />
                            </Link>
                            <button
                                className="navbar-toggler"
                                type="button"
                                onClick={handleToggle}
                                aria-expanded={isCollapsed}
                                aria-label="Toggle navigation"
                            >
                                <span className="navbar-toggler-icon"></span>
                            </button>
                        </div>

                        <div className={`collapse navbar-collapse ${isCollapsed ? 'show' : ''}`} id="navbarNav">
                            <ul className="navbar-nav ml-auto">
                                {userRole === 'admin' && (
                                    <>
                                        <li className="nav-item">
                                            <Link className={`nav-link ${location.pathname === '/admin/dashboard' ? 'active' : ''}`} to="/admin/dashboard">
                                                <span className="admin-icon">{icons.home}</span> Dashboard
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className={`nav-link ${location.pathname === '/admin/user' ? 'active' : ''}`} to="/admin/user">
                                                <span className="admin-icon">{icons.user}</span> Users
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className={`nav-link ${location.pathname === '/admin/products' ? 'active' : ''}`} to="/admin/products">
                                                <span className="admin-icon">{icons.product}</span> Product
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className={`nav-link ${location.pathname === '/admin/orders' ? 'active' : ''}`} to="/admin/orders">
                                                <span className="admin-icon">{icons.order}</span> Order
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className={`nav-link ${location.pathname === '/admin/employees' ? 'active' : ''}`} to="/admin/employees">
                                                <span className="admin-icon">{icons.employee}</span> Employees
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className={`nav-link ${location.pathname === '/admin/shops' ? 'active' : ''}`} to="/admin/shops">
                                                <span className="admin-icon">{icons.shop}</span> Shop
                                            </Link>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default HeadAdmin;