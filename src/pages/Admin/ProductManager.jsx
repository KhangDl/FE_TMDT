import React, { useEffect, useState } from "react";
// Không dùng axios, vì chúng ta đang dùng dữ liệu ảo (mock data)
import "../../css/ShopManager.css"; 

// --- DỮ LIỆU GIẢ (MOCK DATA) ---
const MOCK_SHOPS_DATA = [
    { id: 1, name: "Shop Quần Áo XYZ", ownerName: "Nguyễn Văn A", totalProducts: 5 },
    { id: 2, name: "Shop Điện Tử Chính Hãng", ownerName: "Trần Thị B", totalProducts: 10 },
    { id: 3, name: "Shop Đồ Gia Dụng", ownerName: "Lê Văn C", totalProducts: 3 },
    { id: 4, name: "Cửa Hàng Thể Thao Pro", ownerName: "Phạm Thị D", totalProducts: 7 },
];

const MOCK_PRODUCTS_DATA = [
    // Sản phẩm của Shop ID 1
    { id: 101, shopId: 1, name: "Áo Polo Cotton", price: 150000, stock: 50, status: "active" },
    { id: 102, shopId: 1, name: "Quần Jeans Slimfit", price: 450000, stock: 20, status: "pending" },
    { id: 103, shopId: 1, name: "Váy Nữ Mùa Hè", price: 300000, stock: 15, status: "inactive" },
    // Sản phẩm của Shop ID 2
    { id: 201, shopId: 2, name: "Tai Nghe Bluetooth", price: 800000, stock: 100, status: "active" },
    { id: 202, shopId: 2, name: "Củ Sạc Nhanh 65W", price: 250000, stock: 200, status: "active" },
    { id: 203, shopId: 2, name: "Camera Hành Trình", price: 1200000, stock: 10, status: "pending" },
];

// --- COMPONENT CHÍNH ---

export default function ProductManager() {
    // State quản lý cấp độ: null (danh sách shops), shopId (chi tiết sản phẩm của shop)
    const [selectedShopId, setSelectedShopId] = useState(null); 
    const [shops, setShops] = useState(MOCK_SHOPS_DATA);
    const [products, setProducts] = useState(MOCK_PRODUCTS_DATA);
    const [searchTerm, setSearchTerm] = useState("");
    const [msg, setMsg] = useState("");

    // 1. Logic Duyệt, Xóa, Cập nhật
    const handleAction = (productId, actionType) => {
        setProducts(prevProducts =>
            prevProducts.map(p => {
                if (p.id === productId) {
                    if (actionType === 'delete') {
                        return null; // Đánh dấu để xóa
                    }
                    if (actionType === 'approve') {
                        return { ...p, status: 'active' };
                    }
                    if (actionType === 'reject') {
                        return { ...p, status: 'inactive' };
                    }
                }
                return p;
            }).filter(p => p !== null) // Lọc bỏ sản phẩm đã xóa
        );
        setMsg(`✔️ Sản phẩm ID ${productId} đã được ${actionType === 'delete' ? 'XÓA' : actionType.toUpperCase()}.`);
    };

    // 2. Lọc sản phẩm theo ShopID và Search Term
    const currentShop = shops.find(s => s.id === selectedShopId);
    
    // Lọc sản phẩm (dành cho cấp độ 2: Chi tiết sản phẩm)
    const filteredProducts = products.filter(p => 
        p.shopId === selectedShopId && 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // ✅ LỌC CỬA HÀNG (dành cho cấp độ 1: Danh sách cửa hàng)
    const filteredShops = shops.filter(s => {
        const term = searchTerm.toLowerCase();
        const shopIdString = s.id ? s.id.toString() : "";
        const shopName = s.name ? s.name.toLowerCase() : "";

        return shopName.includes(term) || shopIdString.includes(term);
    });

    // 3. Render danh sách sản phẩm (Chi tiết Shop)
    const renderProductList = () => (
        <>
            <button className="btn btn-ghost" onClick={() => { setSelectedShopId(null); setSearchTerm(""); setMsg(""); }}>
                ← Quay lại danh sách Cửa hàng
            </button>
            <h3 style={{ marginTop: '20px', color: '#007bff' }}>📦 Sản phẩm của {currentShop?.name}</h3>
            
            <div style={{ margin: '15px 0' }}>
                <input
                    type="text"
                    placeholder="🔍 Tìm kiếm tên sản phẩm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            {filteredProducts.length === 0 && !searchTerm ? (
                <p>Cửa hàng này chưa có sản phẩm nào.</p>
            ) : filteredProducts.length === 0 && searchTerm ? (
                <p>Không tìm thấy sản phẩm nào cho từ khóa "{searchTerm}".</p>
            ) : (
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên sản phẩm</th>
                            <th>Giá</th>
                            <th>Kho</th>
                            <th>Trạng thái</th>
                            <th className="th-action">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map(p => (
                            <tr key={p.id} className={p.status === 'inactive' ? 'row-inactive' : ''}>
                                <td>{p.id}</td>
                                <td>{p.name}</td>
                                <td>{p.price.toLocaleString()} ₫</td>
                                <td>{p.stock}</td>
                                <td>
                                    <span className={`status-tag status-${p.status}`}>
                                        {p.status.toUpperCase()}
                                    </span>
                                </td>
                                <td className="action-cell">
                                    {p.status === 'pending' && (
                                        <button className="btn btn-success" onClick={() => handleAction(p.id, 'approve')}>
                                            Duyệt
                                        </button>
                                    )}
                                    {p.status === 'pending' && (
                                        <button className="btn btn-edit" onClick={() => handleAction(p.id, 'reject')} style={{marginLeft: '5px'}}>
                                            Từ chối
                                        </button>
                                    )}
                                    <button className="btn btn-delete" onClick={() => handleAction(p.id, 'delete')} style={{marginLeft: '5px'}}>
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </>
    );

    // 4. Render danh sách Cửa hàng
    const renderShopList = () => (
        <>
            <h3 style={{ marginBottom: '20px', color: '#343a40' }}>Danh sách Cửa hàng ({shops.length})</h3>
            
            {/* ✅ KHU VỰC TÌM KIẾM CỬA HÀNG */}
            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="🔍 Tìm kiếm theo ID hoặc Tên Cửa hàng..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>
            {/* ------------------------- */}
            
            {filteredShops.length === 0 && searchTerm ? (
                <p>Không tìm thấy cửa hàng nào khớp với từ khóa "{searchTerm}".</p>
            ) : (
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên cửa hàng</th>
                            <th>Chủ sở hữu</th>
                            <th>Tổng SP</th>
                            <th className="th-action">Xem SP</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* ✅ SỬ DỤNG filteredShops */}
                        {filteredShops.map(s => (
                            <tr key={s.id}>
                                <td>{s.id}</td>
                                <td>{s.name}</td>
                                <td>{s.ownerName}</td>
                                <td>{s.totalProducts}</td>
                                <td className="action-cell">
                                    <button 
                                        className="btn btn-primary"
                                        onClick={() => {
                                            setSelectedShopId(s.id);
                                            setSearchTerm(""); // Reset tìm kiếm khi chuyển sang cấp độ SP
                                        }}
                                    >
                                        Xem ({s.totalProducts})
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </>
    );

    return (
        <div className="admin-page-content">
            <h2>📦 Quản lý Sản phẩm</h2>
            
            {msg && <p className="message-status">{msg}</p>}

            {/* Chuyển đổi giữa hai view */}
            {selectedShopId ? renderProductList() : renderShopList()}
        </div>
    );
}