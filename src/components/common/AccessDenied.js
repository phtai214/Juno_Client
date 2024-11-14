// src/components/AccessDenied.js
import React from 'react';
import { Link } from 'react-router-dom';

const AccessDenied = () => {
    return (
        <div className="access-denied">
            <h1>403 - Access Denied</h1>
            <p>Bạn không có quyền truy cập vào trang này.</p>
            <Link to="/employee/dashboard">Quay về trang chủ</Link>
        </div>
    );
};

export default AccessDenied;