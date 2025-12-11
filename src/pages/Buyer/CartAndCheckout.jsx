// src/components/CartAndCheckout.jsx

import React from 'react';

// Hàm định dạng tiền tệ (Tái định nghĩa hoặc dùng chung)
const formatCurrency = (amount) => {
    if (typeof amount !== 'number') return '0 ₫'; 
    return amount.toLocaleString('vi-VN') + ' ₫';
};

// Component Giỏ hàng và Thanh toán
export default function CartAndCheckout({
    cart,                 
    checkoutStep,         
    userInfo,             
    onSetIsCheckout,      
    onSetCheckoutStep,    
    onSetUserInfo,        
    onHandleRemoveFromCart, 
    onCalculateTotal,     
    onClearCart           
}) {
    const total = onCalculateTotal();

    // Hàm xử lý việc đặt hàng cuối cùng (Bước 3)
    const handleOrderComplete = () => {
        // ⭐️ THÊM LOGIC GỌI API ĐẶT HÀNG THỰC TẾ TẠI ĐÂY
        // Ví dụ: callOrderApi(cart, userInfo);
        
        // Reset state sau khi đặt hàng thành công
        onClearCart();
        onSetIsCheckout(false); 
        onSetCheckoutStep(1); 
    };

    // =========================================================================
    // ⭐️ BƯỚC 1: GIỎ HÀNG
    // =========================================================================
    if (checkoutStep === 1) {
        return (
            <div className="buyer-home-wrap checkout-step-container">
                <h2>🛒 Bước 1: Giỏ hàng của bạn ({cart.length} sản phẩm)</h2>
                {cart.length === 0 ? (
                    <p>Giỏ hàng trống. 
                        <button onClick={() => onSetIsCheckout(false)} className="btn-link">Quay lại mua sắm.</button>
                    </p>
                ) : (
                    <>
                        {cart.map(item => (
                            <div key={item.id} className="cart-item">
                                <div>
                                    <strong>{item.name}</strong> ({item.ShopName || item.shopName}) x {item.quantity}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <span className="cart-item-price">
                                        {formatCurrency(item.price * item.quantity)}
                                    </span>
                                    <button 
                                        type="button"
                                        onClick={() => onHandleRemoveFromCart(item.id)} 
                                        className="btn-base btn-remove"
                                    >
                                        Xóa
                                    </button>
                                </div>
                            </div>
                        ))}
                        <div className="cart-total-summary">
                            <strong>TỔNG THANH TOÁN:</strong>
                            <span>{formatCurrency(total)}</span>
                        </div>
                        <button
                            type="button"
                            className="btn-base btn-checkout"
                            onClick={() => onSetCheckoutStep(2)}
                        >
                            Tiếp tục thanh toán →
                        </button>
                    </>
                )}
            </div>
        );
    }

    // =========================================================================
    // ⭐️ BƯỚC 2: THÔNG TIN GIAO HÀNG
    // =========================================================================
    if (checkoutStep === 2) {
        return (
            <div className="buyer-home-wrap checkout-step-container checkout-form-container">
                <h2>📝 Bước 2: Thông tin giao hàng</h2>
                <form onSubmit={(e) => { 
                    e.preventDefault(); 
                    onSetCheckoutStep(3); // Chuyển sang bước xác nhận
                }}>
                    <div className="form-group">
                        <label>Tên người nhận:</label>
                        <input
                            type="text"
                            value={userInfo.name}
                            onChange={(e) => onSetUserInfo({ ...userInfo, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Số điện thoại:</label>
                        <input
                            type="tel"
                            value={userInfo.phone}
                            onChange={(e) => onSetUserInfo({ ...userInfo, phone: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Địa chỉ:</label>
                        <input
                            type="text"
                            value={userInfo.address}
                            onChange={(e) => onSetUserInfo({ ...userInfo, address: e.target.value })}
                            required
                        />
                    </div>
                    <div className="cart-total-summary">
                        <strong>Tổng cộng: {formatCurrency(total)}</strong>
                    </div>
                    <button
                        type="submit"
                        className="btn-base btn-checkout"
                    >
                        Xác nhận và Đặt hàng
                    </button>
                    <button
                        type="button"
                        onClick={() => onSetCheckoutStep(1)}
                        className="btn-base btn-gray"
                    >
                        ← Quay lại giỏ hàng
                    </button>
                </form>
            </div>
        );
    }
    
    // =========================================================================
    // ⭐️ BƯỚC 3: HOÀN TẤT
    // =========================================================================
    if (checkoutStep === 3) {
        return (
            <div className="buyer-home-wrap checkout-step-container checkout-form-container">
                <h2>✅ Bước 3: Đặt hàng thành công!</h2>
                <p className="success-message">Cảm ơn bạn đã đặt hàng!</p>
                <div className="order-summary-box">
                    <p><strong>Mã đơn hàng:</strong> #ABC-{Date.now().toString().slice(-6)}</p>
                    <p><strong>Tổng tiền:</strong> {formatCurrency(total)}</p>
                    <hr />
                    <p>Đơn hàng sẽ được giao đến:</p>
                    <p>Tên: <strong>{userInfo.name}</strong></p>
                    <p>SĐT: <strong>{userInfo.phone}</strong></p>
                    <p>Địa chỉ: <strong>{userInfo.address}</strong></p>
                </div>
                
                <button
                    type="button"
                    className="btn-base btn-blue"
                    onClick={handleOrderComplete} // Gọi hàm xử lý và reset state
                >
                    Tiếp tục mua sắm
                </button>
            </div>
        );
    }
}