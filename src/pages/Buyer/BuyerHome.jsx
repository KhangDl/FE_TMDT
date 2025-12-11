import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import '../../css/BuyerHome.css'; 
import useCart from '../../hooks/useCart';

const formatCurrency = (amount) => {
    if (typeof amount !== 'number') return '0 ₫'; 
    return amount.toLocaleString('vi-VN') + ' ₫';
};

export default function BuyerHome() {
    const navigate = useNavigate();
    
    // ⭐️ LẤY state GIỎ HÀNG VÀ HÀM TỪ CONTEXT
    const { cart, handleAddToCart } = useCart(); 

    // Dữ liệu tĩnh của Cửa hàng và Sản phẩm
    const [shops] = useState([
        {
            id: 1,
            name: "Cửa hàng Rau Sạch A",
            area: "Đồng Nai",
            logo: "https://i.imgur.com/hX4H0hK.jpeg",
            description: "Chuyên cung cấp rau củ quả tươi mỗi ngày.",
            products: [
                { id: 1, name: "Rau muống", price: 15000, image: "https://i.imgur.com/FZC8v9a.jpeg", ShopId: 1, ShopName: "Cửa hàng Rau Sạch A", ShopLogo: "https://i.imgur.com/hX4H0hK.jpeg" },
                { id: 2, name: "Cải ngọt", price: 12000, image: "https://i.imgur.com/f7trVDC.jpeg", ShopId: 1, ShopName: "Cửa hàng Rau Sạch A", ShopLogo: "https://i.imgur.com/hX4H0hK.jpeg" },
                { id: 3, name: "Cà chua", price: 10000, image: "https://i.imgur.com/mAVprng.jpeg", ShopId: 1, ShopName: "Cửa hàng Rau Sạch A", ShopLogo: "https://i.imgur.com/hX4H0hK.jpeg" },
            ],
        },
        {
            id: 2,
            name: "Cửa hàng Trứng Sạch B",
            area: "Bình Dương",
            logo: "https://i.imgur.com/NKwFQKl.jpeg",
            description: "Trứng sạch, đảm bảo an toàn và tươi mới.",
            products: [
                { id: 4, name: "Trứng gà ta", price: 30000, image: "https://i.imgur.com/Fx8Z3yz.jpeg", ShopId: 2, ShopName: "Cửa hàng Trứng Sạch B", ShopLogo: "https://i.imgur.com/NKwFQKl.jpeg" },
                { id: 5, name: "Trứng vịt", price: 28000, image: "https://i.imgur.com/FzULWkL.jpeg", ShopId: 2, ShopName: "Cửa hàng Trứng Sạch B", ShopLogo: "https://i.imgur.com/NKwFQKl.jpeg" },
            ],
        },
    ]);

    const [selectedShop, setSelectedShop] = useState(null);

    // ❌ ĐÃ XÓA HÀM handleAddToCart CỤC BỘ VÀ calculateTotal CỤC BỘ

    const renderProductCard = (product) => {
        // Lấy tên shop từ sản phẩm hoặc shop đang được chọn
        const shopName = product.ShopName || (selectedShop ? selectedShop.name : ''); 
        
        // Gói thông tin shop vào đối tượng sản phẩm để Context có thể lưu trữ
        const productWithShopInfo = { 
            ...product,
            shopName: shopName
        };

        return (
            <div key={product.id} className="product-card"> 
                <Link to={`/product/${product.id}`} >
                    <img 
                        src={product.image || "https://via.placeholder.com/250x250"} 
                        alt={product.name} 
                        className="product-image" 
                    />
                </Link>
                <div className="product-info-wrapper">
                    <Link to={`/product/${product.id}`} className="product-name-link">
                        <h4 className="product-name">{product.name}</h4>
                    </Link>
                    <p className="product-price">{formatCurrency(product.price)}</p>
                    
                    <Link 
                        to={`/shop/${product.ShopId}`} 
                        className="shop-link" 
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img 
                            src={product.ShopLogo || "https://via.placeholder.com/20x20"} 
                            alt="Shop Logo" 
                            className="shop-logo" 
                        />
                        <span className="shop-name">{shopName}</span>
                    </Link>
                    
                    <button 
                        type="button"
                        className="btn small primary add-to-cart-btn"
                        onClick={(e) => {
                            e.stopPropagation(); 
                            // ⭐️ GỌI HÀM CỦA CONTEXT
                            handleAddToCart(productWithShopInfo); 
                            alert(`${product.name} đã được thêm vào giỏ hàng từ ${shopName || product.ShopName}!`);
                        }}
                    >
                        + Thêm vào giỏ
                    </button>
                </div>
            </div>
        );
    }
    
    return (
        <div className="buyer-home-wrap">
            <div className="cart-header">
                <h2 className="section-title">
                    {selectedShop ? `🛒 Sản phẩm tại ${selectedShop.name}` : '🛍️ Cửa hàng trong khu vực'}
                </h2>
                <button
                    type="button"
                    className="btn-base btn-blue"
                    onClick={() => navigate('/checkout')}
                    // ⭐️ DÙNG CART TỪ CONTEXT (Đã đồng bộ)
                    disabled={cart.length === 0} 
                >
                    Giỏ hàng ({cart.length})    
                </button>
            </div>

            {!selectedShop ? (
                <>
                    <p className="section-desc">Chọn cửa hàng để xem sản phẩm.</p>
                    <div className="shop-grid">
                        {shops.map((shop) => (
                            <div key={shop.id} className="shop-card">
                                <img src={shop.logo} alt="Logo" className="shop-logo" />
                                <h3>{shop.name}</h3>
                                <p className="section-desc">{shop.description}</p>
                                <p className="shop-area">📍 {shop.area}</p>
                                <button
                                    type="button"
                                    className="btn-base btn-blue"
                                    onClick={() => setSelectedShop(shop)}
                                >
                                    Xem sản phẩm
                                </button>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <>
                    <button type="button" onClick={() => setSelectedShop(null)} className="btn-base btn-gray">
                        ← Quay lại danh sách cửa hàng
                    </button>
                    
                    <div className="shop-detail-header">
                        <img src={selectedShop.logo} alt="Logo" className="shop-logo-large" />
                        <div>
                            <h2>{selectedShop.name}</h2>
                            <p>{selectedShop.description}</p>
                            <p>📍 {selectedShop.area}</p>
                        </div>
                    </div>

                    <h3 className="section-title">Sản phẩm của cửa hàng</h3>
                    <div className="product-grid"> 
                        {selectedShop.products.map((p) => (
                            renderProductCard(p)
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}