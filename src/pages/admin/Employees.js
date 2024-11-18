import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../style/pages/admin/EmployeeList.scss";

const EmployeeList = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const employeesPerPage = 5;

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/v1/user");
      const filteredEmployees = response.data.users.filter(
        (user) => user.role === "employee"
      );

      // Kiểm tra dữ liệu thô
      console.log("Raw employee data:", filteredEmployees);

      const employeesWithPermissions = filteredEmployees.map((employee) => {
        let parsedPermissions = [];
        if (typeof employee.permissions === "string") {
          parsedPermissions = employee.permissions
            .replace(/"/g, "")
            .split(",")
            .map((item) => item.trim());
        } else if (Array.isArray(employee.permissions)) {
          parsedPermissions = employee.permissions;
        }

        return {
          ...employee,
          permissions: parsedPermissions,
        };
      });

      console.log(
        "Processed employees with permissions:",
        employeesWithPermissions
      );
      setEmployees(employeesWithPermissions);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  // Gọi fetchEmployees trong useEffect
  useEffect(() => {
    fetchEmployees();
  }, []);
  const filteredEmployees = employees.filter((employee) => {
    const searchMatch =
      employee.name.toLowerCase().includes(search.toLowerCase()) ||
      employee.email.toLowerCase().includes(search.toLowerCase());
    const statusMatch = statusFilter ? employee.status === statusFilter : true;
    const roleMatch = roleFilter ? employee.role === roleFilter : true;

    return searchMatch && statusMatch && roleMatch;
  });

  const pageCount = Math.ceil(filteredEmployees.length / employeesPerPage);
  const offset = currentPage * employeesPerPage;
  const currentEmployees = filteredEmployees.slice(
    offset,
    offset + employeesPerPage
  );

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleRoleChange = (e) => {
    setRoleFilter(e.target.value);
  };

  const handleDeleteEmployee = async (employeeId) => {
    console.log("check id >>>", employeeId);
    if (!employeeId) return;

    try {
      await axios.delete(`http://localhost:3001/api/v1/user/${employeeId}`);
      alert("Xóa nhân viên thành công");

      // Gọi lại API để lấy danh sách nhân viên mới
      fetchEmployees(); // Gọi lại hàm fetchEmployees để cập nhật danh sách
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("Có lỗi xảy ra khi xóa nhân viên");
    } finally {
      setDeleteConfirm(false);
      setEmployeeToDelete(null);
    }
  };

  // Hàm chuyển đổi permissions object thành chuỗi
  // Hàm chuyển đổi permissions object thành chuỗi
  const formatPermissions = (permissions) => {
    let permissionsArray = [];

    if (Array.isArray(permissions)) {
      permissionsArray = permissions;
    } else if (typeof permissions === "string") {
      try {
        permissionsArray = JSON.parse(permissions);
      } catch (error) {
        console.error("Error parsing permissions:", error);
        permissionsArray = [];
      }
    }

    const permissionsList = [];
    if (permissionsArray.includes("Manage products"))
      permissionsList.push("Quản lý sản phẩm");
    if (permissionsArray.includes("Manage orders"))
      permissionsList.push("Quản lý đơn hàng");
    if (permissionsArray.includes("Manage customers"))
      permissionsList.push("Quản lý khách hàng");
    if (permissionsArray.includes("Manage Shops"))
      permissionsList.push("Quản lý shop");

    return permissionsList; // Trả về mảng thay vì chuỗi
  };

  // Hàm xử lý click vào hàng
  const handleUpdate = (employeeId) => {
    navigate(`/admin/employees/employee-permissions/${employeeId}`);
  };

  return (
    <div className="employee-list-container">
      <h2>Danh sách nhân viên</h2>
      <button
        onClick={() => navigate("/admin/employees/add")}
        className="create-employee-button"
      >
        Thêm Nhân Viên
      </button>
      <input
        type="text"
        placeholder="Tìm kiếm theo tên hoặc email"
        value={search}
        onChange={handleSearchChange}
      />

      <div className="filters">
        <select value={statusFilter} onChange={handleStatusChange}>
          <option value="">Tất cả trạng thái</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <select value={roleFilter} onChange={handleRoleChange}>
          <option value="">Tất cả chức vụ</option>
          <option value="admin">Admin</option>
          <option value="employee">Employee</option>
        </select>
      </div>

      <table className="employee-table">
        <thead>
          <tr>
            <th>Tên</th>
            <th>Email</th>
            <th>Chức vụ</th>
            <th>Trạng thái</th>
            <th>Quyền hạn</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentEmployees.length === 0 ? (
            <tr>
              <td colSpan="6">Không có nhân viên nào phù hợp.</td>
            </tr>
          ) : (
            currentEmployees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.name}</td>
                <td>{employee.email}</td>
                <td>{employee.position}</td>
                <td>{employee.status === "active" ? "Active" : "Inactive"}</td>
                <td>
                  <ul>
                    {formatPermissions(employee.permissions).map(
                      (permission, index) => (
                        <li key={index}>{permission}</li>
                      )
                    )}
                  </ul>
                </td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleUpdate(employee.id)}
                    style={{
                      margin: "0 5px",
                      backgroundColor: "#007bff",
                      color: "white",
                    }}
                  >
                    Update
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Ngăn chặn sự kiện click trên hàng
                      handleDeleteEmployee(employee.id);
                    }}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <ReactPaginate
        previousLabel={"<"}
        nextLabel={">"}
        breakLabel={"..."}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        activeClassName={"active"}
      />
    </div>
  );
};

export default EmployeeList;
