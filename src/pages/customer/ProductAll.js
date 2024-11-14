import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchProducts } from '../../redux/slices/productSlice';
import "../../style/pages/customer/Product.scss";
import { Link } from 'react-router-dom';
import axios from "axios";

const Products = () => {
    const dispatch = useDispatch();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [sortOption, setSortOption] = useState('manual');

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
                    setFilteredProducts(formattedProducts);
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

    const handleSortChange = (e) => {
        const selectedOption = e.target.value;
        setSortOption(selectedOption);
        let sortedProducts = [...products];

        if (selectedOption === 'price-ascending') {
            sortedProducts.sort((a, b) => a.price - b.price);
        } else if (selectedOption === 'price-descending') {
            sortedProducts.sort((a, b) => b.price - a.price);
        } else if (selectedOption === 'created-descending') {
            sortedProducts.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        } else if (selectedOption === 'best-selling') {
            sortedProducts.sort((a, b) => b.sold_quantity - a.sold_quantity);
        }

        setFilteredProducts(sortedProducts);
    };

    return (
        <div className="product-container">
            <div className="borderFilterMobile option browse-tags">
                <label className="lb-filter" htmlFor="sort-by">Sắp xếp theo:</label>
                <span className="custom-dropdown custom-dropdown--grey">
                    <select
                        className="sort-by custom-dropdown__select"
                        id="sort-by"
                        value={sortOption}
                        onChange={handleSortChange}
                    >
                        <option value="manual">Tùy chọn</option>
                        <option value="price-ascending">Giá: Tăng dần</option>
                        <option value="price-descending">Giá: Giảm dần</option>
                        <option value="created-descending">Mới nhất</option>
                        <option value="best-selling">Bán chạy nhất</option>
                    </select>
                </span>
            </div>

            <div className="combo749-container">
                <div className="combo749 row">
                    {filteredProducts.length === 0 ? (
                        <p>Không có sản phẩm nào.</p>
                    ) : (
                        filteredProducts.map((product, index) => (
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
                                {product.quantity <= 0 && <span className="out-of-stock-tag">Hết hàng</span>}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Products;