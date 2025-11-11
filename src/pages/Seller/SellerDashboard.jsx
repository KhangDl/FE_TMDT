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
      {/* Sidebar */}
      <aside style={sidebar}>
        <h2 style={logo}>🛍️ ShopTMDT</h2>
        <div style={sellerBox}>
          <div style={avatarCircle}>{name[0]?.toUpperCase()}</div>
          <div>
            <div style={sellerName}>{name}</div>
            <div style={sellerRole}>Người bán hàng</div>
          </div>
        </div>

        <nav style={nav}>
          <button
            onClick={() => setActiveTab("shop")}
            style={activeTab === "shop" ? btnActive : btn}
          >
            🏪 Cửa hàng
          </button>
          <button
            onClick={() => setActiveTab("products")}
            style={activeTab === "products" ? btnActive : btn}
          >
            📦 Sản phẩm
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            style={activeTab === "orders" ? btnActive : btn}
          >
            🧾 Đơn hàng
          </button>
          <button
            onClick={() => setActiveTab("stats")}
            style={activeTab === "stats" ? btnActive : btn}
          >
            📊 Thống kê
          </button>
        </nav>

        <button onClick={handleLogout} style={logoutBtn}>
          🚪 Đăng xuất
        </button>
      </aside>

      {/* Nội dung chính */}
      <main style={content}>
        <header style={header}>
          <h1 style={pageTitle}>
            {activeTab === "shop" && "🏪 Quản lý cửa hàng"}
            {activeTab === "products" && "📦 Quản lý sản phẩm"}
            {activeTab === "orders" && "🧾 Quản lý đơn hàng"}
            {activeTab === "stats" && "📊 Thống kê bán hàng"}
          </h1>
        </header>

        <div style={pageBody}>
          {activeTab === "shop" && <ShopInfo />}
          {activeTab === "products" && <ProductManager />}
          {activeTab === "orders" && <OrderManager />}
          {activeTab === "stats" && <StatsPanel />}
        </div>
      </main>
    </div>
  );
}

/* --- CSS Styles --- */
const layout = {
  display: "flex",
  minHeight: "100vh",
  background: "#f4f6f8",
  fontFamily: "Inter, sans-serif",
};

const sidebar = {
  width: "250px",
  background: "#ffffff",
  borderRight: "1px solid #e5e7eb",
  boxShadow: "2px 0 10px rgba(0,0,0,0.05)",
  display: "flex",
  flexDirection: "column",
  padding: "25px 20px",
};

const logo = {
  fontSize: "1.6rem",
  fontWeight: "700",
  color: "#2563eb",
  marginBottom: "25px",
  textAlign: "center",
};

const sellerBox = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "30px",
};

const avatarCircle = {
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  background: "#2563eb",
  color: "#fff",
  fontWeight: "bold",
  fontSize: "1.1rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const sellerName = {
  fontSize: "1rem",
  fontWeight: "600",
  color: "#111827",
};

const sellerRole = {
  fontSize: "0.85rem",
  color: "#6b7280",
};

const nav = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const btn = {
  padding: "10px 14px",
  border: "none",
  borderRadius: "8px",
  background: "none",
  textAlign: "left",
  cursor: "pointer",
  fontSize: "0.95rem",
  color: "#374151",
  transition: "all 0.25s ease",
};

const btnActive = {
  ...btn,
  background: "#2563eb",
  color: "#fff",
  fontWeight: "600",
  boxShadow: "0 2px 5px rgba(37,99,235,0.3)",
};

const logoutBtn = {
  marginTop: "auto",
  background: "#ef4444",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  padding: "10px 14px",
  cursor: "pointer",
  fontWeight: "600",
  transition: "0.3s",
};

const content = {
  flex: 1,
  padding: "30px 40px",
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  background: "#f9fafb",
};

const header = {
  background: "#fff",
  padding: "20px 30px",
  borderRadius: "12px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  marginBottom: "25px",
};

const pageTitle = {
  fontSize: "1.4rem",
  color: "#1f2937",
  fontWeight: "700",
};

const pageBody = {
  background: "#fff",
  borderRadius: "12px",
  padding: "25px 30px",
  boxShadow: "0 3px 8px rgba(0,0,0,0.05)",
};
