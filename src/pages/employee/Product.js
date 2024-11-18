import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";
import "../../style/pages/admin/product.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";

function ProductEmployee() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const itemsPerPage = 10; // Số sản phẩm mỗi trang
  const location = useLocation();
  const searchQuery = location.state?.searchQuery || ""; // Lấy searchQuery từ state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/v1/product/products?page=${currentPage}&limit=${itemsPerPage}`
        );
        const data = response.data;

        if (Array.isArray(data.products)) {
          setData(data.products); // Lưu trữ danh sách sản phẩm
          setPageCount(data.total_pages); // Lưu trữ tổng số trang
        } else {
          console.error("Products data is not an array:", data.products);
          setData([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchData();
  }, [currentPage]); // Chạy lại khi currentPage thay đổi

  // Lọc sản phẩm theo searchQuery
  const filteredData = searchQuery
    ? data.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : data;

  const handlePageClick = (event) => {
    const selectedPage = event.selected + 1; // ReactPaginate bắt đầu từ 0
    setCurrentPage(selectedPage);
  };

  const handleUpdate = (product) => {
    navigate(`/employee/update-product/${product.id}`);
  };
  return (
    <div className="product-container">
      <div className="title-box">
        <h2 className="productTitle">Product</h2>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Variations</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((product) => (
              <tr className="product-item" key={product.id}>
                <td>
                  <img
                    className="product-item-image"
                    src={product.image_url.replace(/"/g, "")}
                    alt={product.name}
                  />
                </td>
                <td>{product.name}</td>
                <td>
                  <div className="product-color">
                    {product.Variations.map((variation, index) => (
                      <span
                        key={index}
                        className={`btn-color-${variation.color
                          .toLowerCase()
                          .replace(/ /g, "-")}`}
                        style={{
                          display: "inline-block",
                          width: "20px",
                          height: "20px",
                          marginRight: "5px",
                        }}
                      ></span>
                    ))}
                  </div>
                </td>
                <td>{parseInt(product.price).toLocaleString()}₫</td>
                <td>
                  <td>
                    <button
                      className="btn btn-primary"
                      style={{
                        margin: "0 5px",
                        backgroundColor: "#007bff",
                        color: "white",
                      }}
                      onClick={() => handleUpdate(product.id)}
                    >
                      Update
                    </button>
                  </td>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No products available.</td>
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
