import "../../style/components/admin/Chart.scss";
import { useState, useEffect } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Chart() {
    const [filteredData, setFilteredData] = useState([]);
    const [filterDuration, setFilterDuration] = useState('6m');

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get(`http://localhost:3001/api/v1/order`);
                const groupedData = groupDataByDate(response.data.orders);
                setFilteredData(getFilteredData(groupedData, filterDuration));
            } catch (error) {
                console.error('Error fetching chart data:', error);
            }
        }
        fetchData();
    }, [filterDuration]);

    const formatPrice = (price) => {
        const amount = parseFloat(price);
        return `${amount.toLocaleString('vi-VN')} VND`; // Chỉ định dạng mà không nhân với 1000
    };

    function groupDataByDate(data) {
        const groupedData = {};

        data.forEach(item => {
            const createDate = new Date(item.created_at);
            const dateStr = createDate.toISOString().split('T')[0];

            if (!groupedData[dateStr]) {
                groupedData[dateStr] = { date: dateStr, revenue: 0, order: 0 };
            }
            groupedData[dateStr].revenue += parseFloat(item.total_amount); // Tính doanh thu
            groupedData[dateStr].order += 1; // Tăng số lượng đơn hàng
        });

        return Object.values(groupedData);
    }

    function getFilteredData(data, duration) {
        const today = new Date();
        const durationMap = {
            '3m': 3 * 30,
            '6m': 6 * 30,
            '1y': 12 * 30,
        };
        const days = durationMap[duration] || durationMap['3m'];
        const startDate = new Date(today.getTime() - days * 24 * 60 * 60 * 1000);

        return data.filter(item => {
            return new Date(item.date) >= startDate && new Date(item.date) <= today;
        });
    }

    return (
        <div className="chart-container">
            <h2 className="chart-title">Daily Recap</h2>
            <ResponsiveContainer width="100%" height="90%">
                <LineChart
                    width={700}
                    height={500}
                    data={filteredData}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />

                    <Tooltip
                        formatter={(value, name) => {
                            if (name === 'revenue') {
                                return [formatPrice(value), name];
                            }
                            return [value, name]; // Trả về số lượng đơn hàng mà không định dạng
                        }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="order" stroke="#82ca9d" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}