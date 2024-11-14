// src/components/UpdateShop.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import "../../style/pages/admin/UpdateShop.scss"
const UpdateShopEmployee = () => {
    const { id } = useParams(); // Lấy id từ URL
    const navigate = useNavigate();

    const [shopData, setShopData] = useState({
        name: '',
        location: '',
        phone_number: '',
        img: null, // Thêm trường img
        url_map: '' // Thêm trường url_map
    });
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        const fetchShopData = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/v1/shop/shops/${id}`);
                setShopData(response.data); // Giả sử dữ liệu trả về là một đối tượng shop
            } catch (error) {
                console.error('Error fetching shop data:', error);
                setErrorMessage('Failed to load shop data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchShopData();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShopData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setShopData((prevData) => ({
            ...prevData,
            img: e.target.files[0] // Lưu trữ file ảnh
        }));
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
            await axios.put(`http://localhost:3001/api/v1/shop/shops/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data' // Đặt Header cho FormData
                }
            });
            setSuccessMessage('Shop updated successfully!');
            alert("Shop updated successfully!");
            navigate('/employee/shops'); // Chuyển hướng về danh sách cửa hàng
        } catch (error) {
            console.error('Error updating shop:', error);
            setErrorMessage('Failed to update shop. Please try again later.');
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (errorMessage) {
        return <p className="error-message">{errorMessage}</p>;
    }

    return (
        <div className="update-shop-container">
            <h1>Update Shop</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={shopData.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
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
                <div className="form-group">
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
                <div className="form-group">
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
                <div className="form-group">
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
                <button type="submit">Update Shop</button>
            </form>
        </div>
    );
};

export default UpdateShopEmployee;