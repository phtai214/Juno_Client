import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';
import BookingSelect from "../../components/common/booking"

const OrderUpdateEmployee = () => {
    const [orderDetails, setOrderDetails] = useState(null);
    const [orderItems, setOrderItems] = useState([]);
    const [orderStatus, setOrderStatus] = useState('');
    const { id } = useParams(); // ID của đơn hàng từ URL
    const navigate = useNavigate();


    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/v1/order/${id}`);
                setOrderDetails(response.data);
                setOrderStatus(response.data.status);
            } catch (error) {
                console.error('Lỗi khi lấy thông tin đơn hàng:', error);
            }
        };

        const fetchOrderItems = async () => {
            try {
                const itemsResponse = await axios.get(`http://localhost:3001/api/v1/orderItem/order/${id}`);
                setOrderItems(itemsResponse.data);
            } catch (error) {
                console.error('Error fetching order items:', error);
            }
        };

        fetchOrderDetails();
        fetchOrderItems();
    }, [id]);

    const handleStatusChange = (value) => {
        setOrderStatus(value);
    };

    const handleUpdate = async (event) => {
        event.preventDefault();
        const updatedData = { status: orderStatus };

        try {
            await axios.put(`http://localhost:3001/api/v1/order/${id}`, updatedData);
            alert("order update successfully!");
            navigate("/employee/orders"); // Sử dụng navigate để chuyển hướng
        } catch (error) {
            console.error('Failed to update order:', error);
        }
    };

    return (
        <div className="view-container">
            <h2>Order Update</h2>
            {orderDetails && (
                <div>
                    <p><strong>User ID:</strong> <i>{orderDetails.user_id}</i></p>
                    <p><strong>Total Amount:</strong> <i>{orderDetails.total_amount}</i></p>
                    <p><strong>Status:</strong> <i>{orderDetails.status}</i></p>
                    <p><strong>Payment Method:</strong> <i>{orderDetails.payment_method}</i></p>
                    <p><strong>Shipping Address:</strong> <i>{orderDetails.shipping_address}</i></p>
                    <p><strong>Created At:</strong> <i>{moment(orderDetails.created_at).format('YYYY-MM-DD HH:mm:ss')}</i></p>
                    <p><strong>Updated At:</strong> <i>{moment(orderDetails.updated_at).format('YYYY-MM-DD HH:mm:ss')}</i></p>
                    <div>
                        <p className="stt-book"><strong>Order Status:</strong>
                            <BookingSelect
                                value={orderStatus}
                                onChange={handleStatusChange}
                            />
                        </p>
                    </div>
                    <button className="sub-update" onClick={handleUpdate}>Update</button>
                </div>
            )}
            <div>
                <h3>Order Items</h3>
                {orderItems.length > 0 ? (
                    <ul>
                        {orderItems.map(item => (
                            <li key={item.id}>
                                <p><strong>Variation ID:</strong> {item.variation_id}</p>
                                <p><strong>Quantity:</strong> {item.quantity}</p>
                                <p><strong>Price:</strong> {item.price}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No items found for this order.</p>
                )}
            </div>
        </div>
    );
};

export default OrderUpdateEmployee;