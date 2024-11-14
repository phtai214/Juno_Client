import React from 'react';
import "../../style/pages/admin/Dashboard.scss"
import AnalyticsCardEmployee from "../../components/Employee/AnalyticsCard";
import OrderAnalyticsCardEmployee from "../../components/Employee/OrderAnalyticsCard";
import RevenueAnalyticsCardEmployee from '../../components/Employee/RevenueAnalyticsCard';
import ReviewAnalyticsCardEmployee from "../../components/Employee/ReviewAnalyticsCard"
import "../../style/components/admin/AnalyticsCard.scss";
import Chart from "../../components/Admin/Chart";
import TransactionsEmployee from "../../components/Employee/transactions"
const DashboardEmployee = () => {
    return (
        <div className="dashboard-container">
            <h3 className="dashboard-title">Hi, Welcome back</h3>
            <div className="dashboard-content">
                <div className="dashboard-item">
                    <AnalyticsCardEmployee />
                    <OrderAnalyticsCardEmployee />
                    <RevenueAnalyticsCardEmployee />
                    <ReviewAnalyticsCardEmployee />
                </div>
                <TransactionsEmployee />
                <Chart />
            </div>
        </div>
    );
};

export default DashboardEmployee;
