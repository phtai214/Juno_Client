import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { loginSuccess, loginFailure } from '../../redux/slices/authSlice';
import { setUser } from '../../redux/slices/userSlice';
import { setPermissions } from '../../redux/slices/permissionsSlice'; // Import action từ permissionsSlice
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import "../../style/components/common/login.scss";

const LoginComponent = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [errorMessage, setErrorMessage] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userRedirect = useSelector(state => state.user.redirectTo);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCredentials({
            ...credentials,
            [name]: value
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:3001/api/v1/auth/login`, {
                email: credentials.email,
                password: credentials.password,
            });
            const user = response.data.user;
            const { id, name, role, permissions } = user; // Giả sử `permissions` cũng được trả về trong user
 const permissionsString = (typeof permissions === 'string') ? permissions : '';
            // Lưu thông tin người dùng và permissions vào localStorage
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userId', id);
            localStorage.setItem('userRole', role);
            localStorage.setItem('userName', name);
            localStorage.setItem('userEmail', credentials.email);
 localStorage.setItem('permissions', permissionsString);
            // Dispatch actions để cập nhật Redux state
            dispatch(loginSuccess(response.data));
            dispatch(setUser(user));
            dispatch(setPermissions(permissionsString));

            // Redirect dựa trên role hoặc redirectTo
            if (userRedirect) {
                navigate(userRedirect);
            } else if (role === 'admin') {
                navigate('/admin/dashboard');
            } else if (role === 'user') {
                navigate('/customer/home');
            } else if (role === 'employee') {
                navigate('/employee/dashboard');
            }
        } catch (error) {
            console.error('Login Error:', error);
            console.log('Axios config:', error.config);
            setErrorMessage('Đăng nhập thất bại. Vui lòng kiểm tra thông tin và thử lại.');
            dispatch(loginFailure(error.message));
        }
    };

    return (
        <div className="login-container">
            <h1 className="login-container-title">Đăng Nhập</h1>
            <i className="login-container-note">
                Đăng nhập để tích điểm và hưởng ưu đãi thành viên khi mua hàng. Nhập số điện thoại để tiếp tục đăng nhập hoặc đăng ký thành viên.
            </i>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    name="email"
                    className="phoneInput"
                    placeholder="Vui lòng nhập email của bạn"
                    autoComplete="off"
                    value={credentials.email}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    className="passwordInput"
                    placeholder="Nhập mật khẩu của bạn"
                    value={credentials.password}
                    onChange={handleInputChange}
                    required
                />
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <button type="submit" className="btn-login">Tiếp tục</button>
            </form>
            <p className="item-login">Hoặc đăng nhập với</p>
            <div className="box-login-fb-gg">
                <button className='btn-login-fb'>
                    <img className="fb-icon" src="https://res.cloudinary.com/dhjrrk4pg/image/upload/v1729519358/facebook_2504903_geuvj2.png" alt="Facebook Login" />
                </button>
                <button className='btn-login-fb'>
                    <img className="fb-icon" src="https://res.cloudinary.com/dhjrrk4pg/image/upload/v1729519358/google_2504914_pe1zmv.png" alt="Google Login" />
                </button>
            </div>
            <p className="item-login-data">
                Bằng việc đăng nhập, bạn đã đồng ý với Điều khoản dịch vụ & chính sách bảo mật của Juno
            </p>
            <Link className="link-register" to="/register">Chưa có tài khoản đăng ký tại đây</Link>
        </div>
    );
};

export default LoginComponent;
