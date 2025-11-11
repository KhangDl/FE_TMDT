import React from "react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "100px",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "80px", color: "#ff4d4f", marginBottom: "10px" }}>
        404
      </h1>
      <h2 style={{ color: "#333", marginBottom: "10px" }}>
        Trang bạn tìm không tồn tại 😢
      </h2>
      <p style={{ color: "#777", marginBottom: "30px" }}>
        Có thể đường dẫn đã bị thay đổi hoặc bạn nhập sai địa chỉ.
      </p>

      <button
        onClick={() => navigate("/")}
        style={{
          backgroundColor: "#1677ff",
          color: "white",
          border: "none",
          padding: "10px 20px",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        ⬅️ Quay lại trang chủ
      </button>
    </div>
  );
}
