import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { icons } from "../../app/data/icon";
import "../../style/components/admin/OrderAnalyticsCard.scss";
import AnalyticsWidgetSummary from "./AnalyticsWidgetSummary";

const OrderAnalyticsCardEmployee = () => {
    const [totalOrders, setTotalOrders] = useState(0);
    const [percentIncrease, setPercentIncrease] = useState(0);
    const [orderData, setOrderData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/v1/order'); // Đường dẫn API cho đơn hàng
                const data = response.data.orders;

                // Lấy tháng hiện tại và tháng trước
                const currentMonth = new Date().getMonth();
                const previousMonth = currentMonth - 1;

                // Tính tổng đơn hàng trong tháng hiện tại và tháng trước
                const ordersInCurrentMonth = data.filter(order => {
                    const startDay = new Date(order.updated_at);
                    return startDay.getMonth() === currentMonth; // Lọc theo tháng hiện tại
                });

                const ordersInPreviousMonth = data.filter(order => {
                    const startDay = new Date(order.updated_at);
                    return startDay.getMonth() === previousMonth; // Lọc theo tháng trước
                });

                const totalOrdersInCurrentMonth = ordersInCurrentMonth.length;
                const totalOrdersInPreviousMonth = ordersInPreviousMonth.length;

                // Tính phần trăm tăng trưởng
                let percentIncrease = 0;
                if (totalOrdersInPreviousMonth !== 0) {
                    percentIncrease = ((totalOrdersInCurrentMonth - totalOrdersInPreviousMonth) / totalOrdersInPreviousMonth) * 100;
                } else if (totalOrdersInCurrentMonth !== 0) {
                    percentIncrease = 100;
                }

                setTotalOrders(totalOrdersInCurrentMonth);
                setPercentIncrease(percentIncrease);

                // Giả sử bạn cũng muốn lấy dữ liệu cho biểu đồ hàng tuần
                const weeklyData = Array(8).fill(0); // Dữ liệu giả định cho 8 tuần
                // Thay thế bằng logic thực tế để lấy dữ liệu hàng tuần nếu có

                setOrderData(weeklyData);
            } catch (error) {
                console.error("Error fetching order data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="grid-cart-order-container" container spacing={3}>
            <div className="grid-cart-order-box" style={{ marginBottom: '20px' }}>
                <div className="cart-box-data-order">
                    <span className="grid-cart-box-icon-order">{icons.shoppingCart}</span> {/* Thay đổi biểu tượng nếu cần */}
                    <div className="box-item-data-order">
                        <span className={percentIncrease >= 0 ? "positive" : "negative"}>
                            {isFinite(percentIncrease) ? (
                                <>
                                    {percentIncrease > 0 ? (
                                        <>
                                            {icons.increase} + {Math.round(percentIncrease)}%
                                        </>
                                    ) : (
                                        <>
                                            {icons.decrease} - {Math.round(Math.abs(percentIncrease))}%
                                        </>
                                    )}
                                </>
                            ) : 'N/A'}
                        </span>
                        {percentIncrease >= 0 ? " more" : " less"}
                    </div>
                </div>

                <p className="grid-cart-box-title-order">New Orders</p>
                <h3>{totalOrders}</h3>
                <div className="grid-cart-box-analytic-order">
                    <AnalyticsWidgetSummary
                        title="Weekly Orders"
                        percent={2.6} // Bạn có thể tính giá trị này tương tự
                        total={714000} // Thay đổi giá trị tổng số nếu cần
                        color="secondary"
                        icon={<img alt="icon" src="/assets/icons/order/ic-order.svg" />} // Thay đổi biểu tượng
                        chart={{
                            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                            series: [56, 47, 40, 62, 73, 30, 23, 54],
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default OrderAnalyticsCardEmployee;