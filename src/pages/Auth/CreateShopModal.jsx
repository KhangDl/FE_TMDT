// src/pages/Auth/CreateShopModal.jsx (Đã áp dụng CSS hiện đại)

import React, { useState } from 'react';
import api from '../../services/api'; 
import '../../css/AuthModal.css'; 

const CreateShopModal = ({ onClose, setLoading, setMsg, loading, msg }) => {
    const [sellerForm, setSellerForm] = useState({ 
        name: "", email: "", password: "", phone: "", address: "", 
        area: "", shopName: "", shopDescription: "", logo: "" 
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSellerForm(prevForm => ({
            ...prevForm,
            [name]: value
        }));
    };
    
    const handleLogoChange = (e) => {
        setSellerForm(prevForm => ({ ...prevForm, logo: e.target.value }));
    }

    const handleCreateShop = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg("");
        
        try {
            const payload = { ...sellerForm, role: 'seller' };
            // endpoint đăng ký người bán/tạo shop
            const res = await api.post("/shop/create", payload); 
            
            setMsg(`✅ Tạo cửa hàng "${sellerForm.shopName}" thành công! Vui lòng Đăng nhập.`);

            setTimeout(() => {
                onClose(); 
            }, 1500);
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.response?.data || "❌ Tạo cửa hàng thất bại!";
            setMsg(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            {/* Đổi class từ .modal sang .auth-modal-content và tăng max-width */}
            <div className="auth-modal-content" onClick={(e) => e.stopPropagation()} style={{maxWidth: '850px'}}> 
                
                {/* Header & Icon */}
                <div className="modal-header-section">
                    <span className="auth-icon">🏪</span>
                    <h3 className="modal-title">Tạo cửa hàng & Đăng ký Người bán</h3>
                    <p className="modal-subtitle">Hoàn thành các thông tin dưới đây để bắt đầu kinh doanh.</p>
                </div>

                {/* Hiển thị thông báo */}
                {typeof msg === 'string' && msg && 
                    <div className={`auth-alert ${msg.startsWith('✅') ? 'success' : 'error'}`}>{msg}</div>
                }
                
                <form onSubmit={handleCreateShop} className="auth-form">
                    
                    {/* ========== 1. THÔNG TIN TÀI KHOẢN (2 CỘT) ========== */}
                    <h4 className="form-section-title">Thông tin tài khoản:</h4>
                    <div className="form-grid">
                        
                        <div className="input-group"><label htmlFor="name">Tên Người bán</label><input id="name" name="name" value={sellerForm.name} onChange={handleChange} required /></div>
                        <div className="input-group"><label htmlFor="email">Email</label><input id="email" type="email" name="email" value={sellerForm.email} onChange={handleChange} required /></div>
                        
                        <div className="input-group"><label htmlFor="password">Mật khẩu</label><input id="password" type="password" name="password" value={sellerForm.password} onChange={handleChange} required /></div>
                        <div className="input-group"><label htmlFor="phone">Số điện thoại</label><input id="phone" type="tel" name="phone" value={sellerForm.phone} onChange={handleChange} required /></div>
                        
                        <div className="input-group form-full-width">
                            <label htmlFor="address">Địa chỉ</label>
                            <input id="address" name="address" value={sellerForm.address} onChange={handleChange} required />
                        </div>
                    </div>


                    {/* ========== 2. THÔNG TIN CỬA HÀNG (2 CỘT) ========== */}
                    <h4 className="form-section-title" style={{marginTop: '20px'}}>Thông tin Cửa hàng:</h4>
                    <div className="form-grid">
                        
                        <div className="input-group"><label htmlFor="shopName">Tên cửa hàng</label><input id="shopName" name="shopName" value={sellerForm.shopName} onChange={handleChange} required /></div>
                        <div className="input-group"><label htmlFor="area">Khu vực kinh doanh</label><input id="area" name="area" value={sellerForm.area} onChange={handleChange} required /></div>
                        
                        <div className="input-group form-full-width">
                            <label htmlFor="shopDescription">Mô tả ngắn</label>
                            {/* Sử dụng class cho textarea */}
                            <textarea id="shopDescription" className="input-textarea" name="shopDescription" value={sellerForm.shopDescription} onChange={handleChange} required />
                        </div>

                        <div className="input-group form-full-width">
                            <label htmlFor="logo">Logo Cửa hàng (URL/Hình ảnh)</label>
                            <input id="logo" name="logo" value={sellerForm.logo} onChange={handleLogoChange} placeholder="Nhập URL hoặc đường dẫn tệp" />
                        </div>
                    </div>
                    
                    {/* Nút Submit */}
                    <button className="btn primary seller" disabled={loading} style={{ marginTop: '20px' }}>
                        {loading ? "Đang tạo cửa hàng..." : "Hoàn tất Tạo cửa hàng"}
                    </button>
                    
                    {/* Nút Hủy */}
                    <button type="button" className="btn ghost" onClick={onClose} style={{ marginTop: '5px' }}>
                        Hủy
                    </button>
                    
                    <button className="close-btn" onClick={onClose}>
                        &times;
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateShopModal;