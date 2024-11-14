"use client";
import "../../style/components/admin/Transactions.scss";
import axios from 'axios';
import { useEffect, useState } from 'react';
import moment from 'moment';

function TransactionsEmployee() {
    const [data, setData] = useState([]);

    const formatPrice = (price) => {
        const amount = parseFloat(price);
        return amount.toLocaleString('en-US', { style: 'currency', currency: 'VND' }).replace('₫', '').trim() + ' VND';
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/v1/order`);
                const sortedData = response.data.orders.sort((a, b) => {
                    // Sort tours based on their id in descending order (newest first)
                    return b.id - a.id;
                });
                setData(sortedData);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="tran-container">
            <h2 className="tran-title">Latest Transactions</h2>
            <table className="table">
                <thead>
                    <tr>
                        <td> Name </td>
                        <td> Status </td>
                        <td> Date </td>
                        <td> Amount </td>
                    </tr>
                </thead>
                <tbody>
                    {data.slice(0, 4).map((booking, index) => (
                        <tr className="order-item" key={index}>
                            <td>
                                <div className="tran-user">
                                    <img className="userImg" src="https://res.cloudinary.com/dhjrrk4pg/image/upload/v1715060332/user_1177568_mxilzq.png" alt="" width={40} height={40} />
                                    {booking.user.name}
                                </div>
                            </td>
                            <td>
                                <div className={`booking-status-${booking.status ? booking.status.toLowerCase() : ''}`}>
                                    {booking.status}
                                </div>
                            </td>
                            <td>{moment(booking.start_day).format('YYYY-MM-DD')}</td>
                            <td><em>{formatPrice(booking.total_amount)}</em></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
export default TransactionsEmployee
