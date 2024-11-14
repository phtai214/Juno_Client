import React, { useState } from 'react';
import axios from 'axios';
import '../../style/components/admin/AddEmployee.scss';
import { useNavigate } from 'react-router-dom';

const AddEmployee = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [position, setPosition] = useState('');
    const [status, setStatus] = useState('active');
    const [permissions, setPermissions] = useState({
        manageProducts: false,
        manageOrders: false,
        manageCustomers: false,
        customerSupport: false,
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    // Kiểm tra dữ liệu đầu vào
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        return password.length >= 6;
    };

    const handlePermissionChange = (event) => {
        const { name, checked } = event.target;
        setPermissions((prevPermissions) => ({
            ...prevPermissions,
            [name]: checked,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Kiểm tra dữ liệu
        if (!validateEmail(email)) {
            setError('Email không hợp lệ');
            return;
        }
        if (!validatePassword(password)) {
            setError('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3001/api/v1/user/employee', {
                name,
                email,
                password,
                position,
                status,
                permissions, // Gửi permissions cùng với yêu cầu
                role: 'employee'
            });
            if (response.status === 200) {
                setSuccess('Nhân viên đã được thêm thành công');
                navigate('/admin/employees'); // Chuyển hướng đến danh sách nhân viên
            }
        } catch (error) {
            setError('Có lỗi xảy ra khi thêm nhân viên');
        }
    };

    return (
        <div className="add-employee-container">
            <h2>Thêm Nhân Viên Mới</h2>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Tên:</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <label htmlFor="password">Mật khẩu:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <label htmlFor="position">Chức vụ:</label>
                <input
                    type="text"
                    id="position"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                />

                <label htmlFor="status">Trạng thái:</label>
                <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>

                <h3>Quyền hạn:</h3>
                <label>
                    <input
                        type="checkbox"
                        name="manageProducts"
                        checked={permissions.manageProducts}
                        onChange={handlePermissionChange}
                    />
                    Quản lý sản phẩm
                </label>
                <label>
                    <input
                        type="checkbox"
                        name="manageOrders"
                        checked={permissions.manageOrders}
                        onChange={handlePermissionChange}
                    />
                    Quản lý đơn hàng
                </label>
                <label>
                    <input
                        type="checkbox"
                        name="manageCustomers"
                        checked={permissions.manageCustomers}
                        onChange={handlePermissionChange}
                    />
                    Quản lý khách hàng
                </label>
                <label>
                    <input
                        type="checkbox"
                        name="customerSupport"
                        checked={permissions.customerSupport}
                        onChange={handlePermissionChange}
                    />
                    Hỗ trợ khách hàng
                </label>

                <button type="submit">Thêm Nhân Viên</button>
            </form>
        </div>
    );
};

export default AddEmployee;