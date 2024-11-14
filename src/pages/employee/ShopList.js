// src/components/ShopList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import "../../style/pages/admin/ShopList.scss"
const ShopListEmployee = () => {
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Khởi tạo useNavigate

    useEffect(() => {
        const fetchShops = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/v1/shop/shops'); // Địa chỉ API của bạn
                setShops(response.data); // Giả sử dữ liệu trả về là mảng các shop
            } catch (error) {
                console.error('Error fetching shops:', error);
                setError('Failed to load shops. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchShops();
    }, []);

    const handleCreateShop = () => {
        navigate('/employee/shops/add'); // Chuyển hướng đến trang CreateShop
    };

    const handleEditShop = (shopId) => {
        navigate(`/employee/shops/edit/${shopId}`); // Chuyển hướng đến trang chỉnh sửa shop
    };

    const handleDeleteShop = async (shopId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this shop?');
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:3001/api/v1/shop/shops/${shopId}`); // API xóa shop
                setShops(shops.filter(shop => shop.id !== shopId)); // Cập nhật danh sách sau khi xóa
                alert("Shop delete successfully!");
            } catch (error) {
                console.error('Error deleting shop:', error);
                setError('Failed to delete shop. Please try again later.');
            }
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    return (
        <div className="shop-list-container">
            <h1>Shop List</h1>
            <button onClick={handleCreateShop} className="create-shop-button">
                Create Shop
            </button>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Location</th>
                        <th>Phone Number</th>
                        <th>Actions</th> {/* Thêm cột Actions */}
                    </tr>
                </thead>
                <tbody>
                    {shops.map(shop => (
                        <tr key={shop.id}>
                            <td>{shop.name}</td>
                            <td>{shop.location}</td>
                            <td>{shop.phone_number}</td>
                            <td>
                                <button onClick={() => handleEditShop(shop.id)} className="edit-button">Edit</button>
                                <button onClick={() => handleDeleteShop(shop.id)} className="delete-button">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ShopListEmployee;