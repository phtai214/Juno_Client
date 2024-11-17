import React, { useState } from "react";
import axios from "axios";
import "../../style/components/admin/AddEmployee.scss";
import { useNavigate } from "react-router-dom";

const AddEmployee = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState("active");
  const [permissions, setPermissions] = useState({
    manageProducts: false,
    manageOrders: false,
    manageCustomers: false,
    manageShops: false,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Kiểm tra dữ liệu đầu vào
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handlePermissionChange = (e) => {
    const { name, checked } = e.target;
    setPermissions((prevPermissions) => ({
      ...prevPermissions,
      [name]: checked,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Kiểm tra dữ liệu
    if (!validateEmail(email)) {
      setError("Email không hợp lệ");
      return;
    }
    if (!validatePassword(password)) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    const permissionsArray = [];
    if (permissions.manageProducts) permissionsArray.push("Manage products");
    if (permissions.manageOrders) permissionsArray.push("Manage orders");
    if (permissions.manageCustomers) permissionsArray.push("Manage customers");
    if (permissions.manageShops) permissionsArray.push("Manage Shops");
    console.log("check permissionsArray", permissionsArray);
    try {
      const response = await axios.post(
        "http://localhost:3001/api/v1/user/employee",
        {
          name,
          email,
          password,
          position,
          status,
          permissions: permissionsArray, // Đảm bảo permissionsArray được gửi
          role: "employee",
        }
      );
      if (response.data.err === 0) {
        setSuccess("Nhân viên đã được thêm thành công");
        navigate("/admin/employees");
      } else {
        setError(response.data.mes); // Hiển thị lỗi từ server
      }
    } catch (error) {
      setError("Có lỗi xảy ra khi thêm nhân viên");
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

        <div className="form-group">
          <label htmlFor="position">Position:</label>{" "}
          {/* Thay đổi thành dropdown */}
          <select
            id="position"
            name="position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          >
            <option value="">Select Position</option>
            {/* <option value="admin">Admin</option> */}
            <option value="employee">Employee</option>
          </select>
        </div>

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
        <div className="check-box-box">
          <label>Quản lý sản phẩm</label>
          <input
            type="checkbox"
            name="manageProducts"
            checked={permissions.manageProducts}
            onChange={handlePermissionChange}
          />
        </div>
        <div className="check-box-box">
          <label>Quản lý đơn hàng</label>
          <input
            type="checkbox"
            name="manageOrders"
            checked={permissions.manageOrders}
            onChange={handlePermissionChange}
          />
        </div>

        <div className="check-box-box">
          <label>Quản lý khách hàng</label>
          <input
            type="checkbox"
            name="manageCustomers"
            checked={permissions.manageCustomers}
            onChange={handlePermissionChange}
          />
        </div>

        <div className="check-box-box">
          <label>Quản lý shops</label>
          <input
            type="checkbox"
            name="manageShops"
            checked={permissions.manageShops}
            onChange={handlePermissionChange}
          />
        </div>

        <button type="submit">Thêm Nhân Viên</button>
      </form>
    </div>
  );
};

export default AddEmployee;
