// src/components/CreateShop.js
import React, { useState } from 'react';
import axios from 'axios';
import '../../style/pages/admin/CreateShop.scss'; // Nếu cần style riêng
import { useNavigate } from 'react-router-dom';

const CreateShop = () => {
    const navigate = useNavigate();
    const [shopData, setShopData] = useState({
        name: '',
        location: '',
        phone_number: '',
        img: null, // Thêm trường img
        url_map: '' // Thêm trường url_map
    });
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShopData({
            ...shopData,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        setShopData({
            ...shopData,
            img: e.target.files[0] // Lưu trữ file ảnh
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        // Thêm dữ liệu cửa hàng vào FormData
        formData.append('name', shopData.name);
        formData.append('location', shopData.location);
        formData.append('phone_number', shopData.phone_number);
        formData.append('url_map', shopData.url_map); // Thêm url_map vào FormData
        if (shopData.img) {
            formData.append('file', shopData.img); // Thêm ảnh vào FormData
        }

        try {
            const response = await axios.post('http://localhost:3001/api/v1/shop/shops', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data' // Đặt Header cho FormData
                }
            });
            setSuccessMessage('Shop created successfully!');
            setShopData({ name: '', location: '', phone_number: '', img: null, url_map: '' }); // Reset form
            alert("Tạo shop thành công");
            navigate('/admin/shops');

        } catch (error) {
            console.error('Error creating shop:', error);
            setErrorMessage('Failed to create shop. Please try again.');
        }
    };

    return (
        <div className="create-shop-container">
            <h1>Create New Shop</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Shop Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={shopData.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="location">Location:</label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        value={shopData.location}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="phone_number">Phone Number:</label>
                    <input
                        type="text"
                        id="phone_number"
                        name="phone_number"
                        value={shopData.phone_number}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="url_map">Map URL:</label>
                    <input
                        type="text"
                        id="url_map"
                        name="url_map"
                        value={shopData.url_map}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="img">Shop Image:</label>
                    <input
                        type="file"
                        id="img"
                        name="img"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </div>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}
                <button type="submit">Create Shop</button>
            </form>
        </div>
    );
};

export default CreateShop;