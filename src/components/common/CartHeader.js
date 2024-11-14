import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setCartItems, updateQuantity, removeItem, updateCartCount } from '../../redux/slices/cartSlice';
import "../../style/components/common/CartHeader.scss";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
const CartHeader = ({ setCart, isOpen }) => {
    const dispatch = useDispatch();
    const cartItems = useSelector(state => state.cart.items);
    const localCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const userId = useSelector(state => state.user.id);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchCartData = async () => {
            try {
                if (userId) {
                    // Lấy thông tin giỏ hàng
                    const cartResponse = await axios.get(`http://localhost:3001/api/v1/cart/user/${userId}`);
                    const cartId = cartResponse.data.id;

                    // Gọi API để lấy chi tiết sản phẩm trong giỏ hàng
                    const itemsResponse = await axios.get(`http://localhost:3001/api/v1/cartItem/cartItems/cart/${cartId}`);
                    const items = itemsResponse.data || []; // Giả sử trả về mảng các sản phẩm
                    console.log("check item >>> ", items)
                    // Cập nhật cartItems vào Redux
                    dispatch(setCartItems(items));
                } else {
                    const localCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
                    console.log("check localCartItems >>>", localCartItems)
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
    const totalAmount = Array.isArray(userId ? cartItems : localCartItems)
        ? (userId ? cartItems : localCartItems).reduce((acc, item) => {
            const price = userId
                ? parseFloat(item.variation?.product?.price) || 0
                : parseFloat(item.price) || 0; // Sử dụng giá từ localCartItems

            const quantity = item.quantity || 0;
            return acc + price * quantity;
        }, 0)
        : 0;
    const handleCloseCart = () => {
        setCart(false);
        localStorage.setItem('cart', JSON.stringify(false));
    };

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

    const handleRemoveItem = async (id, quantity) => {
        if (quantity === 0) {
            const confirmDelete = window.confirm('Sản phẩm này có số lượng bằng 0. Bạn có muốn xóa sản phẩm này khỏi giỏ hàng không?');
            if (!confirmDelete) return;
        }

        try {
            dispatch(removeItem(id));

            const localCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
            const updatedCartItems = localCartItems.filter(item => item.id !== id);
            localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));

            const newCartCount = updatedCartItems.reduce((acc, item) => acc + item.quantity, 0);
            dispatch(updateCartCount(newCartCount));

            if (userId) {
                await axios.delete(`http://localhost:3001/api/v1/cartItem/cartItems/${id}`);
            }
        } catch (error) {
            console.error('Error removing item from cart:', error);
        }
    };
    const handleCartClick = () => {
        navigate('/customer/cart');
        setCart(false);
    };
    return (
        <div className="cart-overlay">
            <div className={`cart-page ${isOpen ? 'open' : ''}`}>
                <div className="cart-overlay-box">
                    <div className="cart-overlay-box-item">
                        <p className="cart-overlay-title">Giỏ hàng</p>
                        <p className="cart-overlay-note">Bạn đang có {cartItems.length} sản phẩm trong giỏ hàng</p>
                    </div>
                    <button onClick={handleCloseCart} className="close-cart">
                        <img className="img-close-cart" src="https://res.cloudinary.com/dhjrrk4pg/image/upload/v1728520649/cross-small_3917203_rplegl.png" alt="Close" />
                    </button>
                </div>
                {loading ? (
                    <p>Đang tải sản phẩm...</p>
                ) : !Array.isArray(cartItems) || cartItems.length === 0 ? (
                    <p>Hiện chưa có sản phẩm</p>
                ) : (
                    <>
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
                                                onClick={() => handleRemoveItem(item.id, item.quantity)}
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
                                localCartItems.map(item => (
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
                                                onClick={() => handleRemoveItem(item.id, item.quantity)}
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
                        <p className="cart-item-box">
                            <span className="cart-item-tt">Tổng tiền tạm tính:</span>
                            <span className="cart-item-price">{totalAmount.toLocaleString()} VND</span>
                        </p>
                    </>
                )}
                <button className="view-cart-detail" onClick={handleCartClick}>Xem Giỏ Hàng</button>
            </div>
        </div>
    );
};

export default CartHeader;