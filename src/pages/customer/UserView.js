import React, { useEffect, useState, useRef } from "react";
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import "../../style/pages/customer/UserView.scss";
import { useDispatch } from "react-redux";
import * as yup from 'yup';
import moment from 'moment';

const UserView = () => {
    const [user, setUser] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const inputFileRef = useRef(null);

    const [avatar, setAvatar] = useState(null);
    const [name, setName] = useState('');
    const [phonenumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');

    const [updateUserMessage, setUpdateUserMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [validation, setValidation] = useState(false);
    const [orders, setOrders] = useState([]);

    // Fetch user data
    const fetchUserData = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/api/v1/user/${id}`);
            const userData = response.data;
            setUser(userData);
            setName(userData.name || '');
            setEmail(userData.email || '');
            setPhoneNumber(userData.phonenumber || '');
            setAddress(userData.address || '');
        } catch (error) {
            console.error('Error fetching user information:', error);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [id]);

    // Handle image upload
    const handleImageClick = () => {
        inputFileRef.current?.click();
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                dispatch({ type: "SET_SELECTED_IMAGE", payload: reader.result });
            };
            reader.readAsDataURL(file);
            setAvatar(file);
        }
    };

    // Input change handlers
    const handleInputChange = (setter) => (e) => setter(e.target.value);

    // Validation schema
    const validationSchema = yup.object().shape({
        name: yup.string().required('Name is required'),
        email: yup.string()
            .matches(
                /^[\w.%+-]+@(gmail\.com|outlook\.com|hotmail\.com|yahoo\.com|protonmail\.com|mail\.ru|web\.de|usa\.com)$/,
                'Invalid email'
            )
            .required('Email is required'),
        phonenumber: yup.string()
            .matches(/^\d{7,11}$/, 'Invalid phone number')
            .required('Phone number is required'),
    });

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await validationSchema.validate({ name, email, phonenumber, address }, { abortEarly: false });

            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('phonenumber', phonenumber);
            formData.append('address', address);
            if (avatar) {
                formData.append('file', avatar);
            }

            const response = await axios.put(`http://localhost:3001/api/v1/user/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Response:', response.data);
            dispatch({ type: "CLEAR_SELECTED_IMAGE" });
            setUpdateUserMessage('Update successful!');
            setShowAlert(true);
            fetchUserData();
            alert("hủy đơn thành công");
            resetForm();
        } catch (error) {
            console.error('Error:', error);
            handleError(error);
        }
    };

    const resetForm = () => {
        setName('');
        setEmail('');
        setPhoneNumber('');
        setAddress('');
        setAvatar(null);
    };

    const handleError = (error) => {
        if (error instanceof yup.ValidationError) {
            const validationErrors = error.inner.map(err => err.message);
            setUpdateUserMessage('Validation error: ' + validationErrors.join(', '));
            setValidation(true);
        } else {
            setUpdateUserMessage('An error occurred while updating the user.');
        }
    };

    // Fetch user orders
    const fetchOrders = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/api/v1/order/users/${id}`);
            const ordersData = await Promise.all(response.data.map(async (order) => {
                const orderItemsResponse = await axios.get(`http://localhost:3001/api/v1/orderItem/order/${order.id}`);
                return { ...order, orderItems: orderItemsResponse.data };
            }));

            setOrders(ordersData);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    useEffect(() => {
        if (id) fetchOrders();
    }, [id]);

    const formatPrice = (price) => {
        const amount = parseFloat(price);
        return amount.toLocaleString('en-US', { style: 'currency', currency: 'VND' }).replace('₫', '').trim() + ' VND';
    };


    const handleOrderClick = (orderId) => {
        navigate(`/customer/order-detail/${orderId}`);
    };

    return (
        <>
            <form className="user-container" onSubmit={handleSubmit}>
                {user ? (
                    <div className="row">
                        <div className="col-sm-8">
                            <div className="ava-header">
                                <div className="image">
                                    <img src={avatar ? URL.createObjectURL(avatar) : user?.avatar} alt={user?.name} className="avatar" />
                                    <img className="icon" src="https://res.cloudinary.com/dhjrrk4pg/image/upload/v1730860156/camera_685655_bspmgz.png" onClick={handleImageClick} alt="Upload" />
                                    <input ref={inputFileRef} type="file" name="image" style={{ display: 'none' }} onChange={handleImageChange} />
                                </div>
                                <div className="name">
                                    <h2>
                                        <input type="text" name="name" value={name} onChange={handleInputChange(setName)} />
                                    </h2>
                                </div>
                            </div>
                            <div className="email">
                                <h5>Email:</h5>
                                <input type="text" name="email" value={email} onChange={handleInputChange(setEmail)} />
                            </div>
                            <div className="phone-number">
                                <h5>Phone number:</h5>
                                <input type="text" name="phonenumber" value={phonenumber} onChange={handleInputChange(setPhoneNumber)} />
                            </div>
                            <div className="email">
                                <h5>Address:</h5>
                                <input type="text" name="address" value={address} onChange={handleInputChange(setAddress)} />
                            </div>
                            <button className="btn" type="submit">Save</button>
                        </div>
                        {showAlert && (
                            <div className="col-sm-2">
                                <div className="successful">
                                    <div className="Update"> Update successful </div>
                                    <button onClick={() => setShowAlert(false)}>ok</button>
                                </div>
                            </div>
                        )}
                        {validation && (
                            <div className="col-sm-3">
                                <div className="successful">
                                    <div className="Update"> Validation error </div>
                                    <button onClick={() => setValidation(false)}>ok</button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div>Loading...</div>
                )}
            </form>
            <div className="purchase-history">
                <h3 className="purchase-history-title">Lịch sử mua hàng</h3>
                {orders.length > 0 ? (
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th className="table-header">Id đơn hàng</th>
                                <th className="table-header">Giá trị đơn hàng</th>
                                <th className="table-header">Trạng thái giao hàng</th>
                                <th className="table-header">Thời gian đặt hàng</th>
                                <th className="table-header">Sản phẩm</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id} className="order-row" onClick={() => handleOrderClick(order.id)}>
                                    <td className="order-id">{order.id}</td>
                                    <td className="order-total">{formatPrice(order.total_amount)}</td>
                                    <td className="order-status">{order.status}</td>
                                    <td className="order-created-at">{moment(order.created_at).format('HH:mm - DD-MM-YYYY')}</td>
                                    <td className="order-items">
                                        {order.orderItems && order.orderItems.length > 0 ? (
                                            order.orderItems.map(item => (
                                                <div key={item.id} className="order-item">
                                                    <p>Product Name: {item.variation.product.name}</p>
                                                    <p>Quantity: {item.quantity}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <p>No items</p>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No purchase history available.</p>
                )}
            </div>
        </>
    );
};

export default UserView;