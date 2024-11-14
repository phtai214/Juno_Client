import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { setCartItems } from '../../redux/slices/cartSlice';
import "../../style/pages/customer/Checkout.scss";
import 'bootstrap/dist/css/bootstrap.min.css';
import { updateCartCount, removeItem } from '../../redux/slices/cartSlice';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
const Checkout = () => {
    const dispatch = useDispatch();
    const cartItems = useSelector(state => state.cart.items);
    const userId = useSelector(state => state.user.id);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [loading, setLoading] = useState(true);
    const localTotalAfterPromotion = JSON.parse(localStorage.getItem('totalAfterPromotion')) || [];
    const localTotalAfterDiscount = JSON.parse(localStorage.getItem('totalAfterDiscount')) || [];
    const discountAmount = 55000;
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [paymentPayPal, setPaymentPayPal] = useState(false);
    const [payment, setPayment] = useState(false);
    const [orderIdPayment, setOrderIdPayment] = useState("");

    const navigate = useNavigate();
    useEffect(() => {
        const fetchCartData = async () => {
            try {
                if (userId) {
                    const cartResponse = await axios.get(`http://localhost:3001/api/v1/cart/user/${userId}`);
                    const cartId = cartResponse.data.id;
                    const itemsResponse = await axios.get(`http://localhost:3001/api/v1/cartItem/cartItems/cart/${cartId}`);
                    const items = itemsResponse.data || [];
                    dispatch(setCartItems(items));
                } else {
                    const localCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
                    dispatch(setCartItems(localCartItems));
                }
            } catch (error) {
                console.error('Error fetching cart data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCartData();
    }, [dispatch, userId]);

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await axios.get('https://vn-public-apis.fpo.vn/provinces/getAll?limit=-1');
                setProvinces(response.data.data.data);
            } catch (error) {
                console.error('Error fetching provinces:', error);
            }
        };

        fetchProvinces();
    }, []);

    useEffect(() => {
        const fetchDistricts = async () => {
            if (selectedProvince) {
                try {
                    const response = await axios.get(`https://vn-public-apis.fpo.vn/districts/getByProvince?provinceCode=${selectedProvince}&limit=-1`);
                    setDistricts(response.data.data.data);
                    setWards([]);
                } catch (error) {
                    console.error('Error fetching districts:', error);
                }
            }
        };

        fetchDistricts();
    }, [selectedProvince]);

    useEffect(() => {
        const fetchWards = async () => {
            if (selectedDistrict) {
                try {
                    const response = await axios.get(`https://vn-public-apis.fpo.vn/wards/getByDistrict?districtCode=${selectedDistrict}&limit=-1`);
                    setWards(response.data.data.data);
                } catch (error) {
                    console.error('Error fetching wards:', error);
                }
            }
        };

        fetchWards();
    }, [selectedDistrict]);



    const handleCreateOrder = async () => {
        const totalAmountVND = localTotalAfterDiscount; // Số tiền hiện tại bằng VND
        const exchangeRate = 24000; // Tỷ giá VND sang USD
        const totalAmountUSD = (totalAmountVND / exchangeRate).toFixed(2);
        try {
            const response = await axios.post('http://localhost:3001/api/v1/transaction/create-order', {
                totalAmount: totalAmountUSD,
            });
            const orderId = response.data.message
            return orderId;
        } catch (error) {
            console.error('Error creating PayPal order:', error);
            throw new Error('Failed to create PayPal order');
        }
    };
    const handlePaymentChange = (event) => {
        setPaymentPayPal(event.target.value === 'paypal');
    };
    const handleOrderSubmit = async (e) => {
        e.preventDefault();

        const address = e.target.address.value;
        const province = provinces.find(p => p.code === selectedProvince)?.name || '';
        const district = districts.find(d => d.code === selectedDistrict)?.name || '';
        const ward = wards.find(w => w.name === e.target.ward.value)?.name || '';
        const paymentMethod = e.target.paymentOption.value;
        const phoneNumber = e.target.number.value;
        const fullAddress = `${address}, ${ward}, ${district}, ${province}`;
        const totalAmount = localTotalAfterDiscount;


        await createOrder(paymentMethod, totalAmount, fullAddress, phoneNumber);
    };
    const createOrder = async (paymentMethod, totalAmount, fullAddress, phoneNumber) => {
        const orderData = {
            user_id: userId,
            total_amount: totalAmount,
            phone_number: phoneNumber,
            shipping_address: fullAddress,
            payment_method: paymentMethod,
            cartItems: cartItems,
        };

        try {
            // Tạo đơn hàng mới qua API
            const response = await axios.post('http://localhost:3001/api/v1/order', orderData);
            const newOrder = response.data;

            // Chuẩn bị dữ liệu giao dịch
            const transactionData = {
                user_id: userId,
                order_id: newOrder.id,
                transaction_id: generateTransactionId(), // hàm để tạo mã giao dịch duy nhất
                amount: totalAmount,
                status: "pending", // Cập nhật trạng thái giao dịch tùy theo logic
            };

            // Tạo giao dịch sau khi tạo đơn hàng thành công
            await createTransaction(transactionData);

            // Chuẩn bị dữ liệu order items
            const orderItems = cartItems.map(item => ({
                order_id: newOrder.id,
                variation_id: item.variation.id,
                quantity: item.quantity,
                price: item.variation.product.price,
            }));

            // Thêm các item vào cơ sở dữ liệu nếu đơn hàng có item
            if (orderItems.length > 0) {
                for (const orderItem of orderItems) {
                    await axios.post('http://localhost:3001/api/v1/orderItem', orderItem);
                }
            }

            // Cập nhật số lượng `quantity` cho sản phẩm và biến thể
            for (const item of cartItems) {
                const updatedQuantity = item.variation.quantity - item.quantity;

                // Gọi API để cập nhật số lượng của product và variation
                await axios.put(`http://localhost:3001/api/v1/product/${item.variation.product.id}`, {
                    quantity: item.variation.product.quantity - item.quantity, // Giảm số lượng của sản phẩm
                    variations: [{
                        id: item.variation.id,
                        quantity: updatedQuantity, // Giảm số lượng của biến thể
                    }],
                });
            }

            // Xóa các cart items khỏi cơ sở dữ liệu
            await deleteCartItems(cartItems);
            await handleRemoveItem(cartItems);

            // Cập nhật Redux và localStorage
            dispatch(updateCartCount(0)); // Đặt số lượng giỏ hàng về 0
            localStorage.removeItem('cartItems'); // Xóa cartItems khỏi localStorage
            localStorage.setItem('cartCount', JSON.stringify(0)); // Cập nhật giá trị cartCount

            alert("Đơn hàng đã được tạo thành công!");
            navigate('/customer/sale-thuong-thuong');
        } catch (error) {
            console.log('Error creating order:', error);
        }
    };
    const createTransaction = async (transactionData) => {
        try {
            // Gửi yêu cầu POST đến API để tạo transaction
            const response = await axios.post('http://localhost:3001/api/v1/transaction', transactionData);
            // Kiểm tra kết quả từ API
            if (response.status === 201) {
                console.log("Transaction created successfully:", response.data);
                return response.data; // Trả về dữ liệu giao dịch đã tạo
            } else {
                console.log("Transaction creation returned unexpected status:", response.status);
                return null;
            }
        } catch (error) {
            console.error("Error creating transaction:", error);
            return null;
        }
    };

    // Hàm tạo transaction_id duy nhất (ví dụ)
    const generateTransactionId = () => {
        return 'TX' + Date.now() + Math.floor(Math.random() * 1000);
    };

    const handleRemoveItem = async (id, quantity) => {
        // Kiểm tra nếu số lượng bằng 0 trước khi xóa
        if (quantity === 0) {
            const confirmDelete = window.confirm('Sản phẩm này có số lượng bằng 0. Bạn có muốn xóa sản phẩm này khỏi giỏ hàng không?');
            if (!confirmDelete) return;
        }

        try {
            // Xóa sản phẩm khỏi Redux
            dispatch(removeItem(id));

            // Cập nhật localStorage
            const localCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
            const updatedCartItems = localCartItems.filter(item => item.id !== id); // Giữ lại những sản phẩm không phải id này

            // Cập nhật lại localStorage
            localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));

            // Cập nhật số lượng giỏ hàng
            const newCartCount = updatedCartItems.reduce((acc, item) => acc + item.quantity, 0);
            dispatch(updateCartCount(newCartCount));

            // Xóa sản phẩm khỏi cơ sở dữ liệu
            await axios.delete(`http://localhost:3001/api/v1/cartItem/cartItems/${id}`);

        } catch (error) {
            console.error('Error removing item from cart:', error);
        }
    };

    const deleteCartItems = async (cartItems) => {
        try {
            for (const item of cartItems) {
                await axios.delete(`http://localhost:3001/api/v1/cartItem/${item.id}`); // Gọi API để xóa cartItem
            }
        } catch (error) {
            console.log('Error deleting cart items:', error);
        }
    };



    return (
        <div className="checkout-page-container">
            <div className="row checkout-page-box">
                <div className="col-md-7 checkout-page-item">
                    <p><Link to="cart">Giỏ hàng </Link> {'>'} Thông tin giao hàng  </p>
                    <form className="form-box" onSubmit={handleOrderSubmit}>
                        <h3 className="">Thông tin giao hàng</h3>
                        <input
                            type="text"
                            name="name"
                            className="nameInput"
                            placeholder="Họ và tên"
                            autoComplete="off"
                            required
                        />
                        <div className="box-input">
                            <input
                                type="text"
                                name="email"
                                className="emailInput"
                                placeholder="Email"
                                autoComplete="off"
                                required
                            />
                            <input
                                type="text"
                                name="number"
                                className="phoneInput"
                                placeholder="Số điện thoại"
                                autoComplete="off"
                                required
                            />
                        </div>
                        <input
                            type="text"
                            name="address"
                            className="nameInput"
                            placeholder="Địa chỉ"
                            autoComplete="off"
                            required
                        />
                        <div className="address-box">
                            <select
                                name="province"
                                id="province"
                                className="addressInput"
                                onChange={(e) => setSelectedProvince(e.target.value)}
                                required
                            >
                                <option value="">-- Chọn tỉnh/thành phố --</option>
                                {provinces.map((province) => (
                                    <option key={province.code} value={province.code}>{province.name}</option>
                                ))}
                            </select>
                            <select
                                name="district"
                                id="district"
                                className="addressInput"
                                onChange={(e) => setSelectedDistrict(e.target.value)}
                                required
                            >
                                <option value="">-- Chọn quận/huyện --</option>
                                {districts.map((district) => (
                                    <option key={district.code} value={district.code}>{district.name}</option>
                                ))}
                            </select>
                            <select
                                name="ward"
                                id="ward"
                                className="addressInput"
                                required
                            >
                                <option value="">-- Chọn phường/xã --</option>
                                {wards.map((ward) => (
                                    <option key={ward.code} value={ward.name}>{ward.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="shipping-method">
                            <h3>Phương thức vận chuyển</h3>
                            <label className="label-input">
                                <input type="radio" name="shippingOption" value="standard" className="input-radio" />
                                Giao hàng tiêu chuẩn
                            </label>
                        </div>
                        <div className="payment-method">
                            <h3>Phương thức thanh toán</h3>
                            <label className="label-input">
                                <input type="radio" name="paymentOption" value="cod" className="input-radio"
                                    onChange={handlePaymentChange}
                                />
                                Thanh toán khi nhận hàng
                            </label>
                            <label className="label-input">
                                <input
                                    type="radio"
                                    name="paymentOption"
                                    value="paypal"
                                    className="input-radio"
                                    onChange={handlePaymentChange}
                                />
                                Thanh toán PayPal
                            </label>
                        </div>
                        {paymentPayPal && (
                            <>
                                {!paymentSuccess ? (
                                    <PayPalScriptProvider options={{ clientId: 'AQvL5PeJlIZ7x9ugMKTRwFd_Y6pcsz9fsqvRW7I-k6Luv3YQeE9M-rCAphm-yV2m5FV7oGJtU6bZQlYd' }}>
                                        <PayPalButtons
                                            createOrder={handleCreateOrder} // Đảm bảo rằng handleCreateOrder trả về đúng orderID
                                            onApprove={async (data, actions) => {
                                                const orderID = data.orderID;
                                                try {
                                                    await actions.order?.capture();
                                                    const captureDetails = await actions.order?.get();
                                                    if (captureDetails?.status === 'COMPLETED') {
                                                        console.log('Payment successful!');
                                                        setOrderIdPayment(orderID);
                                                        setPaymentSuccess(true);
                                                        setPayment(true);
                                                    } else {
                                                        console.log('Payment not completed:', captureDetails?.status);
                                                    }
                                                } catch (error) {
                                                    console.error('Error capturing order:', error);
                                                }
                                            }}
                                            onCancel={(data) => { console.log("Đã hủy:", data); }}
                                        />
                                    </PayPalScriptProvider>
                                ) : (
                                    <div className="alert-success">Payment success!</div>
                                )}
                            </>
                        )}





                        <div className="form-end">
                            <Link to="cart">Giỏ hàng</Link>
                            <button className="form-end-btn" type="submit">Hoàn tất đơn hàng</button>
                        </div>
                    </form>
                </div>

                <div className="col-md-5 checkout-page-item">
                    {loading ? (
                        <p>Đang tải sản phẩm...</p>
                    ) : !Array.isArray(cartItems) || cartItems.length === 0 ? (
                        <p>Hiện chưa có sản phẩm trong giỏ hàng.</p>
                    ) : (
                        cartItems.map(item => (
                            <div key={item.id}>
                                <div className="cart-pay-container">
                                    <img
                                        src={item.variation.imageUrl}
                                        alt={item.variation.product.name}
                                        className="cart-item-image"
                                    />
                                    <div className="cart-item-pay">
                                        <p>{item.variation.product.name} - {item.quantity} x {Number(item.variation.product.price).toLocaleString()} VND</p>
                                        {item.variation.color && (
                                            <div style={{ marginTop: '5px', fontSize: '14px', color: '#555' }}>
                                                Màu: <span style={{ fontWeight: 'bold', color: item.variation.color }}>{item.variation.color}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="voucher-container">
                                    <p className="voucher-label">Voucher:</p>
                                    <p className="voucher-amount">{discountAmount.toLocaleString()} VND</p>
                                </div>
                                <div className="summary-container">
                                    <div className="subtotal">
                                        <p className="subtotal-label">Tạm tính:</p>
                                        <p className="subtotal-amount">{localTotalAfterPromotion.toLocaleString()} VND</p>
                                    </div>
                                    <div className="shipping-fee">
                                        <p className="shipping-fee-label">Phí vận chuyển:</p>
                                        <p className="shipping-fee-amount">Miễn phí</p>
                                    </div>
                                </div>
                                <div className="total-container">
                                    <p className="total-label">Tổng cộng:</p>
                                    <p className="total-amount">{localTotalAfterDiscount.toLocaleString()} VND</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

        </div>
    );
};

export default Checkout;