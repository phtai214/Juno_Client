import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from "axios";
import "../../style/pages/customer/NewProduct.scss";

const NewProduct = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [sortOption, setSortOption] = useState('manual');
    const { category } = useParams();
    const capitalizedCategory = category.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/v1/product/products');
                if (Array.isArray(response.data.products)) {
                    const newProducts = response.data.products
                        .filter(product => {
                            return product.category === capitalizedCategory; // Điều kiện lọc
                        })
                        .map(product => ({
                            ...product,
                            image_url: product.image_url.replace(/"/g, ''),
                        }));

                    setProducts(newProducts);
                    setFilteredProducts(newProducts);
                } else {
                    console.error('Products data is not an array:', response.data.products);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchData();
    }, [capitalizedCategory]); // Thêm formattedCategory vào dependency array

    // Hàm xử lý thay đổi lựa chọn sắp xếp
    const handleSortChange = (e) => {
        const selectedOption = e.target.value;
        setSortOption(selectedOption);
        let sortedProducts = [...products];

        if (selectedOption === 'price-ascending') {
            sortedProducts.sort((a, b) => a.price - b.price);
        } else if (selectedOption === 'price-descending') {
            sortedProducts.sort((a, b) => b.price - a.price);
        } else if (selectedOption === 'created-descending') {
            sortedProducts.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
        } else if (selectedOption === 'best-selling') {
            sortedProducts.sort((a, b) => b.sold_quantity - a.sold_quantity);
        }

        setFilteredProducts(sortedProducts);
    };

    return (
        <div className="product-container">
            <div className="box-data-product">
                <div className="newStyle link-small">
                    <h2></h2>
                </div>

                {/* Bộ lọc */}
                <div className="borderFilterMobile option browse-tags">
                    <label className="lb-filter" htmlFor="sort-by">Sắp xếp theo:</label>
                    <span className="custom-dropdown custom-dropdown--grey">
                        <select
                            className="sort-by custom-dropdown__select"
                            id="sort-by"
                            value={sortOption}
                            onChange={handleSortChange}
                        >
                            <option value="manual" data-filter="manual">Tùy chọn</option>
                            <option value="price-ascending" data-filter="&amp;sortby=(price:product=asc)">Giá: Tăng dần</option>
                            <option value="price-descending" data-filter="&amp;sortby=(price:product=desc)">Giá: Giảm dần</option>
                            <option value="created-descending" data-filter="&amp;sortby=(updated_at:product=desc)">Mới nhất</option>
                            <option value="best-selling" data-filter="&amp;sortby=(sold_quantity:product=desc)">Bán chạy nhất</option>
                        </select>
                        <span className="visible-xs btnSortMobile">
                            <i className="fa fa-sort"></i>
                        </span>
                    </span>
                </div>

                {/* Hiển thị sản phẩm */}
                <div className="combo-new-container">
                    <div className="combo-new row">
                        {filteredProducts.length === 0 ? (
                            <p>Không có sản phẩm mới nào.</p>
                        ) : (
                            filteredProducts.map((product, index) => (
                                <div key={index} className="combo-new-box col-md-3 col-sm-3">
                                    <Link to={`/customer/product/slug/${product.slug}`}>
                                        <img className="combo-new-box-img" src={product.image_url} alt={product.name} />
                                    </Link>
                                    <div className="btn-product-color">
                                        {product.variations && product.variations.map((variation, i) => (
                                            <button key={i} className={`btn-color${i + 1}`} style={{ backgroundColor: variation.color }}></button>
                                        ))}
                                    </div>
                                    <p className="name-product">{product.name}</p>
                                    <p className="price-product">{parseInt(product.price).toLocaleString('vi-VN')}đ</p>
                                    {product.quantity <= 0 && <span className="out-of-stock-tag">Hết hàng</span>} {/* Thêm thẻ Hết hàng */}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewProduct;