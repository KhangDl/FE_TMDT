import React from 'react';

// Giả định bạn có file CSS chứa các class sau:
// .profile-container
// .profile-header
// .profile-description
// .profile-info-grid
// .info-box
// .info-box-account
// .info-box-contact
// .mt-10, .mt-30
// .section-title
// .btn, .btn-small, .btn-primary, .btn-secondary, .edit-btn, .ml-10

export default function SellerProfile({ userData, privateApi }) {
    const {
        id,
        name,
        email,
        phone,
        address,
        area,
        role,
        status,
        createdAt
    } = userData || {};

    const createdDate = createdAt 
        ? new Date(createdAt).toLocaleDateString('vi-VN') 
        : 'N/A';

    return (
        <div className="profile-container seller-profile">
            <h2 className="profile-header">👤 Hồ sơ Tài khoản Cá nhân (Seller)</h2>
            <p className="profile-description">Quản lý thông tin đăng nhập và liên hệ của Người bán.</p>

            <div className="profile-info-grid seller-grid">
                
                {/* THÔNG TIN TÀI KHOẢN VÀ BẢO MẬT */}
                <div className="info-box info-box-account">
                    <h3>Thông tin Đăng nhập & Cơ bản</h3>
                    <p><strong>ID:</strong> <span>{id || 'N/A'}</span></p>
                    <p><strong>Họ và Tên:</strong> <span>{name || 'Chưa thiết lập'}</span></p>
                    <p><strong>Email:</strong> <span>{email || 'N/A'}</span></p>
                    <p><strong>Vai trò:</strong> <span>{role === 'seller' ? 'Người bán hàng' : 'N/A'}</span></p>
                    <p><strong>Trạng thái:</strong> <span>{status === 'active' ? 'Hoạt động' : status}</span></p>
                    <p><strong>Ngày tham gia:</strong> <span>{createdDate}</span></p>
                    
                    <h4 className="mt-10 sub-header">Bảo mật</h4>
                    <p><strong>Mật khẩu:</strong> <span>**************</span>
                        <button className="btn btn-small btn-secondary edit-btn ml-10">Đổi Mật khẩu</button>
                    </p>
                </div>

                {/* THÔNG TIN LIÊN HỆ VÀ ĐỊA CHỈ */}
                <div className="info-box info-box-contact">
                    <h3>Thông tin Liên hệ/Giao dịch</h3>
                    <p><strong>Số điện thoại:</strong> <span>{phone || 'Chưa thiết lập'}</span></p>
                    <p><strong>Địa chỉ liên hệ:</strong> <span>{address || 'Vui lòng cập nhật địa chỉ'}</span></p>
                    <p><strong>Khu vực/Tỉnh thành:</strong> <span>{area || 'N/A'}</span></p>
                    <button className="btn btn-small btn-primary mt-10">Cập nhật Thông tin</button>
                </div>
            </div>

            <h2 className="section-title mt-30">🏪 Liên kết Shop</h2>
            <p>Thông tin cửa hàng (Logo, Tên shop, Sản phẩm) được quản lý trong **Dashboard**.</p>
        </div>
    );
}