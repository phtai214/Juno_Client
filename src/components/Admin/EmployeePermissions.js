import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../../style/components/admin/EmployeePermissions.scss";
import { useNavigate, useParams } from 'react-router-dom';

const EmployeePermissions = () => {
    const navigate = useNavigate();
    const { employeeId } = useParams();

    const [employee, setEmployee] = useState({
        name: '',
        email: '',
        role: '',
        position: '', // Thêm trường position
        avatar: '',
        status: '',
        phonenumber: '',
        address: ''
    });

    const [permissions, setPermissions] = useState({
        manageProducts: false,
        manageOrders: false,
        manageCustomers: false,
        manageShops: false
    });

    const [avatarFile, setAvatarFile] = useState(null); // State cho file avatar

    // Fetch existing user data or permissions
    useEffect(() => {
        const fetchEmployeeData = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/v1/user/${employeeId}`);
                const userData = response.data;
                setEmployee({
                    name: userData.name,
                    email: userData.email,
                    role: userData.role,
                    position: userData.position, // Lấy position từ dữ liệu
                    avatar: userData.avatar,
                    phonenumber: userData.phonenumber,
                    status: userData.status,
                    address: userData.address
                });

                const userPermissions = userData.permissions || [];
                setPermissions({
                    manageProducts: userPermissions.includes('Manage products'),
                    manageOrders: userPermissions.includes('Manage orders'),
                    manageCustomers: userPermissions.includes('Manage customers'),
                    manageShops: userPermissions.includes('Manage Shops')
                });
            } catch (error) {
                console.error('Error fetching employee data:', error);
            }
        };

        fetchEmployeeData();
    }, [employeeId]);

    // Handle changes in the checkboxes
    const handlePermissionChange = (event) => {
        const { name, checked } = event.target;
        setPermissions(prevPermissions => ({
            ...prevPermissions,
            [name]: checked
        }));
    };

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEmployee((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setAvatarFile(e.target.files[0]); // Set the selected file
    };

    // Submit the permissions update
    const handleSubmit = async (e) => {
        e.preventDefault();

        const permissionsArray = [];
        if (permissions.manageProducts) permissionsArray.push('Manage products');
        if (permissions.manageOrders) permissionsArray.push('Manage orders');
        if (permissions.manageCustomers) permissionsArray.push('Manage customers');
        if (permissions.manageShops) permissionsArray.push('Manage Shops');

        const updatedUserData = {
            ...employee,
            permissions: permissionsArray
        };

        const formData = new FormData();
        Object.keys(updatedUserData).forEach(key => {
            formData.append(key, updatedUserData[key]);
        });

        // Append the avatar file if selected
        if (avatarFile) {
            formData.append('file', avatarFile);
        }

        try {
            await axios.put(`http://localhost:3001/api/v1/user/${employeeId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('User updated successfully');
            navigate('/admin/employees');
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Failed to update user');
        }
    };

    return (
        <div className="employee-permissions-container">
            <h2>Phân quyền nhân viên</h2>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={employee.name}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={employee.email}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="role">Role:</label>
                    <select id="role" name="role" value={employee.role} onChange={handleInputChange}>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                        <option value="employee">Employee</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="position">Position:</label> {/* Thay đổi thành dropdown */}
                    <select id="position" name="position" value={employee.position} onChange={handleInputChange}>
                        <option value="">Select Position</option>
                        <option value="admin">Admin</option>
                        <option value="employee">Employee</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="status">Status:</label> {/* Thay đổi thành dropdown */}
                    <select id="status" name="status" value={employee.status} onChange={handleInputChange}>
                        <option value="">Select Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="avatar">Avatar:</label>
                    <input
                        type="file"
                        id="avatar"
                        name="avatar"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="phonenumber">Phone Number:</label>
                    <input
                        type="text"
                        id="phonenumber"
                        name="phonenumber"
                        value={employee.phonenumber}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="address">Address:</label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        value={employee.address}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="permissions-list">
                    <div>
                        <input
                            type="checkbox"
                            id="manageProducts"
                            name="manageProducts"
                            checked={permissions.manageProducts}
                            onChange={handlePermissionChange}
                        />
                        <label htmlFor="manageProducts">Manage products</label>
                    </div>

                    <div>
                        <input
                            type="checkbox"
                            id="manageOrders"
                            name="manageOrders"
                            checked={permissions.manageOrders}
                            onChange={handlePermissionChange}
                        />
                        <label htmlFor="manageOrders">Manage orders</label>
                    </div>

                    <div>
                        <input
                            type="checkbox"
                            id="manageCustomers"
                            name="manageCustomers"
                            checked={permissions.manageCustomers}
                            onChange={handlePermissionChange}
                        />
                        <label htmlFor="manageCustomers">Manage customers</label>
                    </div>

                    <div>
                        <input
                            type="checkbox"
                            id="manageShops"
                            name="manageShops"
                            checked={permissions.manageShops}
                            onChange={handlePermissionChange}
                        />
                        <label htmlFor="manageShops">Manage Shops</label>
                    </div>
                </div>

                <button type="submit" className="update-btn">Update</button>
            </form>
        </div>
    );
};

export default EmployeePermissions;