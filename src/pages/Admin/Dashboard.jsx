import React from "react";

export default function Dashboard() {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  return (
    <div style={{ textAlign: "center", marginTop: 80 }}>
      <h1>📊 Trang Dashboard Admin</h1>
      <p>Chào mừng bạn! Vai trò: <b>{role || "Không xác định"}</b></p>
      {token ? (
        <p style={{ color: "green" }}>Đã đăng nhập thành công ✅</p>
      ) : (
        <p style={{ color: "red" }}>Chưa có token đăng nhập ❌</p>
      )}
    </div>
  );
}
