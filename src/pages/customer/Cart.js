import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { setCartItems, updateQuantity, removeItem, setTotalAfterPromotion, setTotalAfterDiscount } from '../../redux/slices/cartSlice';
import "../../style/components/common/Cart.scss";
import { setUser } from '../../redux/slices/userSlice'; // Import setUser để thiết lập redirectTo

const Cart = () => {
    const dispatch = useDispatch();
    const cartItems = useSelector(state => state.cart.items);
    const userId = useSelector(state => state.user.id);
    const [shippingFee, setShippingFee] = useState(25000); // Phí ship cố định
    const [voucher, setVoucher] = useState('');
    const [voucherDiscount, setVoucherDiscount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [voucherBox, setVoucherBox] = useState(false);
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const [hasCartInitialized, setHasCartInitialized] = useState(false); // State mới
    const discountAmount = 55000;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCartData = async () => {
            if (userId) {
                try {
                    const cartResponse = await axios.get(`http://localhost:3001/api/v1/cart/user/${userId}`);
                    const cartId = cartResponse.data.id;
                    const itemsResponse = await axios.get(`http://localhost:3001/api/v1/cartItem/cartItems/cart/${cartId}`);
                    dispatch(setCartItems(itemsResponse.data || []));
                } catch (error) {
                    console.error('Error fetching cart data:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchCartData();
    }, [dispatch, userId]);

    useEffect(() => {
        const cartInitialized = localStorage.getItem('cartInitialized');

        // Gọi createOrUpdateCart khi người dùng đăng nhập và giỏ hàng chưa được khởi tạo
        if (isLoggedIn && !cartInitialized) {
            createOrUpdateCart();
            localStorage.setItem('cartInitialized', 'true'); // Đánh dấu rằng giỏ hàng đã được khởi tạo
        }
    }, [isLoggedIn]);

    const createOrUpdateCart = async () => {
        const localCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        console.log("check >> localCartItems", localCartItems)
        if (!userId) return; // Nếu không có userId, không cần làm gì

        try {
            const cartResponse = await axios.get(`http://localhost:3001/api/v1/cart/user/${userId}`);
            let cartId;

            if (cartResponse.data) {
                cartId = cartResponse.data.id; // Nếu có giỏ hàng, lấy cartId
            } else {
                const createCartResponse = await axios.post('http://localhost:3001/api/v1/cart/carts', { user_id: userId });
                cartId = createCartResponse.data.cart.id;
            }

            // Tạo một danh sách sản phẩm đã có trong giỏ hàng trên server
            const existingItemsResponse = await axios.get(`http://localhost:3001/api/v1/cartItem/cartItems/cart/${cartId}`);
            const existingItems = Array.isArray(existingItemsResponse.data) ? existingItemsResponse.data.reduce((acc, item) => {
                acc[item.product_id] = item; // Tạo một đối tượng để kiểm tra nhanh
                return acc;
            }, {}) : {}; // Nếu không phải mảng, trả về đối tượng rỗng

            // Gửi từng sản phẩm trong giỏ hàng lên server
            for (const item of localCartItems) {
                if (existingItems[item.id]) {
                    // Nếu sản phẩm đã tồn tại, cập nhật số lượng
                    await axios.put(`http://localhost:3001/api/v1/cartItem/cartItems/${existingItems[item.id].id}`, {
                        quantity: existingItems[item.id].quantity + item.quantity // Cộng thêm số lượng
                    });
                } else {
                    // Nếu chưa có, thêm sản phẩm mới
                    console.log("check quantity >>>", item.quantity)
                    await axios.post(`http://localhost:3001/api/v1/cartItem/cartItems`, {
                        product_id: item.id,
                        quantity: 1,
                        cart_id: cartId,
                        color: item.color,
                        variation_id: item.variation_id
                    });
                }
            }

            // Xóa localStorage sau khi gửi
            localStorage.removeItem('cartItems');
            dispatch(setCartItems([])); // Reset giỏ hàng trong Redux
            alert("Đơn hàng đã được tạo thành công!");

            // Đợi 2 giây trước khi điều hướng đến trang checkout
            await new Promise(resolve => setTimeout(resolve, 5000));
            // Điều hướng đến trang checkout
            navigate('/customer/cart');
        } catch (error) {
            console.error('Error during order submission:', error);
            alert('Đã xảy ra lỗi trong quá trình đặt hàng.');
        }
    };

    // Tính toán tổng tiền dựa trên trạng thái đăng nhập
    const totalAmount = Array.isArray(cartItems) ? cartItems.reduce((acc, item) => {
        const price = parseFloat(item.variation?.product?.price) || parseFloat(item.price) || 0;
        return acc + price * (item.quantity || 0);
    }, 0) : 0;

    const totalAfterPromotion = totalAmount - discountAmount;
    const totalAfterDiscount = totalAfterPromotion + shippingFee; // Thay đổi dấu cho phí ship
    localStorage.setItem('totalAfterPromotion', totalAfterPromotion);
    localStorage.setItem('totalAfterDiscount', totalAfterDiscount);
    localStorage.setItem('shippingFee', shippingFee);

    useEffect(() => {
        dispatch(setTotalAfterPromotion(totalAfterPromotion));
        dispatch(setTotalAfterDiscount(totalAfterDiscount));
    }, [dispatch, totalAfterPromotion, totalAfterDiscount]);

    const handleQuantityChange = async (id, event) => {
        const newQuantity = parseInt(event.target.value);
        if (!isNaN(newQuantity) && newQuantity >= 0) {
            try {
                dispatch(updateQuantity({ id, quantity: newQuantity }));
                await axios.put(`http://localhost:3001/api/v1/cartItem/cartItems/${id}`, { quantity: newQuantity });
            } catch (error) {
                console.error('Error updating cart item quantity:', error);
            }
        }
    };

    const handleRemoveItem = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/api/v1/cartItem/cartItems/${id}`);
            dispatch(removeItem(id));
        } catch (error) {
            console.error('Error removing item from cart:', error);
        }
    };

    const handleVoucherApply = () => {
        if (voucher === 'DISCOUNT10') {
            setVoucherDiscount(totalAmount * 0.1);
        } else {
            alert("Voucher không hợp lệ");
        }
    };

    const handleOrderClick = async () => {
        if (!isLoggedIn) {
            // Nếu chưa đăng nhập, lưu lại trang cần trở về sau khi đăng nhập
            dispatch(setUser({ id: null, redirectTo: '/customer/cart' }));
            navigate('/login'); // Chuyển hướng đến trang đăng nhập
        } else {
            // Nếu đã đăng nhập, điều hướng đến trang checkout
            navigate('/customer/checkout');
        }
    };


    return (
        <div className="cart-page-container">
            <h4 className="cart-page-title">Giỏ hàng của bạn ({cartItems.length} sản phẩm trong giỏ hàng)</h4>
            <div className="row cart-page-box">
                <div className="col-md-7 cart-page-box-item">
                    {loading ? (
                        <p>Đang tải sản phẩm...</p>
                    ) : !Array.isArray(cartItems) || cartItems.length === 0 ? (
                        <p>Hiện chưa có sản phẩm</p>
                    ) : (
                        <ul className="cart-box-data">
                            {userId ? (
                                cartItems.map(item => (
                                    <li key={item.id} className="cart-item-data row">
                                        <div className="cart-box-data-item col-md-3 col-sm-3">
                                            <img
                                                src={item?.variation?.imageUrl || 'default-image-url.jpg'}
                                                alt={item?.variation?.product?.name || 'Product Name'}
                                                className="cart-item-image"
                                            />
                                        </div>
                                        <div className="cart-box-data-item col-md-8 col-sm-8">
                                            <p className="cart-box-data-item-product-name">
                                                {item?.variation?.product?.name || 'Product Name'} - {parseFloat(item?.variation?.product?.price || 0).toLocaleString()} VND x
                                            </p>
                                            <input
                                                type="number"
                                                value={item.quantity || 0}
                                                min="0"
                                                onChange={(event) => handleQuantityChange(item.id, event)}
                                                className="cart-box-data-item-quantity"
                                            />
                                            = {(parseFloat(item?.variation?.product?.price || 0) * (item.quantity || 0)).toLocaleString()} VND
                                            <button
                                                className="cart-item-btn-remove"
                                                onClick={() => handleRemoveItem(item.id)}
                                                style={{ marginLeft: '10px' }}
                                            >
                                                Xóa
                                            </button>
                                            {item?.variation?.color && (
                                                <div style={{ marginTop: '5px', fontSize: '14px', color: '#555' }}>
                                                    Màu: <span style={{ fontWeight: 'bold', color: item.variation.color }}>{item.variation.color}</span>
                                                </div>
                                            )}
                                        </div>
                                    </li>
                                ))
                            ) : (
                                (JSON.parse(localStorage.getItem('cartItems')) || []).map(item => (
                                    <li key={item.id} className="cart-item-data row">
                                        <div className="cart-box-data-item col-md-3 col-sm-3">
                                            <img
                                                src={item.imgURL || 'default-image-url.jpg'}
                                                alt={item.name || 'Product Name'}
                                                className="cart-item-image"
                                            />
                                        </div>
                                        <div className="cart-box-data-item col-md-8 col-sm-8">
                                            <p className="cart-box-data-item-product-name">
                                                {item.name || 'Product Name'} - {parseFloat(item.price || 0).toLocaleString()} VND x
                                            </p>
                                            <input
                                                type="number"
                                                value={item.quantity || 0}
                                                min="0"
                                                onChange={(event) => handleQuantityChange(item.id, event)}
                                                className="cart-box-data-item-quantity"
                                            />
                                            = {(parseFloat(item.price || 0) * (item.quantity || 0)).toLocaleString()} VND
                                            <button
                                                className="cart-item-btn-remove"
                                                onClick={() => handleRemoveItem(item.id)}
                                                style={{ marginLeft: '10px' }}
                                            >
                                                Xóa
                                            </button>
                                            {item.color && (
                                                <div style={{ marginTop: '5px', fontSize: '14px', color: '#555' }}>
                                                    Màu: <span style={{ fontWeight: 'bold', color: item.color }}>{item.color}</span>
                                                </div>
                                            )}
                                        </div>
                                    </li>
                                ))
                            )}
                        </ul>
                    )}
                    <p className="cart-page-box-note">
                        <i className="note-highlight">
                            - Do lượng đơn hàng tăng cao và ảnh hưởng của bão ở một số khu vực nên việc vận chuyển có thể chậm hơn dự kiến. Mong quý khách hàng thông cảm
                            (*) Click Lấy Voucher giảm thêm để nhận ưu đãi.
                        </i>
                    </p>
                    <p className="cart-item-box">
                        <span className="cart-item-tt">Tổng tiền tạm tính:</span>
                        <span className="cart-item-price">{totalAfterPromotion.toLocaleString()} VND</span>
                    </p>
                </div>

                <div className="col-md-5 cart-page-box-item">
                    {!isLoggedIn && (
                        <p><Link to="/login">Đăng nhập</Link> để tích điểm và hưởng ưu đãi hạng thành viên từ JUNO.</p>
                    )}
                    <div className="order-summary-box-all">
                        <h5 className="order-summary-title">TÓM TẮT ĐƠN HÀNG</h5>
                        <div className="order-summary-box-top">
                            <div className="order-summary">
                                <p className="total-amount">Tổng tiền hàng:</p>
                                <p className="total-amount">Chương trình khuyến mãi:</p>
                            </div>
                            <div className="order-summary-end">
                                <p className="total-amount">{totalAmount.toLocaleString()} VND</p>
                                <p className="total-amount">-55,000₫</p>
                            </div>
                        </div>
                        <div className="order-summary-box">
                            <div className="order-summary">
                                <p className="total-amount">Tạm tính:</p>
                                <p className="total-amount">Phí vận chuyển:</p>
                                <p className="total-amount">Giảm giá vận chuyển:</p>
                            </div>
                            <div className="order-summary-end">
                                <p className="total-amount">{totalAfterPromotion.toLocaleString()} VND</p>
                                <p className="total-amount">{shippingFee.toLocaleString()} VND</p>
                                <p className="total-amount">-{shippingFee.toLocaleString()} VND</p>
                            </div>
                        </div>
                    </div>
                    <div className="voucher-container">
                        <h6 className="voucher-title">Voucher giảm thêm</h6>
                        <div className="voucher-box">
                            <p className="voucher-item">
                                Chọn voucher hoặc nhập mã
                                <img className="voucher-image" src="https://res.cloudinary.com/dhjrrk4pg/image/upload/v1730613212/down-arrow_11043730_czu97m.png" alt="Down Arrow" />
                            </p>
                        </div>
                        {voucherBox && (
                            <div>
                                <input
                                    type="text"
                                    value={voucher}
                                    onChange={(e) => setVoucher(e.target.value)}
                                    placeholder="Nhập mã voucher"
                                />
                                <button onClick={handleVoucherApply}>Áp dụng</button>
                                {voucherDiscount > 0 && (
                                    <p>Giảm giá từ voucher: {voucherDiscount.toLocaleString()} VND</p>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="order-summary-box-all">
                        <div className="order-summary-box">
                            <div className="order-summary">
                                <p className="total-amount-end">Tổng tiền :</p>
                            </div>
                            <div className="order-summary-end">
                                <p className="total-amount-end">{totalAfterDiscount.toLocaleString()} VND</p>
                                <p className="total-amount-end-highlight">tiết kiệm {shippingFee.toLocaleString()} VND</p>
                            </div>
                        </div>
                        <button className="btn-order-now" onClick={handleOrderClick}>Tiến Hàng Đặt Hàng</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;