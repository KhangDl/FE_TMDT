// src/components/AuthSection.jsx (Đã thêm lại logic Đăng ký)

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext.jsx";
import useCart from '../hooks/useCart.jsx';
import '../css/HeaderAuthLayout.css'; 
// Thêm 2 props mới cho Đăng ký
const AuthSection = ({ onShowLogin, onshowProfile, onShowRegister, onShowCreateShop }) => {
    const { isAuthenticated, userName, logout, userRole } = useAuth();
    const { cart } = useCart();
    const navigate = useNavigate();
    
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const iconRef = useRef(null);

    // Xử lý đóng menu khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target) && 
                iconRef.current && !iconRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    const handleProfileClick = () => {
        // Tùy thuộc vào trạng thái đăng nhập sẽ quyết định hành vi
        setIsMenuOpen(prev => !prev); // Luôn mở/đóng menu (cả khi chưa đăng nhập)
    };

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
        navigate("/"); 
    }
    
    const handleViewProfile = () => {
        onshowProfile(); 
        setIsMenuOpen(false);
    }
    
    const handleRegister = (registerType) => {
        if (registerType === 'buyer' && onShowRegister) {
            onShowRegister();
        } else if (registerType === 'seller' && onShowCreateShop) {
            onShowCreateShop();
        }
        setIsMenuOpen(false);
    }

    return (
        <nav className="header-auth-section">
            
            <div 
                className={`auth-user-icon ${isAuthenticated ? 'logged-in' : 'not-logged-in'}`}
                onClick={handleProfileClick}
                ref={iconRef}
            ><p className='btn_Catogori'>🔑 Chìa khóa</p>
                <i className="fas fa-user"></i>
                
                <div className="auth-dropdown-menu dropdown-account" ref={menuRef} 
                     style={{ visibility: isMenuOpen ? 'visible' : 'hidden', opacity: isMenuOpen ? 1 : 0, transform: isMenuOpen ? 'translateY(0)' : 'translateY(-10px)' }}>
                    
                    {isAuthenticated ? (
                        <>
                            <div className="menu-header">
                                <p>Xin chào, <strong>{userName ? userName.split(' ')[0] : 'Khách'}</strong></p>
                                <span className="user-role-tag">{userRole === 'seller' ? 'Người bán' : 'Người mua'}</span>
                            </div>
                            
                            <button onClick={handleViewProfile} className="menu-item">
                                👤 Hồ sơ cá nhân
                            </button>
                            
                            {userRole === 'seller' && (
                                <button onClick={() => { navigate("/seller/dashboard"); setIsMenuOpen(false); }} className="menu-item primary">
                                    🏠 Quản lý cửa hàng
                                </button>
                            )}

                            <button onClick={handleLogout} className="menu-item logout">
                                ➡️ Đăng xuất
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="menu-header guest-header">
                                <p>Bạn chưa đăng nhập</p>
                            </div>
                            
                            <button onClick={onShowLogin} className="menu-item login-option">
                                🔐 Đăng nhập
                            </button>
                            
                            <button onClick={() => handleRegister('buyer')} className="menu-item">
                                📝 Đăng ký tài khoản (Người mua)
                            </button>
                            
                            <button onClick={() => handleRegister('seller')} className="menu-item seller-option">
                                🏪 Tạo cửa hàng (Đăng ký Người bán)
                            </button>
                        </>
                    )}
                </div>
            </div>
            <button
                className="auth-cart-box"
                onClick={() => navigate('/checkout')}
            >
                <i className="fas fa-shopping-bag"></i>
                
                <span className="cart-text">🛒 Giỏ hàng </span>
                
                {cart.length > 0 && (
                    <span className="cart-count">{cart.length}</span>
                )}
            </button>

        </nav>
    );
};

export default AuthSection;