import { useEffect, useState } from 'react';
import axios from 'axios';
import React from "react";
import "../../style/pages/admin/product.scss";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";
import ReactPaginate from 'react-paginate';

function ProductEmployee() {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const itemsPerPage = 10; // Số sản phẩm mỗi trang

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/v1/product/products?page=${currentPage}&limit=${itemsPerPage}`);
                const data = response.data; // Lấy dữ liệu từ phản hồi
                console.log("check data", data);

                // Kiểm tra xem data.products có phải là mảng hay không
                if (Array.isArray(data.products)) {
                    setData(data.products); // Lưu trữ danh sách sản phẩm
                    setPageCount(data.total_pages); // Lưu trữ tổng số trang
                } else {
                    console.error('Products data is not an array:', data.products);
                    setData([]); // Đặt lại dữ liệu về mảng rỗng nếu không đúng
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchData();
    }, [currentPage]); // Chạy lại khi currentPage thay đổi

    const handlePageClick = (event) => {
        const selectedPage = event.selected + 1; // ReactPaginate bắt đầu từ 0, nhưng chúng ta cần bắt đầu từ 1
        setCurrentPage(selectedPage);
    };

    // Hàm xóa sản phẩm
    const handleDeleteProduct = async (productId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this product?");
        if (confirmDelete) {
            try {
                const response = await axios.delete(`http://localhost:3001/api/v1/product/${productId}`);
                setData(data.filter(product => product.id !== productId));
                alert('Product deleted successfully!'); // Thông báo xóa thành công

            } catch (error) {
                console.error('Error deleting product:', error);
                alert('Failed to delete product. Please try again.');
            }
        }
    };

    return (
        <div className="product-container">
            <div className="title-box">
                <h2 className="productTitle">Product</h2>
                <Link className="title-box-link" to="/employee/products/create">Create New Product</Link>
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Variations</th>
                        <th>Price</th>
                        <th>Actions</th> {/* Thêm cột Actions */}
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(data) && data.length > 0 ? (
                        data.map((product) => (
                            <tr className="product-item" key={product.id}>
                                <td>
                                    <Link to={`/employee/update-product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <img className="product-item-image" src={product.image_url.replace(/"/g, '')} alt={product.name} />
                                    </Link>
                                </td>
                                <td>
                                    <Link to={`/employee/update-product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        {product.name}
                                    </Link>
                                </td>
                                <td>
                                    <div className="product-color">
                                        {product.Variations.map((variation, index) => (
                                            <span
                                                key={index}
                                                className={`btn-color-${variation.color.toLowerCase().replace(/ /g, '-')}`}
                                                style={{ display: 'inline-block', width: '20px', height: '20px', marginRight: '5px' }}
                                            ></span>
                                        ))}
                                    </div>
                                </td>
                                <td>
                                    <Link to={`/employee/update-product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        {parseInt(product.price).toLocaleString()}₫
                                    </Link>
                                </td>

                                <td>
                                    <button className="btn btn-danger" onClick={() => handleDeleteProduct(product.id)}>Xóa</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No products available.</td> {/* Thông báo nếu không có sản phẩm */}
                        </tr>
                    )}
                </tbody>
            </table>

            <div className="pagination">
                <ReactPaginate
                    breakLabel="..."
                    nextLabel="Next"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={5}
                    pageCount={pageCount}
                    previousLabel="Previous"
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousClassName="page-item"
                    previousLinkClassName="page-link"
                    nextClassName="page-item"
                    nextLinkClassName="page-link"
                    breakClassName="page-item"
                    breakLinkClassName="page-link"
                    containerClassName="pagination"
                    activeClassName="active"
                />
            </div>
        </div>
    );
}

export default ProductEmployee;