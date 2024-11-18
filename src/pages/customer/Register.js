import React, { useState } from "react";
import { useDispatch } from "react-redux";
//import { loginStart } from '../../redux/slices/authSlice';
import axios from "axios";
import "../../style/components/common/register.scss";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Để điều hướng sau khi đăng ký thành công
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault(); // Ngăn chặn form gửi đi mặc định
    const userData = {
      name: e.target.name.value,
      email: e.target.email.value,
      password: e.target.password.value,
    };

    try {
      // Gọi API đăng ký
      const response = await axios.post(
        `http://localhost:3001/api/v1/auth/signup`,
        userData
      );
      if (response.data.success) {
        setSuccess(response.data.message); // Hiển thị thông báo thành công
        setError(null);
        alert("Đăng ký tài khoản thành công!");
        setTimeout(() => {
          navigate("/login"); // Chuyển hướng đến trang đăng nhập sau 1 giây
        }, 1000);
      } else {
        alert("Đăng ký không thành công! Có lỗi khi đăng ký");
        setError(response.data.message); // Hiển thị thông báo lỗi
        setSuccess(null);
      }
    } catch (error) {
      setError("Có lỗi xảy ra, vui lòng thử lại!"); // Thông báo lỗi nếu có lỗi trong quá trình gọi API
    }
  };

  return (
    <div className="signup-container">
      <h1 className="signup-container-title">Đăng Ký Thành Viên</h1>
      <i className="signup-container-note">
        Chỉ cần vài bước đăng ký để tận hưởng nhiều quyền lợi hơn khi mua sản
        phẩm. Tham gia hội thành viên Juno ngay hôm nay bạn nhé!
      </i>
      {error && <div className="error-message">{error}</div>}{" "}
      {/* Hiển thị thông báo lỗi */}
      <form className="form-box" onSubmit={handleRegister}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Tên <span className="highlight">*</span>
          </label>
          <input type="text" className="form-control" id="name" required />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input type="email" className="form-control" id="email" required />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Mật Khẩu<span className="highlight">*</span>
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">
            Nhập Lại Mật Khẩu<span className="highlight">*</span>
          </label>
          <input
            type="password"
            className="form-control"
            id="confirmPassword"
            required
          />
        </div>

        {/* <div className="mb-3">
          <input type="checkbox" id="subscribe" name="subscribe" />
          <label htmlFor="subscribe">
            {" "}
            Nhận tin khuyến mãi từ Juno qua email
          </label>
        </div> */}
        <div className="d-grid mt-4">
          <button type="submit" className="btn btn-primary">
            Đăng Ký
          </button>
        </div>
      </form>
      <p className="item-signup-data">
        Bằng việc đăng ký, bạn đã đồng ý với Điều khoản dịch vụ & chính sách bảo
        mật của Juno
      </p>
    </div>
  );
};

export default Register;
