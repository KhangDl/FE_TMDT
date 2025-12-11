// src/pages/Auth/Login.jsx

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext.jsx"; 
import api from '../../services/api'; 
// Import CSS mới (hoặc sử dụng CSS chung đã được cập nhật)
import '../../css/AuthModal.css'; 

const LoginModal = ({ onClose, setLoading, setMsg, loading }) => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    
    // Lấy đường dẫn cần quay lại (mặc định là trang chủ)
    const from = location.state?.from?.pathname || "/"; 
    
    const [loginForm, setLoginForm] = useState({ email: "", password: "" });

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg("");

        try {
            const res = await api.post("/auth/login", loginForm);
            const { token, role, name, userId } = res.data; // Thêm userId nếu cần
            
            // ⭐️ Cập nhật Context state 
            login(token, role, name, userId); 
            setMsg("✅ Đăng nhập thành công!");

            // Chuyển hướng và đóng modal
            setTimeout(() => {
                if (role === "admin") navigate("/admin/dashboard");
                else if (role === "seller") navigate("/seller/dashboard");
                else {
                    navigate(from, { replace: true }); 
                }
                onClose(); 
            }, 800);
        } catch (err) {
            setMsg(err.response?.data?.message || "❌ Đăng nhập thất bại!");
        } finally {
            setLoading(false);
        }
    };

    const handleFormChange = (e) => {
        setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
    }
    
    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
                
                {/* Header & Logo/Icon */}
                <div className="modal-header-section">
                    <span className="auth-icon">🔐</span>
                    <h3 className="modal-title">Chào mừng trở lại!</h3>
                    <p className="modal-subtitle">Đăng nhập để tiếp tục mua sắm.</p>
                </div>

                {/* Hiển thị thông báo */}
                {/* Giả định setMsg sẽ truyền về object { message: "...", type: "success/error" } */}
                {typeof msg === 'string' && msg && 
                    <div className={`auth-alert ${msg.startsWith('✅') ? 'success' : 'error'}`}>{msg}</div>
                }

                {/* Form Đăng nhập */}
                <form onSubmit={handleLogin} className="auth-form">
                    
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={loginForm.email}
                            onChange={handleFormChange}
                            placeholder="user@gmail.com"
                            required
                        />
                    </div>
                    
                    <div className="input-group">
                        <label htmlFor="password">Mật khẩu</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={loginForm.password}
                            onChange={handleFormChange}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button 
                        className=" btn primary full-width login-btn" 
                        disabled={loading}
                    >
                        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                    </button>
                    
                    <div className="modal-footer-links">
                         <a href="#" className="forgot-password-link">Quên mật khẩu?</a>
                         <button type="button" className="btn secondary link" onClick={onClose}>
                             Chưa có tài khoản? Đăng ký ngay
                         </button>
                    </div>

                </form>
                
                <button className="close-btn" onClick={onClose}>
                    &times;
                </button>
            </div>
        </div>
    );
};

export default LoginModal;