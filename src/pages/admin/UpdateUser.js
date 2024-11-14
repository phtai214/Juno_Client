import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../../style/pages/admin/UpdateUser.scss"
const UpdateUser = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState({
        name: '',
        email: '',
        role: '',
        avatar: '',
        phonenumber: '',
        address: ''
    });
    const [avatarFile, setAvatarFile] = useState(null); // State for the avatar file

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/v1/user/${userId}`);
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [userId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setAvatarFile(e.target.files[0]); // Set the selected file
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', user.name);
        formData.append('email', user.email);
        formData.append('role', user.role);
        formData.append('phonenumber', user.phonenumber);
        formData.append('address', user.address);

        // Append the avatar file if selected
        if (avatarFile) {
            formData.append('file', avatarFile);
        }

        try {
            await axios.put(`http://localhost:3001/api/v1/user/${userId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert("User update successfully!");
            navigate('/admin/user'); // Redirect to user list page
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    return (
        <div className="update-user-container">
            <h2>Update User</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={user.name}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={user.email}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="role">Role:</label>
                    <select id="role" name="role" value={user.role} onChange={handleInputChange}>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                        <option value="employee">Employee</option>
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
                        value={user.phonenumber}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="address">Address:</label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        value={user.address}
                        onChange={handleInputChange}
                    />
                </div>

                <button type="submit" className="update-btn">Update</button>
            </form>
        </div>
    );
};

export default UpdateUser;