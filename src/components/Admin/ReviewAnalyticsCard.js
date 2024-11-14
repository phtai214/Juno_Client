import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { icons } from "../../app/data/icon";
import "../../style/components/admin/ReviewAnalyticsCard.scss";
import AnalyticsWidgetSummary from "./AnalyticsWidgetSummary";

const ReviewAnalyticsCard = () => {
    const [totalReviews, setTotalReviews] = useState(0);
    const [percentIncrease, setPercentIncrease] = useState(0);
    const [reviewData, setReviewData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/v1/review'); // Đường dẫn API cho đánh giá
                const data = response.data;

                // Lấy tháng hiện tại và tháng trước
                const currentMonth = new Date().getMonth();
                const previousMonth = currentMonth - 1;

                // Tính tổng đánh giá trong tháng hiện tại và tháng trước
                const reviewsInCurrentMonth = data.filter(review => {
                    const startDay = new Date(review.created_at);
                    return startDay.getMonth() === currentMonth; // Lọc theo tháng hiện tại
                });

                const reviewsInPreviousMonth = data.filter(review => {
                    const startDay = new Date(review.created_at);
                    return startDay.getMonth() === previousMonth; // Lọc theo tháng trước
                });

                const totalReviewsInCurrentMonth = reviewsInCurrentMonth.length;
                const totalReviewsInPreviousMonth = reviewsInPreviousMonth.length;

                // Tính phần trăm tăng trưởng
                let percentIncrease = 0;
                if (totalReviewsInPreviousMonth !== 0) {
                    percentIncrease = ((totalReviewsInCurrentMonth - totalReviewsInPreviousMonth) / totalReviewsInPreviousMonth) * 100;
                } else if (totalReviewsInCurrentMonth !== 0) {
                    percentIncrease = 100;
                }

                setTotalReviews(totalReviewsInCurrentMonth);
                setPercentIncrease(percentIncrease);

                // Giả sử bạn cũng muốn lấy dữ liệu cho biểu đồ hàng tuần
                const weeklyData = Array(8).fill(0); // Dữ liệu giả định cho 8 tuần
                // Thay thế bằng logic thực tế để lấy dữ liệu hàng tuần nếu có

                setReviewData(weeklyData);
            } catch (error) {
                console.error("Error fetching review data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="grid-cart-review-container" container spacing={3}>
            <div className="grid-cart-review-box" style={{ marginBottom: '20px' }}>
                <div className="cart-box-data-review">
                    <span className="grid-cart-box-icon-review">{icons.star}</span> {/* Biểu tượng cho đánh giá */}
                    <div className="box-item-data-review">
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

                <p className="grid-cart-box-title-review">New Reviews</p>
                <h3>{totalReviews}</h3>
                <div className="grid-cart-box-analytic-review">
                    <AnalyticsWidgetSummary
                        title="Weekly Reviews"
                        percent={2.6} // Bạn có thể tính giá trị này tương tự
                        total={714000} // Thay đổi giá trị tổng số nếu cần
                        color="reviewColor"
                        icon={<img alt="icon" src="/assets/icons/review/ic-review.svg" />} // Thay đổi biểu tượng
                        chart={{
                            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                            series: [56, 30, 23, 54, 47, 40, 62, 73], // Dữ liệu giả định cho biểu đồ
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default ReviewAnalyticsCard;