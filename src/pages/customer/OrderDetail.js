import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "../../style/pages/customer/OrderDetail.scss";
import axios from 'axios';

const OrderDetail = () => {
    const { id } = useParams();
    const [orderItems, setOrderItems] = useState([]);
    const [orderDetails, setOrderDetails] = useState(null);
    const [reviews, setReviews] = useState({});

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/v1/order/${id}`);
                setOrderDetails(response.data);
            } catch (error) {
                console.error('Error fetching order details:', error);
            }
        };

        fetchOrderDetails();
    }, [id]);

    useEffect(() => {
        const fetchOrderItems = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/v1/orderItem/order/${id}`);
                setOrderItems(response.data);
            } catch (error) {
                console.error('Error fetching order items:', error);
            }
        };

        fetchOrderItems();
    }, [id]);

    useEffect(() => {
        const fetchReviews = async () => {
            const userId = localStorage.getItem("userId");
            const reviewData = {};

            await Promise.all(orderItems.map(async (item) => {
                try {
                    const response = await axios.get(`http://localhost:3001/api/v1/review/product/${item.variation.productId}`);
                    reviewData[item.variation.productId] = response.data.filter(review => review.userId === parseInt(userId));
                } catch (error) {
                    console.error(`Error fetching reviews for product ${item.variation.productId}:`, error);
                }
            }));

            setReviews(reviewData);
        };

        if (orderItems.length > 0) {
            fetchReviews();
        }
    }, [orderItems]);

    const formatPrice = (price) => {
        const amount = parseFloat(price);
        return amount.toLocaleString('en-US', { style: 'currency', currency: 'VND' }).replace('₫', '').trim() + ' VND';
    };

    // Function to handle order cancellation
    const handleCancelOrder = async () => {
        if (orderDetails.status === 'pending') {
            try {
                const updatedData = { status: 'cancelled' };
                await axios.put(`http://localhost:3001/api/v1/order/${id}`, updatedData);
                setOrderDetails((prev) => ({ ...prev, status: 'cancelled' }));
                alert("Đơn hàng đã được hủy thành công.");
            } catch (error) {
                console.error('Error canceling order:', error);
                alert("Đã xảy ra lỗi khi hủy đơn hàng. Vui lòng thử lại.");
            }
        } else {
            alert("Chỉ có thể hủy đơn hàng đang chờ xử lý.");
        }
    };

    return (
        <div className="order-detail-page">
            <h2>Chi tiết đơn hàng</h2>
            {orderDetails && (
                <div className="order-summary">
                    <p><strong>Trạng thái:</strong> {orderDetails.status}</p>
                    <p><strong>Phương thức thanh toán:</strong> {orderDetails.payment_method}</p>
                    <p><strong>Địa chỉ giao hàng:</strong> {orderDetails.shipping_address}</p>
                    <p><strong>Số điện thoại:</strong> {orderDetails.phone_number}</p>
                    <p><strong>Tên người nhận:</strong> {orderDetails.name}</p>
                    <p><strong>Ngày tạo:</strong> {new Date(orderDetails.created_at).toLocaleDateString()}</p>
                    {/* Cancel Order Button */}
                    {orderDetails.status === 'pending' && (
                        <button onClick={handleCancelOrder} className="cancel-order-button">
                            Hủy Đơn Hàng
                        </button>
                    )}
                </div>
            )}
            {orderItems.length > 0 ? (
                <div className="order-items-list">
                    {orderItems.map((item) => (
                        <div key={item.id} className="order-item">
                            <img
                                src={item.variation.imageUrl}
                                alt={item.variation.product.name}
                                className="order-item-image"
                            />
                            <div className="order-item-details">
                                <h3>{item.variation.product.name}</h3>
                                <p>Kích thước: {item.variation.size}</p>
                                <p>Màu sắc: {item.variation.color}</p>
                                <p>Số lượng: {item.quantity}</p>
                                <p>Giá: {formatPrice(item.price)}</p>
                                <p>Tổng cộng: {formatPrice(item.quantity * item.price)}</p>
                                <div className="order-item-reviews">
                                    <h4>Đánh giá của bạn:</h4>
                                    {reviews[item.variation.productId] && reviews[item.variation.productId].length > 0 ? (
                                        reviews[item.variation.productId].map((review) => (
                                            <div key={review.id} className="review-item">
                                                <p><strong>Đánh giá:</strong> {review.rating}/5</p>
                                                <p><strong>Nội dung:</strong> {review.comment}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p>Không có đánh giá nào từ bạn.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Không có sản phẩm trong đơn hàng này.</p>
            )}
        </div>
    );
};

export default OrderDetail;
