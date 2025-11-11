import React, { useState } from "react";

export default function OrderManager() {
  // 🔹 Dữ liệu đơn hàng ảo (backend giả lập)
  const [orders, setOrders] = useState([
    {
      id: 1,
      customer: "Nguyễn Văn A",
      products: [
        { name: "Rau muống", price: 15000, quantity: 2 },
        { name: "Cà chua", price: 12000, quantity: 1 },
      ],
      shop: "Cửa hàng Rau Sạch A",
      total: 42000,
      status: "pending",
      date: "2025-10-26",
    },
    {
      id: 2,
      customer: "Trần Thị B",
      products: [{ name: "Trứng gà ta", price: 30000, quantity: 1 }],
      shop: "Cửa hàng Trứng Sạch B",
      total: 30000,
      status: "shipping",
      date: "2025-10-25",
    },
    {
      id: 3,
      customer: "Lê Hoàng C",
      products: [
        { name: "Cải ngọt", price: 10000, quantity: 3 },
        { name: "Củ cải trắng", price: 18000, quantity: 1 },
      ],
      shop: "Cửa hàng Rau Sạch A",
      total: 48000,
      status: "completed",
      date: "2025-10-24",
    },
  ]);

  // 🔹 Cập nhật trạng thái đơn hàng
  const updateStatus = (id, newStatus) => {
    const updated = orders.map((o) =>
      o.id === id ? { ...o, status: newStatus } : o
    );
    setOrders(updated);
  };

  // 🔹 Màu trạng thái
  const statusColor = (status) => {
    switch (status) {
      case "pending":
        return "#eab308"; // vàng
      case "shipping":
        return "#3b82f6"; // xanh dương
      case "completed":
        return "#16a34a"; // xanh lá
      case "cancelled":
        return "#dc2626"; // đỏ
      default:
        return "#6b7280"; // xám
    }
  };

  return (
    <div style={wrap}>
      <h2 style={title}>Quản lý đơn hàng</h2>
      <p style={desc}>
        Tại đây bạn có thể theo dõi tình trạng các đơn hàng và thay đổi trạng thái giao hàng.
      </p>

      <table style={table}>
        <thead>
          <tr style={{ background: "#f3f4f6" }}>
            <th style={th}>Mã đơn</th>
            <th style={th}>Khách hàng</th>
            <th style={th}>Sản phẩm</th>
            <th style={th}>Tổng tiền</th>
            <th style={th}>Cửa hàng</th>
            <th style={th}>Ngày đặt</th>
            <th style={th}>Trạng thái</th>
            <th style={th}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} style={row}>
              <td style={td}>#{o.id}</td>
              <td style={td}>{o.customer}</td>
              <td style={td}>
                {o.products.map((p, i) => (
                  <div key={i}>
                    {p.name} ({p.quantity} x {p.price.toLocaleString()}₫)
                  </div>
                ))}
              </td>
              <td style={td}>{o.total.toLocaleString()}₫</td>
              <td style={td}>{o.shop}</td>
              <td style={td}>{o.date}</td>
              <td style={{ ...td, color: statusColor(o.status), fontWeight: 600 }}>
                {o.status === "pending"
                  ? "Chờ xác nhận"
                  : o.status === "shipping"
                  ? "Đang giao"
                  : o.status === "completed"
                  ? "Hoàn tất"
                  : "Đã hủy"}
              </td>
              <td style={td}>
                {o.status === "pending" && (
                  <>
                    <button
                      style={btnBlue}
                      onClick={() => updateStatus(o.id, "shipping")}
                    >
                      Xác nhận
                    </button>
                    <button
                      style={btnRed}
                      onClick={() => updateStatus(o.id, "cancelled")}
                    >
                      Hủy
                    </button>
                  </>
                )}
                {o.status === "shipping" && (
                  <button
                    style={btnGreen}
                    onClick={() => updateStatus(o.id, "completed")}
                  >
                    Hoàn tất
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* 🎨 CSS nội bộ */
const wrap = {
  padding: "20px",
  fontFamily: "Inter, sans-serif",
  color: "#333",
};

const title = {
  fontSize: "1.5rem",
  marginBottom: "8px",
};

const desc = {
  marginBottom: "20px",
  color: "#555",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  background: "#fff",
  borderRadius: "8px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  overflow: "hidden",
};

const th = {
  textAlign: "left",
  padding: "10px",
  borderBottom: "1px solid #eee",
  fontWeight: "600",
  fontSize: "0.9rem",
};

const td = {
  padding: "10px",
  borderBottom: "1px solid #f1f1f1",
  verticalAlign: "top",
  fontSize: "0.9rem",
};

const row = {
  background: "#fff",
};

const btnBlue = {
  background: "#3b82f6",
  color: "#fff",
  border: "none",
  padding: "6px 10px",
  borderRadius: "6px",
  marginRight: "6px",
  cursor: "pointer",
};

const btnGreen = {
  background: "#16a34a",
  color: "#fff",
  border: "none",
  padding: "6px 10px",
  borderRadius: "6px",
  cursor: "pointer",
};

const btnRed = {
  background: "#dc2626",
  color: "#fff",
  border: "none",
  padding: "6px 10px",
  borderRadius: "6px",
  cursor: "pointer",
};
