import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { icons } from "../../app/data/icon";
import "../../style/components/admin/RevenueAnalyticsCard.scss";
import AnalyticsWidgetSummary from "./AnalyticsWidgetSummary";

const RevenueAnalyticsCard = () => {
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [percentIncrease, setPercentIncrease] = useState(0);
    const [revenueData, setRevenueData] = useState([]);
    const formatPrice = (price) => {
        const amount = parseFloat(price);
        return amount.toLocaleString('en-US', { style: 'currency', currency: 'VND' }).replace('₫', '').trim() + ' VND';
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/v1/order'); // Gọi API đơn hàng
                const data = response.data.orders; // Lấy dữ liệu từ response.data

                // Lấy tháng hiện tại và tháng trước
                const currentMonth = new Date().getMonth();
                const previousMonth = currentMonth - 1;

                // Tính tổng doanh thu trong tháng hiện tại và tháng trước
                const revenueInCurrentMonth = data.filter(order => {
                    const startDay = new Date(order.created_at);
                    return startDay.getMonth() === currentMonth; // Lọc theo tháng hiện tại
                });

                const revenueInPreviousMonth = data.filter(order => {
                    const startDay = new Date(order.created_at);
                    return startDay.getMonth() === previousMonth; // Lọc theo tháng trước
                });

                const totalRevenueInCurrentMonth = revenueInCurrentMonth.reduce((total, order) => total + parseFloat(order.total_amount), 0);
                const totalRevenueInPreviousMonth = revenueInPreviousMonth.reduce((total, order) => total + parseFloat(order.total_amount), 0);

                // Tính phần trăm tăng trưởng
                let percentIncrease = 0;
                if (totalRevenueInPreviousMonth !== 0) {
                    percentIncrease = ((totalRevenueInCurrentMonth - totalRevenueInPreviousMonth) / totalRevenueInPreviousMonth) * 100;
                } else if (totalRevenueInCurrentMonth !== 0) {
                    percentIncrease = 100;
                }

                setTotalRevenue(totalRevenueInCurrentMonth);
                setPercentIncrease(percentIncrease);

                // Giả sử bạn cũng muốn lấy dữ liệu cho biểu đồ hàng tuần
                const weeklyData = Array(8).fill(0); // Dữ liệu giả định cho 8 tuần
                // Thay thế bằng logic thực tế để lấy dữ liệu hàng tuần nếu có

                setRevenueData(weeklyData);
            } catch (error) {
                console.error("Error fetching revenue data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="grid-cart-revenue-container" container spacing={3}>
            <div className="grid-cart-revenue-box" style={{ marginBottom: '20px' }}>
                <div className="cart-box-data-revenue">
                    <span className="grid-cart-box-icon-revenue">{icons.money}</span>
                    <div className="box-item-data-revenue">
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

                <p className="grid-cart-box-title-revenue">Total Revenue</p>
                <h3>{formatPrice(totalRevenue.toFixed(2))}</h3> {/* Hiển thị tổng doanh thu */}
                <div className="grid-cart-box-analytic-revenue">
                    <AnalyticsWidgetSummary
                        title="Weekly Revenue"
                        percent={2.6}
                        total={714000}
                        color="brownGold"
                        icon={<img alt="icon" src="/assets/icons/revenue/ic-revenue.svg" />}
                        chart={{
                            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                            series: [40, 70, 50, 28, 70, 75, 7, 64],
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default RevenueAnalyticsCard;