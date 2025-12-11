import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ⭐️ Dùng để chuyển hướng
import useCart from '../../hooks/useCart'; 
import '../../css/CheckoutPage.css';

export default function CheckoutPage() {
    const navigate = useNavigate();
    const { cart, calculateTotal, clearCart, updateCartItemQuantity, removeCartItem } = useCart();
    
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');
    
    // State cho form thông tin giao hàng
    const [checkoutForm, setCheckoutForm] = useState({
        name: "", phone: "", address: "", paymentMethod: "COD"
    });

    const handleCheckout = (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg(''); // Xóa thông báo cũ

        if (cart.length === 0) {
            setMsg("❌ Giỏ hàng của bạn đang trống.");
            setLoading(false);
            return;
        }

        // --- Xử lý thanh toán MÔ PHỎNG ---
        setTimeout(() => {
            const totalAmount = calculateTotal();
            setMsg(`🎉 Đặt hàng thành công! Tổng tiền: ${totalAmount.toLocaleString()} ₫. Đơn hàng sẽ được giao đến ${checkoutForm.address}`);
            
            clearCart();
            setLoading(false);
            
            // ⭐️ Chuyển hướng về trang chủ sau 3 giây
            setTimeout(() => {
                navigate('/');
            }, 3000);

        }, 1500);
    };

    return (
        // ⭐️ Thay thế các class modal bằng class trang (page)
        <div className="buyer-home-wrap checkout-page-container"> 
            
            {/* Nút Quay lại */}
            <button 
                type="button"
                onClick={() => navigate('/')} 
                className="btn-base btn-gray back-to-home-btn"
            >
                ← Quay lại Trang Chủ
            </button>
            
            <div className="checkout-content-wrapper">
                <h3>🛍️ Giỏ hàng & Thanh toán</h3>
                
                {msg && <div className={`alert ${msg.startsWith('🎉') ? 'success' : 'error'}`}>{msg}</div>}
                
                {cart.length === 0 ? (
                    <p className="empty-cart-msg">
                        Giỏ hàng trống.
                    </p>
                ) : (
                    <>
                        {/* Danh sách sản phẩm trong giỏ */}
                        <ul className="cart-list">
                            {cart.map(item => (
                                <li key={item.id} className="cart-item">
                                    <img src={item.image || "https://via.placeholder.com/40"} alt={item.name} className="cart-item-image" />
                                    <div className="item-details">
                                        <span className="item-name">{item.name}</span>
                                        <span className="item-price-single">Giá: {item.price?.toLocaleString()} ₫</span>
                                    </div>
                                    <div className="item-actions">
                                        <input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) => updateCartItemQuantity(item.id, parseInt(e.target.value))}
                                            style={{ width: '50px', marginRight: '10px' }}
                                        />
                                        <button onClick={() => removeCartItem(item.id)} className="btn-remove">Xóa</button>
                                    </div>
                                    <span className="item-price">
                                        Tổng: {(item.price * item.quantity).toLocaleString()} ₫
                                    </span>
                                </li>
                            ))}
                        </ul>
                        
                        <hr />
                        <div className="cart-total">
                            <strong>Tổng thanh toán:</strong> 
                            <span>{calculateTotal().toLocaleString()} ₫</span>
                        </div>
                        
                        {/* Form Thanh toán */}
                        <h4 style={{marginTop: '20px'}}>Thông tin giao hàng:</h4>
                        <form onSubmit={handleCheckout} className="form">
                            <label>Tên người nhận</label>
                            <input
                                value={checkoutForm.name}
                                onChange={(e) => setCheckoutForm({ ...checkoutForm, name: e.target.value })}
                                required
                            />
                            <label>Số điện thoại</label>
                            <input
                                value={checkoutForm.phone}
                                onChange={(e) => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
                                required
                            />
                            <label>Địa chỉ nhận hàng</label>
                            <input
                                value={checkoutForm.address}
                                onChange={(e) => setCheckoutForm({ ...checkoutForm, address: e.target.value })}
                                required
                            />
                            <label>Phương thức thanh toán</label>
                            <select
                                value={checkoutForm.paymentMethod}
                                onChange={(e) => setCheckoutForm({ ...checkoutForm, paymentMethod: e.target.value })}
                            >
                                <option value="COD">Thanh toán khi nhận hàng (COD)</option>
                                <option value="BANK">Chuyển khoản Ngân hàng (Mô phỏng)</option>
                            </select>

                            <button className="btn big primary" disabled={loading} style={{marginTop: '20px'}}>
                                {loading ? "Đang xử lý đơn hàng..." : `Đặt hàng và Thanh toán (${calculateTotal().toLocaleString()} ₫)`}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}