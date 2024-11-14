// src/components/common/Header.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../style/components/admin/navHeader.scss";
import SearchBarAdmin from "./SearchBar";
import { Dropdown } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { icons } from '../../app/data/icon';

const NavAdmin = () => {
    const user = useSelector((state) => state.user);
    const userRole = localStorage.getItem('userRole');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const navigate = useNavigate();

    const handleLogout = () => {
        console.log('Đăng xuất');
        localStorage.removeItem('isLoggedIn');
        navigate('/customer/sale-thuong-thuong');
    };

    const handleViewAccount = () => {
        console.log('Xem chi tiết tài khoản');
    };

    const handleClick = () => {
        navigate('/login');
    };

    return (
        <div className="navbar-navadmin">
            <div className="nav-admin">
                {userRole === 'admin' && (
                    <>
                        <div className="search-box-container nav-item">
                            <SearchBarAdmin />
                        </div>
                        <div className="nav-item end-nav">
                            {isLoggedIn ? (
                                <Dropdown>
                                    <Dropdown.Toggle className="nav-link" id="user-dropdown">
                                        <img className="user-icon" src="https://res.cloudinary.com/dhjrrk4pg/image/upload/v1729716444/user_456212_rcmnpi.png" />
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={handleViewAccount}>Xem chi tiết tài khoản</Dropdown.Item>
                                        <Dropdown.Item onClick={handleLogout}>Đăng xuất</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            ) : (
                                <div className="nav-link" onClick={handleClick}><img className="user-icon" src="https://res.cloudinary.com/dhjrrk4pg/image/upload/v1729716444/user_456212_rcmnpi.png" /></div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default NavAdmin;