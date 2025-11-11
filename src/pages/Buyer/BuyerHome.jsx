import React, { useState } from "react";

export default function BuyerHome() {
  // 🔹 Dữ liệu ảo: Danh sách cửa hàng + sản phẩm bên trong
  const [shops] = useState([
    {
      id: 1,
      name: "Cửa hàng Rau Sạch A",
      area: "Đồng Nai",
      logo: "https://i.imgur.com/hX4H0hK.jpeg",
      description: "Chuyên cung cấp rau củ quả tươi mỗi ngày.",
      products: [
        { id: 1, name: "Rau muống", price: 15000, image: "https://i.imgur.com/FZC8v9a.jpeg" },
        { id: 2, name: "Cải ngọt", price: 12000, image: "https://i.imgur.com/f7trVDC.jpeg" },
        { id: 3, name: "Cà chua", price: 10000, image: "https://i.imgur.com/mAVprng.jpeg" },
      ],
    },
    {
      id: 2,
      name: "Cửa hàng Trứng Sạch B",
      area: "Bình Dương",
      logo: "https://i.imgur.com/NKwFQKl.jpeg",
      description: "Trứng sạch, đảm bảo an toàn và tươi mới.",
      products: [
        { id: 4, name: "Trứng gà ta", price: 30000, image: "https://i.imgur.com/Fx8Z3yz.jpeg" },
        { id: 5, name: "Trứng vịt", price: 28000, image: "https://i.imgur.com/FzULWkL.jpeg" },
      ],
    },
  ]);

  const [selectedShop, setSelectedShop] = useState(null);

  return (
    <div style={wrap}>
      {/* Nếu chưa chọn cửa hàng */}
      {!selectedShop ? (
        <>
          <h2 style={title}>🛍️ Cửa hàng trong khu vực</h2>
          <p style={desc}>Chọn cửa hàng để xem sản phẩm.</p>

          <div style={grid}>
            {shops.map((shop) => (
              <div key={shop.id} style={card}>
                <img src={shop.logo} alt="Logo" style={shopLogo} />
                <h3>{shop.name}</h3>
                <p style={{ color: "#666" }}>{shop.description}</p>
                <p style={{ fontSize: "14px" }}>📍 {shop.area}</p>
                <button
                  style={btnBlue}
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
          {/* Khi đã chọn 1 cửa hàng */}
          <button onClick={() => setSelectedShop(null)} style={btnGray}>
            ← Quay lại danh sách
          </button>
          <div style={shopHeader}>
            <img src={selectedShop.logo} alt="Logo" style={shopLogoLarge} />
            <div>
              <h2>{selectedShop.name}</h2>
              <p>{selectedShop.description}</p>
              <p>📍 {selectedShop.area}</p>
            </div>
          </div>

          <h3 style={title}>Sản phẩm của cửa hàng</h3>
          <div style={productGrid}>
            {selectedShop.products.map((p) => (
              <div key={p.id} style={productCard}>
                <img src={p.image} alt={p.name} style={productImg} />
                <h4>{p.name}</h4>
                <p style={{ color: "#555" }}>
                  {p.price.toLocaleString()} ₫
                </p>
                <button style={btnBuy}>Thêm vào giỏ</button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* 🎨 CSS nội bộ (giống style trang người bán để đồng bộ hệ thống) */
const wrap = {
  padding: "30px",
  fontFamily: "Inter, sans-serif",
  background: "#f9fafb",
  minHeight: "100vh",
};

const title = {
  fontSize: "1.6rem",
  marginBottom: "10px",
};

const desc = {
  color: "#666",
  marginBottom: "20px",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
  gap: "20px",
};

const card = {
  background: "#fff",
  padding: "18px",
  borderRadius: "10px",
  boxShadow: "0 3px 8px rgba(0,0,0,0.05)",
  textAlign: "center",
};

const shopLogo = {
  width: "100%",
  height: "160px",
  objectFit: "cover",
  borderRadius: "8px",
  marginBottom: "10px",
};

const btnBlue = {
  background: "#1677ff",
  color: "#fff",
  border: "none",
  padding: "8px 14px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "500",
};

const btnGray = {
  background: "#ddd",
  color: "#333",
  border: "none",
  padding: "8px 14px",
  borderRadius: "6px",
  cursor: "pointer",
  marginBottom: "20px",
};

const shopHeader = {
  display: "flex",
  alignItems: "center",
  gap: "20px",
  background: "#fff",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  marginBottom: "20px",
};

const shopLogoLarge = {
  width: "120px",
  height: "120px",
  objectFit: "cover",
  borderRadius: "10px",
  border: "1px solid #eee",
};

const productGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
  gap: "20px",
};

const productCard = {
  background: "#fff",
  borderRadius: "10px",
  padding: "15px",
  textAlign: "center",
  boxShadow: "0 3px 8px rgba(0,0,0,0.05)",
};

const productImg = {
  width: "100%",
  height: "160px",
  objectFit: "cover",
  borderRadius: "8px",
  marginBottom: "8px",
};

const btnBuy = {
  background: "#16a34a",
  color: "#fff",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer",
};
