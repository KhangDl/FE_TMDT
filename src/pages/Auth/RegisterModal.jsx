// src/pages/Auth/RegisterModal.jsx (Đã áp dụng CSS hiện đại)

import React, { useState } from 'react';
import api from '../../services/api'; 
import '../../css/AuthModal.css'; // Sử dụng lại CSS Modal đã tối ưu

const RegisterModal = ({ onClose, onShowLogin, setLoading, setMsg, loading, msg }) => {
    // State riêng cho form đăng ký người mua
    const [registerForm, setRegisterForm] = useState({ 
        name: "", email: "", password: "", phone: "", address: "" 
    });

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg("");

        try {
            // Role mặc định khi đăng ký là 'buyer'
            const payload = { ...registerForm, role: 'buyer' };
            // Giả định backend trả về dữ liệu lỗi là { message: "..." }
            const res = await api.post("/auth/register", payload); 
            
            setMsg(`✅ Đăng ký người mua thành công! Vui lòng Đăng nhập.`);

            setTimeout(() => {
                onClose(); // Đóng modal hiện tại
                // Tùy chọn: Mở modal đăng nhập ngay sau khi đăng ký thành công
                // onShowLogin(); 
            }, 1500);
        } catch (err) {
             // Xử lý lỗi trả về từ backend
            const errorMsg = err.response?.data?.message || err.response?.data || "❌ Đăng ký thất bại!";
            setMsg(errorMsg);
        } finally {
            setLoading(false);
        }
    };
    
    const handleFormChange = (e) => {
        setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });
    }
    
    return (
        <div className="modal-backdrop" onClick={onClose}>
            {/* Đổi class từ .modal sang .auth-modal-content */}
            <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
                
                {/* Header & Icon */}
                <div className="modal-header-section">
                    <span className="auth-icon">📝</span>
                    <h3 className="modal-title">Đăng ký tài khoản Người mua</h3>
                    <p className="modal-subtitle">Hoàn thành thông tin để tạo tài khoản mua sắm.</p>
                </div>

                {/* Hiển thị thông báo */}
                {typeof msg === 'string' && msg && 
                    <div className={`auth-alert ${msg.startsWith('✅') ? 'success' : 'error'}`}>{msg}</div>
                }

                {/* Form Đăng ký */}
                <form onSubmit={handleRegister} className="auth-form">
                    
                    {/* Grid cho các trường ngắn */}
                    <div className="form-grid">
                        
                        {/* Tên */}
                        <div className="input-group form-full-width">
                            <label htmlFor="name">Tên của bạn</label>
                            <input
                                id="name"
                                name="name"
                                value={registerForm.name}
                                onChange={handleFormChange}
                                required
                            />
                        </div>

                        {/* Email */}
                        <div className="input-group">
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={registerForm.email}
                                onChange={handleFormChange}
                                placeholder="user@example.com"
                                required
                            />
                        </div>

                        {/* Mật khẩu */}
                        <div className="input-group">
                            <label htmlFor="password">Mật khẩu</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={registerForm.password}
                                onChange={handleFormChange}
                                placeholder="Tối thiểu 6 ký tự"
                                required
                            />
                        </div>
                        
                        {/* Điện thoại */}
                        <div className="input-group form-full-width">
                            <label htmlFor="phone">Số điện thoại</label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={registerForm.phone}
                                onChange={handleFormChange}
                                required
                            />
                        </div>
                    </div>
                    
                    {/* Địa chỉ (Full Width) */}
                    <div className="input-group">
                        <label htmlFor="address">Địa chỉ (Mặc định)</label>
                        <input
                            id="address"
                            name="address"
                            value={registerForm.address}
                            onChange={handleFormChange}
                            required
                        />
                    </div>

                    <button className="btn primary" disabled={loading} style={{ marginTop: '15px' }}>
                        {loading ? "Đang xử lý..." : "Đăng ký Người mua"}
                    </button>
                    
                    {/* Nút Hủy */}
                    <button type="button" className="btn ghost" onClick={onClose} style={{ marginTop: '5px' }}>
                        Hủy
                    </button>

                </form>

                <button className="close-btn" onClick={onClose}>
                    &times;
                </button>
            </div>
        </div>
    );
};

export default RegisterModal;