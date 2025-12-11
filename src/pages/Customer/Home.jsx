// src/pages/Customer/Home.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../css/Home.css"; 
import { Link, useNavigate } from "react-router-dom";
import useCart from "../../hooks/useCart";
import { useAuth } from "../../context/AuthContext";

// IMPORTS CÁC MODAL (Giữ nguyên các Modal)
import AuthSection from "../../components/AuthSection"; // <-- Sẽ tạo component này
import CheckoutModal from "../Buyer/CheckoutPage";
import LoginModal from "../../pages/Auth/Login";
import CreateShopModal from "../../pages/Auth/CreateShopModal";
import RegisterModal from "../../pages/Auth/RegisterModal";
// KHÔNG CẦN import BuyerProfile ở đây nếu nó là trang riêng

// Banner
const MOCK_BANNERS = [
    { id: 1, imgUrl: "/src/img/banner1.jpg", link: "/deal1", title: "Khuyến mãi chào hè" },
    { id: 2, imgUrl: "/src/img/banner2.jpg", link: "/freeship", title: "Freeship toàn khu vực" },
    { id: 3, imgUrl: "/src/img/banner3.jpg", link: "/newarrivals", title: "Sản phẩm mới về" },
];
const BannerCarousel = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex(prevIndex => 
                (prevIndex + 1) % MOCK_BANNERS.length
            );
        }, 5000); 
        return () => clearInterval(interval);
    }, []);
    const handleDotClick = (index) => {
        setActiveIndex(index);
    };
return (
        <div className="main-carousel-container">
            <div className="carousel-track" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
                {MOCK_BANNERS.map((banner, index) => (
                    <Link to={banner.link} key={banner.id} className="carousel-slide">
                        <img src={banner.imgUrl} alt={banner.title} />
                    </Link>
                ))}
            </div>
            <div className="carousel-dots">
                {MOCK_BANNERS.map((_, index) => (
                    <span
                        key={index}
                        className={`dot ${index === activeIndex ? 'active' : ''}`}
                        onClick={() => handleDotClick(index)}
                    />
                ))}
            </div>
        </div>
    );
};


const MOCK_CATEGORIES = [
    { id: 1, name: "Thời Trang Nam", iconUrl:"/src/img/OIF.webp" },
    { id: 2, name: "Điện Thoại & Phụ Kiện", iconUrl: "/src/img/DT.webp" },
    { id: 3, name: "Thiết Bị Điện Tử", iconUrl:"/src/img/TBDT.webp" },
    { id: 4, name: "Máy Tính & Laptop", iconUrl: "/src/img/MT.webp" },
    { id: 5, name: "Đồ Gia Dụng", iconUrl: "/src/img/DGD.webp"},
    { id: 6, name: "Thể Thao & Du Lịch", iconUrl: "/src/img/DTT.webp" },
    { id: 7, name: "Ô Tô & Xe Máy & Xe Đạp", iconUrl: "/src/img/XM.webp" },
    { id: 8, name: "Thời Trang Nữ", iconUrl: "/src/img/TTN.webp" },
    { id: 9, name: "Sắc Đẹp & Sức Khỏe", iconUrl: "/src/img/SD.webp" },
    { id: 10, name: "Giày Dép Nữ", iconUrl: "/src/img/GD.webp" },
    { id: 11, name: "Nhà Sách Online", iconUrl: "/src/img/NS.webp" },
];


export default function Home() {
    // 1. STATE CHUNG & KẾT NỐI HOOK
    const { isAuthenticated, userRole } = useAuth();
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();

    // Kết nối Cart Hook
    const { handleAddToCart } = useCart();

    // Dữ liệu sản phẩm
    const [products, setProducts] = useState([]);
    const [productsLoading, setProductsLoading] = useState(true);

    // Dữ liệu TÌM KIẾM
    const [searchTerm, setSearchTerm] = useState('');

    // Điều khiển Modals
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [showCreateShop, setShowCreateShop] = useState(false);
    const [showCheckout, setShowCheckout] = useState(false);
    // Đã xóa showProfile

    // 2. PUBLIC API
    const publicApi = axios.create({
        baseURL: "http://localhost:5146/api",
    });

    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                const res = await publicApi.get("/Products/all"); 
                setProducts(res.data);
            } catch (err) {
                console.error("Lỗi khi tải tất cả sản phẩm:", err);
            } finally {
                setProductsLoading(false);
            }
        };
        fetchAllProducts();
    }, []);

    // 4. LOGIC TÌM KIẾM
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
            setSearchTerm('');
        }
    };
    
    // 5. HÀM CHUYỂN HƯỚNG ĐẾN TRANG PROFILE MỚI
    const handleShowProfile = () => {
        // Sử dụng navigate để chuyển hướng đến trang profile
        navigate("/profile"); 
    };

    // 6. HÀM RENDER DANH MỤC MỚI (Giữ nguyên)
    const renderCategories = () => (
        <div className="category-section-wrapper">
            <h3 className="section-title">DANH MỤC</h3>
            <div className="category-grid">
                {MOCK_CATEGORIES.map(cat => (
                    <Link to={`/category/${cat.id}`} key={cat.id} className="category-item">
                        <img src={cat.iconUrl} alt={cat.name} className="category-icon" />
                        <span className="category-name">{cat.name}</span>
                    </Link>
                ))}
            </div>
        </div>
    );

    const renderProductCard = (product) => {
        const shopName = product.ShopName || "Shop không xác định";

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
                    <p className="product-price">{product.price?.toLocaleString()} ₫</p>
                    <Link
                        to={`/shop/${product.ShopId || 1}`}
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

                    {/* NÚT THÊM VÀO GIỎ HÀNG */}
                    <button
                        type="button"
                        className="btn small primary add-to-cart-btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product);
                        }}
                    >
                        + Thêm vào giỏ
                    </button>
                </div>
            </div>
        );
    }
    // KẾT THÚC HÀM RENDER PRODUCT CARD


    return (
        <div className="home-wrap">
            {/* HEADER */}
            <header className="home-header">
                <div className="header-top-bar">
                    <div className="brand">
                        <Link to="/" className="brand-link">
                            🛍️ AN KHANG BÌNH VƯỢNG SHOP
                        </Link>
                    </div>

                    <AuthSection
                        onShowLogin={() => setShowLogin(true)}
                        onShowRegister={() => setShowRegister(true)}
                        onShowCreateShop={() => setShowCreateShop(true)}
                        onShowCheckout={() => setShowCheckout(true)}
                        onshowProfile={handleShowProfile} // <-- Đã truyền hàm navigate vào đây
                    />
                </div>

                <div className="center-search-wrapper">
                    <form
                        onSubmit={handleSearch}
                        className="search-bar-container"
                    >
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Tìm kiếm sản phẩm, shop, danh mục..."
                        />
                        <button type="submit" className="search-btn">
                            🔍
                        </button>
                    </form>
                </div>

            </header>

            {!isAuthenticated || userRole === 'buyer' ? (
                <div className="seller-promotion-banner">
                    <div className="banner-content">
                        <h4 className="banner-title">
                            🎉 Mở cửa hàng online miễn phí ngay hôm nay!
                        </h4>
                        <ul className="seller-benefits">
                            <li>🚀 Tiếp cận khách hàng: Bán hàng đến cộng đồng địa phương của bạn.</li>
                            <li>💰 Thu nhập ổn định: Tăng doanh số không cần phí duy trì hàng tháng.</li>
                            <li>🛠️ Quản lý đơn giản: Công cụ quản lý sản phẩm và đơn hàng trực quan.</li>
                        </ul>
                    </div>
                    <div className="banner-action">
                        <button
                            className="btn seller banner-cta-btn no-wrap"
                            onClick={() => setShowCreateShop(true)}
                        >
                            Bán hàng ngay!
                        </button>
                        <p className="banner-hint">
                            Không mất phí khởi tạo!
                        </p>
                    </div>
                </div>
            ) : null}
            
            {/* CHÈN BANNER CAROUSEL */}
            <BannerCarousel />
            {/* ------------------- */}
            
            {/* CHÈN DANH MỤC */}
            {renderCategories()} 
            {/* ------------------- */}

            <section className="product-showcase-section">
                <h2 className="section-title">✨ Sản phẩm nổi bật gần bạn</h2>
                
                <div className="body-product">
                    <div className="img-left-body">
                        <img 
                            className="img_banner" 
                            src="https://bizweb.dktcdn.net/100/294/085/themes/936041/assets/banner_tab1_1.jpg?1707302368965" 
                            alt="Banner Quảng Cáo" 
                        />
                    </div>
                    
                    {productsLoading ? (
                        <p className="loading-text">Đang tải sản phẩm...</p>
                    ) : products.length === 0 ? (
                        <p className="no-products-text">Hiện tại chưa có sản phẩm nào được bán.</p>
                    ) : (
                        <div className="product-grid">
                            {products.slice(0, 100).map(p => (
                                renderProductCard(p)
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <footer className="home-footer">
                © {new Date().getFullYear()} ShopTMDT • Cộng đồng bán hàng địa phương
            </footer>

            {msg && (
                <div className="toast" onClick={() => setMsg("")}>
                    {msg}
                </div>
            )}

            {showLogin && (
                <LoginModal
                    onClose={() => setShowLogin(false)}
                    setLoading={setLoading}
                    setMsg={setMsg}
                    loading={loading}
                />
            )}
            {showRegister && (
                <RegisterModal
                    onClose={() => setShowRegister(false)}
                    setLoading={setLoading}
                    setMsg={setMsg}
                    loading={loading}
                />
            )}
            {showCreateShop && (
                <CreateShopModal
                    onClose={() => setShowCreateShop(false)}
                    setLoading={setLoading}
                    setMsg={setMsg}
                    loading={loading}
                />
            )}
            {showCheckout && (
                <CheckoutModal
                    onClose={() => setShowCheckout(false)}
                    setLoading={setLoading}
                    setMsg={setMsg}
                />
            )}
            {/* ĐÃ XÓA RENDER PROFILE MODAL Ở ĐÂY */}
        </div>
    );
}