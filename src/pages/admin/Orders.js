"use client";

import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import "../../style/pages/admin/Order.scss";
import moment from 'moment';
import ReactPaginate from 'react-paginate';

export default function Orders() {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState(''); // State for the status filter
    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/v1/order?page=${currentPage}`);
                setData(response.data.orders);
                setFilteredData(response.data.orders); // Initialize filtered data with all orders
                setPageCount(response.data.total_pages);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [currentPage]);

    const handleUpdate = (order) => {
        window.location.href = `orders/update/${order.id}`;
    };

    const handleDelete = async (order) => {
        try {
            const response = await axios.get(`http://localhost:3001/api/v1/orderItem/order/${order.id}`);
            const orderItems = response.data;

            await Promise.all(orderItems.map(item =>
                axios.delete(`http://localhost:3001/api/v1/orderItem/${item.id}`)
            ));

            await axios.delete(`http://localhost:3001/api/v1/order/${order.id}`);
            alert("Xóa Order thành công");
            const updatedData = data.filter((item) => item.id !== order.id);
            setData(updatedData);
            setFilteredData(updatedData);
            console.log('Order and its items deleted successfully');
        } catch (error) {
            console.error('Failed to delete order and its items:', error);
        }
    };

    const handlePageClick = (event) => {
        const selectedPage = event.selected + 1;
        setCurrentPage(selectedPage);
    };

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = data.filter(order =>
            order.user.name.toLowerCase().includes(query) ||
            order.phone_number.includes(query)
        );
        setFilteredData(filtered);
    };

    const handleStatusChange = (e) => {
        const selectedStatus = e.target.value;
        setStatusFilter(selectedStatus);

        const filtered = data.filter(order =>
            selectedStatus === '' || order.status === selectedStatus
        );
        setFilteredData(filtered);
    };
    const truncateAddress = (address) => {
        const words = address.split(' ');
        return words.length > 5 ? words.slice(0, 5).join(' ') + '...' : address;
    };

    return (
        <div className="order-container">
            <h2 className="orderTitle">Order</h2>
            <Link to="/dashboard/orders/create">
                <button className="btn-create">Create new order</button>
            </Link>

            {/* Search Input */}
            <input
                type="text"
                placeholder="Search by name or phone number"
                value={searchQuery}
                onChange={handleSearch}
                className="search-input"
            />

            {/* Status Filter Dropdown */}
            <div className="borderFilterMobile option browse-tags">
                <label className="lb-filter" htmlFor="status-filter">Filter by status:</label>
                <span className="custom-dropdown custom-dropdown--grey">
                    <select
                        className="status-filter custom-dropdown__select"
                        id="status-filter"
                        value={statusFilter}
                        onChange={handleStatusChange}
                    >
                        <option value="">All Status</option>
                        <option value="pending">pending</option>
                        <option value="completed">completed</option>
                        <option value="cancelled">cancelled</option>
                        <option value="shipping">shipping</option>
                    </select>
                </span>
            </div>

            <table className="table">
                <thead>
                    <tr>
                        <th>Shipping Address</th>
                        <th>Name</th>
                        <th>Phone Number</th>
                        <th>Created At</th>
                        <th>Payment Method</th>
                        <th>Order Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((order) => (
                        <tr className="order-item" key={order.id}>
                            <td className="order-item-address">{truncateAddress(order.shipping_address)}</td>                            <td>{order.user.name}</td>
                            <td>{order.phone_number}</td>
                            <td>{moment(order.created_at).format('YYYY-MM-DD HH:mm')}</td>
                            <td>{order.payment_method}</td>
                            <td >
                                <div className={`booking-status-${order.status}`}>
                                    {order.status === "pending" && "pending"}
                                    {order.status === "completed" && "completed"}
                                    {order.status === "cancelled" && "cancelled"}
                                    {order.status === "shipping" && "shipping"}
                                </div>
                            </td>
                            <td>
                                <button className="delete" onClick={() => handleDelete(order)}>
                                    Delete
                                </button>
                                <button className="update" onClick={() => handleUpdate(order)}>
                                    Update
                                </button>
                            </td>
                        </tr>
                    ))}
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
