// IpnPage.js
import React from 'react';

const IpnPage = () => {
    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Thông báo thanh toán</h1>
            <p>Đang xử lý thông báo từ cổng thanh toán...</p>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f9f9f9',
        textAlign: 'center',
    },
    title: {
        color: '#007BFF',
    },
};

export default IpnPage;