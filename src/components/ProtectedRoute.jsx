import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx'; // ⭐️ Import đúng named export

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth(); 
    const location = useLocation();

    // Hiển thị loading khi đang kiểm tra token ban đầu
    if (loading) {
        return <div style={{padding: '20px', textAlign: 'center'}}>Đang kiểm tra trạng thái đăng nhập...</div>; 
    }

    // Nếu KHÔNG xác thực, chuyển hướng đến trang đăng nhập
    if (!isAuthenticated) {
        // Lưu lại vị trí hiện tại ({ from: location }) để sau khi đăng nhập sẽ quay lại
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Nếu ĐÃ xác thực, cho phép truy cập
    return children;
};

export default ProtectedRoute;