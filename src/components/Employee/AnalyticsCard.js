import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { icons } from "../../app/data/icon";
import "../../style/components/admin/AnalyticsCard.scss";
import AnalyticsWidgetSummary from "./AnalyticsWidgetSummary"
const AnalyticsCardEmployee = () => {
    const [totalUsers, setTotalUsers] = useState(0);
    const [percentIncrease, setPercentIncrease] = useState(0);
    const [userData, setUserData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/v1/user'); // Đường dẫn API bạn đang sử dụng
                const data = response.data.users;

                // Lấy tháng hiện tại và tháng trước
                const currentMonth = new Date().getMonth();
                const previousMonth = currentMonth - 1;

                // Tính tổng người dùng trong tháng hiện tại và tháng trước với role là 'user'
                const usersInCurrentMonth = data.filter(user => {
                    const startDay = new Date(user.createdAt);
                    return startDay.getMonth() === currentMonth && user.role === 'user'; // Lọc theo role
                });

                const usersInPreviousMonth = data.filter(user => {
                    const startDay = new Date(user.createdAt);
                    return startDay.getMonth() === previousMonth && user.role === 'user'; // Lọc theo role
                });

                const totalUsersInCurrentMonth = usersInCurrentMonth.length;
                const totalUsersInPreviousMonth = usersInPreviousMonth.length;

                // Tính phần trăm tăng trưởng
                let percentIncrease = 0;
                if (totalUsersInPreviousMonth !== 0) {
                    percentIncrease = ((totalUsersInCurrentMonth - totalUsersInPreviousMonth) / totalUsersInPreviousMonth) * 100;
                } else if (totalUsersInCurrentMonth !== 0) {
                    percentIncrease = 100;
                }

                setTotalUsers(totalUsersInCurrentMonth);
                setPercentIncrease(percentIncrease);

                // Giả sử bạn cũng muốn lấy dữ liệu cho biểu đồ hàng tuần
                const weeklyData = Array(8).fill(0); // Dữ liệu giả định cho 8 tuần
                // Thay thế bằng logic thực tế để lấy dữ liệu hàng tuần nếu có

                setUserData(weeklyData);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="grid-cart-continer" container spacing={3}>
            <div className="grid-cart-box" style={{ marginBottom: '20px' }}>
                <div className="cart-box-data">
                    <span className="grid-cart-box-icon">{icons.users}</span>
                    <div className="box-item-data">
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

                <p className="grid-cart-box-title">New users </p>
                <h3>{totalUsers}</h3>
                <div className="grid-cart-box-analytic">
                    <AnalyticsWidgetSummary
                        title="Weekly sales"
                        percent={2.6}
                        total={714000}
                        icon={<img alt="icon" src="/assets/icons/glass/ic-glass-bag.svg" />}
                        chart={{
                            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                            series: [22, 8, 35, 50, 82, 84, 77, 12],
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default AnalyticsCardEmployee;