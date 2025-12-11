// src/components/OrderHistoryList.jsx (Giữ nguyên)

import React from 'react';

const OrderItem = ({ order }) => {
    // Giả định cấu trúc đối tượng order: { id, orderDate, totalAmount, status, items: [...] }
    const statusClass = order.status.toLowerCase().replace(/\s/g, '-');
    
    return (
        <div className={`order-item-card ${statusClass}`}>
            <div className="order-header-info">
                <p><strong>Mã Đơn hàng:</strong> #{order.id}</p>
                {/* Hiển thị ngày tháng thân thiện hơn */}
                <p><strong>Ngày đặt:</strong> {new Date(order.orderDate).toLocaleDateString()} {new Date(order.orderDate).toLocaleTimeString()}</p> 
                <p className={`order-status status-${statusClass}`}>
                    Trạng thái: <strong>{order.status}</strong>
                </p>
            </div>
            
            <div className="order-summary">
                {order.items && order.items.slice(0, 2).map((item, index) => (
                    <p key={index} className="item-line">
                        {item.name} x {item.quantity}
                    </p>
                ))}
                {order.items && order.items.length > 2 && (
                    <p className="more-items-hint">
                        Và {order.items.length - 2} sản phẩm khác...
                    </p>
                )}
            </div>

            <div className="order-footer-info">
                <p><strong>Tổng cộng:</strong> {order.totalAmount.toLocaleString()} ₫</p>
                <button className="btn small tertiary">Xem Chi tiết</button>
            </div>
        </div>
    );
};


export default function OrderHistoryList({ orders }) {
    if (!orders || orders.length === 0) {
        return (
            <div className="no-orders-message">
                <p>Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm ngay!</p>
            </div>
        );
    }

    return (
        <div className="order-list-grid">
            {orders.map(order => (
                <OrderItem key={order.id} order={order} />
            ))}
        </div>
    );
}