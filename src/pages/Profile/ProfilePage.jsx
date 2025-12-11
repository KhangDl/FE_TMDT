import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BuyerProfile from './BuyerProfile'; 
import SellerDashboard from '../Seller/SellerDashboard'; 
import '../../css/Profile.css';

// API Client (Giả định Auth API)
const privateApi = axios.create({
    baseURL: 'http://localhost:5146/api',
    // ... Thêm logic Interceptor để gắn token
});

export default function ProfilePage() {
    const { isAuthenticated, userRole, userData } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/'); 
            return;
        }
        setLoading(false);
    }, [isAuthenticated, navigate]);

    if (loading) {
        return <div className="loading-state">Đang tải hồ sơ...</div>;
    }
    if (userRole === 'seller') {
        return <SellerDashboard privateApi={privateApi} userData={userData} />;
    } else if (userRole === 'buyer') {
        return <BuyerProfile privateApi={privateApi} userData={userData} />;
    } else {
        return (
            <div className="profile-error">
                Không thể xác định vai trò người dùng.
            </div>
        );
    }
}