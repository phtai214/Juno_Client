import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchProducts } from '../../redux/slices/productSlice';
import "../../style/pages/customer/Product.scss";
import { Link } from 'react-router-dom';
import axios from "axios";

const Products = () => {
    const dispatch = useDispatch();
    const [products, setProducts] = useState([]);
    const [combo749k, setCombo749k] = useState(true);
    const [combo899k, setCombo899k] = useState(false);
    const [combo949k, setCombo949k] = useState(false);
    const [combo1149k, setCombo1149k] = useState(false);
    const [combo249k, setCombo249k] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/v1/product/products');
                if (Array.isArray(response.data.products)) {
                    const formattedProducts = response.data.products.map(product => ({
                        ...product,
                        image_url: product.image_url.replace(/"/g, ''),
                    }));
                    setProducts(formattedProducts);
                } else {
                    console.error('Products data is not an array:', response.data.products);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchData();
        dispatch(fetchProducts());
    }, [dispatch]);

    return (
        <div className="product-container">
            <img className="banner-sale-thuong-thuong" src="https://res.cloudinary.com/dhjrrk4pg/image/upload/v1729468478/sale-banner-juno_lbsj4s.png" />
            <div className="box-data-product">
                <div className="newStyle link-small">
                    <div className="box-btn-product">
                        <button className="box-btn-product-setprice active" onClick={() => { setCombo749k(true); setCombo899k(false); setCombo949k(false); setCombo1149k(false); setCombo249k(false); }}>SET 749K</button>
                        <button className="box-btn-product-setprice" onClick={() => { setCombo749k(false); setCombo899k(true); setCombo949k(false); setCombo1149k(false); setCombo249k(false); }}>SET 899K</button>
                        <button className="box-btn-product-setprice" onClick={() => { setCombo749k(false); setCombo899k(false); setCombo949k(true); setCombo1149k(false); setCombo249k(false); }}>SET 949K</button>
                    </div>
                </div>
                {combo749k && (
                    <div className="combo749-container">
                        <div className="combo749 row">
                            {products.length === 0 ? (
                                <p>Không có sản phẩm nào.</p>
                            ) : (
                                products.map((product, index) => (
                                    <div key={index} className="combo749-box col-md-3 col-sm-3">
                                        <Link to={`/customer/product/slug/${product.slug}`}>
                                            <img className="combo749-box-img" src={product.image_url} alt={product.name} />
                                        </Link>
                                        <div className="btn-product-color">
                                            {product.variations && product.variations.map((variation, i) => (
                                                <button key={i} className={`btn-color${i + 1}`} style={{ backgroundColor: variation.color }}></button>
                                            ))}
                                        </div>
                                        <p className="name-product">{product.name}</p>
                                        <p className="price-product">{parseInt(product.price).toLocaleString('vi-VN')}đ</p>
                                        {product.quantity <= 0 && <span className="out-of-stock-tag ">Hết hàng</span>} {/* Thêm thẻ Hết hàng */}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Products;