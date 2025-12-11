// src/pages/Profile/BuyerProfile.jsx (Sử dụng Mock Data)

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; 
// Import component hiển thị danh sách đơn hàng
import OrderHistoryList from '../Buyer/OrderHistoryList';

// DỮ LIỆU GIẢ (MOCK DATA) CHO LỊCH SỬ ĐƠN HÀNG
const MOCK_ORDERS = [
    { 
        id: "ORD001", 
        orderDate: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 ngày trước
        totalAmount: 550000, 
        status: "Đã giao hàng", 
        items: [
            { name: "Áo sơ mi Caro Nam", quantity: 1, price: 350000 },
            { name: "Túi đựng Laptop", quantity: 1, price: 200000 },
        ] 
    },
    { 
        id: "ORD002", 
        orderDate: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 ngày trước
        totalAmount: 150000, 
        status: "Đang giao hàng", 
        items: [
            { name: "Tai nghe Bluetooth E5", quantity: 3, price: 50000 },
        ] 
    },
    { 
        id: "ORD003", 
        orderDate: new Date().toISOString(), // Hôm nay
        totalAmount: 1200000, 
        status: "Đang xử lý", 
        items: [
            { name: "Laptop Gaming T5 (Phiên bản giới hạn)", quantity: 1, price: 12000000 },
        ] 
    },
];

export default function BuyerProfile({ userData: propUserData }) {
    const navigate = useNavigate();
    const { userData: authUserData, logout } = useAuth(); 
    
    // Chọn dữ liệu người dùng từ prop hoặc AuthContext
    const userData = propUserData || authUserData; 

    // Sử dụng mock data thay vì state và useEffect để fetch
    const orders = MOCK_ORDERS;
    const loading = false; // Luôn false vì dùng mock data
    const error = null;    // Luôn null

    // Xử lý Đăng xuất
    const handleLogout = () => {
        logout(); // Gọi hàm logout từ AuthContext
        navigate("/"); // Chuyển hướng về trang chủ sau khi đăng xuất
    };
    const handleHome = () => {
        navigate("/");
    };

    return (
        <div className="profile-container buyer-profile">
            <button type='button' onClick={handleHome} className='btn-base btn-gray back-to-home-btn'>
                Trang chủ
            </button>
            <h2 className="profile-header">👤 Hồ sơ Cá nhân</h2>
            
            {/* THÔNG TIN CƠ BẢN VÀ ĐỊA CHỈ */}
            <div className="profile-info-grid">
                <div className="info-box">
                    <h3>Thông tin cơ bản</h3>
                    <p><strong>Tên người dùng:</strong> {userData?.username || 'Đang cập nhật'}</p>
                    <p><strong>Email:</strong> {userData?.email || 'N/A'}</p>
                    <p><strong>Điện thoại:</strong> {userData?.phone || 'Chưa thiết lập'}</p>
                </div>

                <div className="info-box">
                    <h3>Địa chỉ Giao hàng Mặc định</h3>
                    <p>{userData?.address || 'Vui lòng thêm địa chỉ giao hàng'}</p>
                    <button className="btn small primary">Cập nhật Địa chỉ</button>
                </div>
            </div>
            
            {/* LỊCH SỬ ĐƠN HÀNG */}
            <h2 className="section-title">📦 Lịch sử Đơn hàng</h2>
            
            {loading && <p className="loading-text">Đang tải lịch sử đơn hàng...</p>}
            {error && <p className="error-text">{error}</p>}
            
            {!loading && !error && (
                <div className="order-history-list">
                    {/* ⭐️ Truyền mock data vào component */}
                    <OrderHistoryList orders={orders} />
                </div>
            )}
            
            {/* NÚT ĐĂNG XUẤT */}
            <button className="btn secondary logout-btn" onClick={handleLogout}>
                Đăng Xuất
            </button>
            
        </div>
    );
}