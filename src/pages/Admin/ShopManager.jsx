import React, { useEffect, useState } from "react";
import axios from "../../services/api";
import "../../css/ShopManager.css";

export default function ShopManager() {
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(""); // ✅ STATE MỚI CHO TÌM KIẾM
    const [msg, setMsg] = useState(""); // Thêm state msg

    const fetchShops = async () => {
        try {
            // ✅ Đã sửa URL gọi API thành /shop
            const res = await axios.get("/shop"); 
            setShops(res.data);
            setMsg("");
        } catch (err) {
            console.error("Lỗi tải shop:", err);
            setMsg("❌ Không thể tải danh sách cửa hàng.");
        } finally {
            setLoading(false);
        }
    };

    // Hàm gọi API để cập nhật trạng thái
    const toggleStatus = async (id, currentStatus) => {
        const lowerStatus = currentStatus.toLowerCase();
        
        let endpoint = '';
        let successMessage = '';
        
        // Logic để khóa/mở khóa (Giả định: approved/active -> suspend, khác -> approve)
        if (lowerStatus === 'approved' || lowerStatus === 'active') {
            endpoint = `/shop/${id}/suspend`;
            successMessage = '✔️ Đã khóa cửa hàng thành công.';
        } else {
            endpoint = `/shop/${id}/approve`;
            successMessage = '✔️ Đã mở khóa (Duyệt lại) cửa hàng thành công.';
        }

        try {
            await axios.put(endpoint);
            
            // Cập nhật trạng thái ngay lập tức trên FE (tối ưu UX)
            const newStatus = (lowerStatus === 'approved' || lowerStatus === 'active') ? 'suspended' : 'approved';
            
            setShops(prevShops =>
                prevShops.map(shop =>
                    shop.id === id ? { ...shop, status: newStatus } : shop
                )
            );
            setMsg(successMessage);
        } catch (err) {
            console.error("Lỗi cập nhật trạng thái:", err);
            setMsg("❌ Lỗi khi cập nhật trạng thái cửa hàng.");
        }
    };

    useEffect(() => {
        fetchShops();
    }, []);

    // ✅ LOGIC LỌC DANH SÁCH SHOP
    const filteredShops = shops.filter(shop => {
        const term = searchTerm.toLowerCase();
        // Tìm kiếm theo ID hoặc Tên Cửa hàng
        const shopIdString = shop.id ? shop.id.toString() : "";
        const shopName = shop.name ? shop.name.toLowerCase() : "";

        return shopName.includes(term) || shopIdString.includes(term);
    });

    // Hàm xác định class cho dòng (ví dụ: bị khóa)
    const getRowClassName = (status) => {
        return (status && (status.toLowerCase() === 'suspended' || status.toLowerCase() === 'rejected')) ? 'row-inactive' : '';
    }

    return (
        <div className="admin-page-content">
            <h2>🏪 Quản lý cửa hàng ({shops.length})</h2>
            
            
            {msg && <p className="message-status">{msg}</p>}

            {/* ✅ KHU VỰC TÌM KIẾM */}
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

            {loading ? (
                <p className="loading-text">⏳ Đang tải...</p>
            ) : (
                <>
                    {filteredShops.length === 0 && searchTerm ? (
                        <p>Không tìm thấy cửa hàng nào khớp với từ khóa "{searchTerm}".</p>
                    ) : (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Tên cửa hàng</th>
                                    <th>Chủ shop</th>
                                    <th>Khu vực</th>
                                    <th>Trạng thái</th>
                                    <th className="th-action">Thao tác</th>
                                </tr>
                            </thead>

                            <tbody>
                                {/* ✅ SỬ DỤNG DANH SÁCH ĐÃ LỌC */}
                                {filteredShops.map(shop => (
                                    <tr key={shop.id} className={getRowClassName(shop.status)}>
                                        <td>{shop.id}</td>
                                        <td>{shop.name}</td>
                                        
                                        {/* Truy cập owner.name (chữ thường nhờ cấu hình Backend) */}
                                        <td>{shop.owner ? shop.owner.name : "N/A"}</td> 

                                        <td>{shop.area}</td>

                                        <td>
                                            <span className={`status-tag status-${(shop.status || '').toLowerCase()}`}>
                                                {(shop.status || 'N/A').toUpperCase()}
                                            </span>
                                        </td>

                                        <td className="action-cell">
                                            <button
                                                onClick={() => toggleStatus(shop.id, shop.status || 'N/A')}
                                                // Nút Khóa/Mở khóa
                                                className={`btn btn-${(shop.status || '').toLowerCase() === "approved" || (shop.status || '').toLowerCase() === "active" ? "danger" : "success"}`}
                                            >
                                                {(shop.status || '').toLowerCase() === "approved" || (shop.status || '').toLowerCase() === "active" ? "Khóa" : "Mở khóa"}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </>
            )}
        </div>
    );
}