import React from 'react';

const RedirectPage = () => {
    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Thanh toán thành công!</h1>
            <p>Cảm ơn bạn đã thanh toán. Đơn hàng của bạn đang được xử lý.</p>
            <a href="/" style={styles.link}>Quay lại trang chủ</a>
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
        color: '#4CAF50',
    },
    link: {
        textDecoration: 'none',
        color: '#007BFF',
    },
};

export default RedirectPage;