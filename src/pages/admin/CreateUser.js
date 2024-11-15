import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../../style/pages/admin/CreateUser.scss";

const CreateUser = () => {
    const navigate = useNavigate();
 
    
     const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);



    const handleSubmit = async (e) => {
        e.preventDefault();
const userData = {
            name: e.target.name.value,
            email: e.target.email.value,
            password: e.target.password.value,
        };
        try {
            const response = await axios.post(`http://localhost:3001/api/v1/auth/signup`, userData);
             if (response.data.success) {
                setSuccess(response.data.message); // Hiển thị thông báo thành công
                setError(null);
                alert("Tạo người dùng thành công! Tự động chuyển hướng sau 2 giây");
                setTimeout(() => {
                    navigate('/admin/user'); // Chuyển hướng đến trang đăng nhập sau 5 giây
                }, 2000);
            } else {
                alert("Đăng ký không thành công! Có lỗi khi đăng ký");
                setError(response.data.message); // Hiển thị thông báo lỗi
                setSuccess(null);
            }

            
        } catch (error) {
            setError('Có lỗi xảy ra , vui lòng thử lại');
        }
    };

    return (
        <div className="create-user-container">
            <h2>Create User</h2>
           <form className="form-box" onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Họ tên <span className="highlight">*</span></label>
                    <input type="text" className="form-control" id="name" required />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className="form-control" id="email" required />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Mật Khẩu<span className="highlight">*</span></label>
                    <input type="password" className="form-control" id="password" required />
                </div>
                <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">Nhập Lại Mật Khẩu<span className="highlight">*</span></label>
                    <input type="password" className="form-control" id="confirmPassword" required />
                </div>

                {/* <div className="mb-3">
                    <input type="checkbox" id="subscribe" name="subscribe" />
                    <label htmlFor="subscribe"> Nhận tin khuyến mãi từ Juno qua email</label>
                </div> */}
                <div className="d-grid mt-4">
                    <button type="submit" className="btn btn-primary">Đăng Ký</button>
                </div>
            </form>
        </div>
    );
};

export default CreateUser;