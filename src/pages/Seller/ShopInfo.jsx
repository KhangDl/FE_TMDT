import React, { useState, useEffect } from "react";
import api from "../../services/api"; // Đảm bảo đường dẫn đúng đến api.js
import { Link } from "react-router-dom"; 

export default function ShopInfo() {
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditingLogo, setIsEditingLogo] = useState(false); // Điều khiển việc hiển thị overlay chỉnh sửa
  const [newLogoUrl, setNewLogoUrl] = useState("");

  useEffect(() => {
    fetchShopData();
  }, []);

  const fetchShopData = async () => {
    setLoading(true);
    try {
      const shopRes = await api.get("/Seller/my-shop"); // Đã sửa endpoint theo SellerController
      setShop(shopRes.data);
      setNewLogoUrl(shopRes.data.logo || "");

      const productsRes = await api.get("/products/MyProducts");
      setProducts(productsRes.data);

    } catch (err) {
      console.error("Lỗi khi tải dữ liệu cửa hàng:", err.response?.data || err.message);
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError("Bạn cần đăng nhập với vai trò người bán và có cửa hàng để xem trang này.");
      } else if (err.response?.data?.message) {
        setError(`Lỗi: ${err.response.data.message}`);
      }
       else if (err.response?.status === 404) {
         setError("Cửa hàng của bạn không tồn tại hoặc chưa được duyệt."); // Thông báo cụ thể hơn cho 404
      }
       else {
        setError("Không thể tải thông tin cửa hàng và sản phẩm. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLogo = async () => {
    if (!shop || !newLogoUrl.trim()) return;
    
    if (newLogoUrl.trim() === shop.logo) {
        setIsEditingLogo(false);
        return;
    }

    setLoading(true);
    try {
      const updateData = { logo: newLogoUrl.trim() };
      await api.put("/Seller/my-shop", updateData); // Đã sửa endpoint theo SellerController
      
      setShop(prevShop => ({ ...prevShop, logo: newLogoUrl.trim() }));
      setIsEditingLogo(false);
      setError(""); 
    } catch (err) {
      console.error("Lỗi khi cập nhật logo:", err.response?.data || err.message);
      setError(`Không thể cập nhật logo: ${err.response?.data?.message || 'Lỗi kết nối hoặc quyền truy cập'}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={styles.container}><p>⏳ Đang tải thông tin cửa hàng...</p></div>;
  }

  if (error) {
    return <div style={styles.container}><p style={styles.errorMessage}>🚨 {error}</p></div>;
  }

  if (!shop) {
    return <div style={styles.container}><p>Không tìm thấy thông tin cửa hàng. Vui lòng đảm bảo bạn đã đăng ký cửa hàng.</p></div>;
  }

  return (
    <div style={styles.container}>
      {/* Phần thông tin cửa hàng */}
      <div style={styles.shopHeader}>
        {/* Logo Section */}
        <div style={styles.logoSection}>
          <div 
            style={styles.logoContainer} // Đây là container mới cho hình ảnh và overlay
            onClick={() => setIsEditingLogo(true)} // Click vào hình để mở chỉnh sửa
          >
            <img 
              src={shop.logo || "https://via.placeholder.com/200x200?text=Shop+Logo"} 
              alt="Shop Logo" 
              style={styles.shopLogo} 
            />
            {/* Overlay hiển thị khi đang chỉnh sửa */}
            {isEditingLogo && (
              <div style={styles.logoOverlay}>
                {/* Form hoặc nút chỉnh sửa nằm trong overlay */}
                <div style={styles.logoEditControls}>
                  <input
                    type="text"
                    value={newLogoUrl}
                    onChange={(e) => setNewLogoUrl(e.target.value)}
                    placeholder="Dán URL ảnh logo mới"
                    style={styles.logoInput}
                    // Ngăn chặn sự kiện click lan truyền lên container cha (logoContainer)
                    onClick={(e) => e.stopPropagation()} 
                  />
                  <div style={styles.logoButtons}>
                    <button onClick={handleUpdateLogo} style={{...styles.btnBlue, marginRight: '5px'}}>Lưu</button>
                    <button onClick={(e) => { e.stopPropagation(); setIsEditingLogo(false); }} style={styles.btnGray}>Hủy</button>
                  </div>
                </div>
              </div>
            )}
             {/* Nút "Chỉnh sửa Logo" chỉ hiển thị khi không ở chế độ chỉnh sửa và không có overlay */}
            {!isEditingLogo && (
                <button 
                    onClick={(e) => { e.stopPropagation(); setIsEditingLogo(true); }} // Ngăn click lan lên container
                    style={styles.editLogoButton}
                >
                    Chỉnh sửa
                </button>
            )}
          </div>
        </div>

        {/* Thông tin Text */}
        <div style={styles.shopDetails}>
          <h1 style={styles.shopName}>{shop.name}</h1>
          <p><strong>Mô tả:</strong> {shop.description || "Chưa có mô tả."}</p>
          <p><strong>Khu vực:</strong> {shop.area || "Chưa xác định."}</p>
          <p><strong>Trạng thái:</strong> <span style={shop.status === "Approved" ? styles.statusApproved : styles.statusPending}>
                                          {shop.status === "Approved" ? "Đã duyệt" : shop.status === "Rejected" ? "Từ chối" : "Đang chờ duyệt"}
                                        </span></p>
        </div>
      </div>

      <hr style={styles.divider} />

      {/* Phần sản phẩm */}
      <h2 style={styles.sectionTitle}>Sản phẩm của cửa hàng</h2>
      {products.length === 0 ? (
        <p>Cửa hàng của bạn chưa có sản phẩm nào. <Link to="/seller/products">Thêm ngay</Link>!</p>
      ) : (
        <div style={styles.productList}>
          {products.map((p) => (
            <div key={p.id} style={styles.productCard}>
              <img 
                src={p.image || "https://via.placeholder.com/200x150?text=No+Image"} 
                alt={p.name} 
                style={styles.productImage} 
              />
              <h3 style={styles.productName}>{p.name}</h3>
              <p style={styles.productPrice}>{p.price?.toLocaleString()} ₫</p>
              {/* Thêm link hoặc nút xem chi tiết nếu cần */}
              {/* <Link to={`/products/${p.id}`} style={styles.viewDetailLink}>Xem chi tiết</Link> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------
// --- STYLES (Cần được bổ sung hoặc cập nhật) ---
// ---------------------------
const styles = {
  container: {
    maxWidth: '960px',
    margin: '20px auto',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  errorMessage: {
    color: 'red',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  shopHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
  },
  logoSection: {
    // Không cần flexbox ở đây, vì logoContainer sẽ quản lý vị trí
    marginRight: '30px',
    position: 'relative', // Quan trọng để nút "Chỉnh sửa" được đặt tương đối
  },
  logoContainer: {
    position: 'relative', // Cho phép overlay absolute bên trong
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    overflow: 'hidden', // Quan trọng để các nội dung tràn ra ngoài khung tròn bị cắt
    cursor: 'pointer', // Cho biết đây là một khu vực có thể tương tác
    border: '2px solid #ddd',
    display: 'flex', // Để căn giữa nút chỉnh sửa bên ngoài
    justifyContent: 'center', // Căn giữa nút chỉnh sửa bên ngoài
    alignItems: 'center', // Căn giữa nút chỉnh sửa bên ngoài
  },
  shopLogo: {
    width: '100%', // Hình ảnh lấp đầy container
    height: '100%', // Hình ảnh lấp đầy container
    objectFit: 'cover', // Lấp đầy khung mà không méo
    borderRadius: '50%', // Vẫn giữ hình tròn
    transition: 'opacity 0.3s ease', // Hiệu ứng mờ dần khi overlay xuất hiện
  },
  logoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Nền đen mờ
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center', // Căn giữa nội dung theo chiều dọc
    alignItems: 'center',     // Căn giữa nội dung theo chiều ngang
    zIndex: 10,               // Đảm bảo overlay nằm trên hình ảnh
  },
  logoEditControls: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '80%', // Chiếm 80% chiều rộng overlay
  },
  logoInput: {
    width: '100%',
    padding: '8px',
    marginBottom: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  logoButtons: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
  },
  editLogoButton: { // Style cho nút chỉnh sửa hiển thị bên ngoài
    position: 'absolute',
    bottom: '-35px', // Đặt dưới logo một chút
    // left: '50%', // Căn giữa theo cách truyền thống
    // transform: 'translateX(-50%)', // Dịch chuyển sang trái 50% chiều rộng của chính nó để căn giữa
    padding: '8px 15px',
    backgroundColor: '#f0f0f0',
    color: '#333',
    border: '1px solid #ccc',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px', // Khoảng cách với logo
  },
  shopDetails: {
    flex: 1,
  },
  shopName: {
    fontSize: '2em',
    marginBottom: '10px',
    color: '#333',
  },
  statusApproved: {
    color: 'green',
    fontWeight: 'bold',
  },
  statusPending: {
    color: 'orange',
    fontWeight: 'bold',
  },
  divider: {
    border: '0',
    height: '1px',
    backgroundColor: '#eee',
    margin: '30px 0',
  },
  sectionTitle: {
    fontSize: '1.8em',
    marginBottom: '20px',
    color: '#333',
  },
  productList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '20px',
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    textAlign: 'center',
    paddingBottom: '15px',
  },
  productImage: {
    width: '100%',
    height: '150px',
    objectFit: 'cover',
    marginBottom: '10px',
  },
  productName: {
    fontSize: '1.1em',
    fontWeight: 'bold',
    marginBottom: '5px',
    padding: '0 10px',
  },
  productPrice: {
    fontSize: '1em',
    color: '#e44d26',
    fontWeight: 'bold',
  },
  btnBlue: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '8px 15px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  btnGray: {
    backgroundColor: '#6c757d',
    color: 'white',
    padding: '8px 15px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  }
};