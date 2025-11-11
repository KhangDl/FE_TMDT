import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ShopInfo from "./ShopInfo";
import ProductManager from "./ProductManager";
import OrderManager from "./OrderManager";
import StatsPanel from "./StatsPanel";

export default function SellerDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("products");
  const name = localStorage.getItem("name") || "Người bán";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div style={layout}>
      {/* Sidebar trái */}
      <aside style={sidebar}>
        <h2 style={logo}> ShopTMDT</h2>
        <p style={sellerName}> {name}</p>

        <nav style={nav}>
          <button
            onClick={() => setActiveTab("shop")}
            style={activeTab === "shop" ? btnActive : btn}
          >
             Cửa hàng
          </button>
          <button
            onClick={() => setActiveTab("products")}
            style={activeTab === "products" ? btnActive : btn}
          >
             Sản phẩm
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            style={activeTab === "orders" ? btnActive : btn}
          >
             Đơn hàng
          </button>
          <button
            onClick={() => setActiveTab("stats")}
            style={activeTab === "stats" ? btnActive : btn}
          >
             Thống kê
          </button>
        </nav>

        <button onClick={handleLogout} style={logoutBtn}>
           Đăng xuất
        </button>
      </aside>

      {/* Nội dung phải */}
      <main style={content}>
        {activeTab === "shop" && <ShopInfo />}
        {activeTab === "products" && <ProductManager />}
        {activeTab === "orders" && <OrderManager />}
        {activeTab === "stats" && <StatsPanel />}
      </main>
    </div>
  );
}


const layout = {
  display: "flex",
  minHeight: "100vh",
  fontFamily: "Inter, sans-serif",
  background: "#f9fafb",
};

const sidebar = {
  width: "240px",
  background: "#ffffff",
  borderRight: "1px solid #e5e7eb",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  boxShadow: "2px 0 6px rgba(0,0,0,0.05)",
};

const logo = {
  fontSize: "1.4rem",
  fontWeight: "700",
  marginBottom: "15px",
  color: "#1677ff",
};

const sellerName = {
  marginBottom: "20px",
  fontSize: "0.95rem",
  color: "#444",
};

const nav = {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  gap: "8px",
};

const btn = {
  padding: "10px 12px",
  border: "none",
  borderRadius: "6px",
  background: "none",
  textAlign: "left",
  cursor: "pointer",
  fontSize: "0.95rem",
  color: "#333",
  transition: "0.25s",
};

const btnActive = {
  ...btn,
  background: "#1677ff",
  color: "#fff",
  fontWeight: "600",
};

const logoutBtn = {
  marginTop: "auto",
  background: "#ef4444",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  padding: "10px 14px",
  cursor: "pointer",
  fontWeight: "500",
  transition: "0.3s",
};

const content = {
  flex: 1,
  padding: "30px 40px",
  background: "#f9fafb",
  overflowY: "auto",
};
