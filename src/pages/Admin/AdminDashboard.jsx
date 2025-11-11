import React from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name") || "Admin";
  
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div style={{ textAlign: "center", padding: "60px 20px" }}>
      <h1>👑 Admin Dashboard</h1>
      <p>Xin chào, <b>{name}</b>!</p>
      <p>Vai trò hiện tại: <b>{role}</b></p>
      <p>Đây là trang dành riêng cho quản trị viên. Bạn có thể quản lý người dùng, cửa hàng và báo cáo thống kê.</p>

      <div style={{ marginTop: 20 }}>
        <button
          onClick={() => navigate("/")}
          style={{
            background: "#1677ff",
            color: "#fff",
            padding: "10px 20px",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          Trang chủ
        </button>
        <button
          onClick={handleLogout}
          style={{
            background: "#ef4444",
            color: "#fff",
            padding: "10px 20px",
            border: "none",
            borderRadius: 8,
            marginLeft: 10,
            cursor: "pointer",
          }}
        >
          Đăng xuất
        </button>
      </div>
    </div>
  );
}
