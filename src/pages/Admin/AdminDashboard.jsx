import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ShopManager from "./ShopManager";
import ProductManager from "./ProductManager";
import UserManager from "./UserManager";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("shops");

  const name = localStorage.getItem("name") || "Admin";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div style={layout}>
      {/* Sidebar */}
      <aside style={sidebar}>
        <h2 style={logo}>Admin Panel</h2>
        <p style={adminName}>👑 {name}</p>

        <nav style={nav}>
          <button
            onClick={() => setActiveTab("shops")}
            style={activeTab === "shops" ? btnActive : btn}
          >
            🏪 Quản lý cửa hàng
          </button>

          <button
            onClick={() => setActiveTab("products")}
            style={activeTab === "products" ? btnActive : btn}
          >
            📦 Quản lý sản phẩm
          </button>

          <button
            onClick={() => setActiveTab("users")}
            style={activeTab === "users" ? btnActive : btn}
          >
            👥 Quản lý người dùng
          </button>
        </nav>

        <button onClick={handleLogout} style={logoutBtn}>
          Đăng xuất
        </button>
      </aside>

      {/* Content */}
      <main style={content}>
        {activeTab === "shops" && <ShopManager />}
        {activeTab === "products" && <ProductManager />}
        {activeTab === "users" && <UserManager />}
      </main>
    </div>
  );
}

/* ========= CSS ============= */

const layout = {
  display: "flex",
  minHeight: "100vh",
  fontFamily: "Inter, sans-serif",
  background: "#f3f4f6",
};

const sidebar = {
  width: "260px",
  background: "#111827",
  color: "#fff",
  display: "flex",
  flexDirection: "column",
  padding: "20px",
};

const logo = {
  fontSize: "1.4rem",
  fontWeight: "700",
  marginBottom: "10px",
  color: "#3b82f6",
};

const adminName = {
  marginBottom: "20px",
  fontSize: "1rem",
  color: "#e5e7eb",
};

const nav = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const btn = {
  padding: "12px",
  borderRadius: "6px",
  background: "#1f2937",
  color: "#d1d5db",
  border: "none",
  cursor: "pointer",
  textAlign: "left",
  transition: "0.3s",
};

const btnActive = {
  ...btn,
  background: "#3b82f6",
  color: "#fff",
  fontWeight: "600",
};

const logoutBtn = {
  marginTop: "auto",
  padding: "10px",
  background: "#ef4444",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const content = {
  flex: 1,
  padding: "30px",
};
