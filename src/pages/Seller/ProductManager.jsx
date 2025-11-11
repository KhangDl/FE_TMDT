import React, { useState, useEffect } from "react";
import api from "../../services/api";

export default function ProductManager() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  // ❗ KHUYẾN NGHỊ: Không cần shopId từ localStorage nữa, vì API /MyProducts 
  // dùng JWT Token để đọc ShopId từ Claim
  // const shopId = localStorage.getItem("shopId"); 

  // ✅ Đã sửa: Đồng bộ tên thuộc tính từ imageUrl thành image
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    image: "", // Dùng 'image'
  });

  // Load sản phẩm khi component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // 🔥 SỬA: Dùng API bảo mật /api/products/MyProducts
      // API này sử dụng Token JWT trong Header để xác định ShopId
      const res = await api.get(`/products/MyProducts`);
      setProducts(res.data);
    } catch (error) {
        // Kiểm tra lỗi 401/403 (chưa đăng nhập/chưa có shop)
        if (error.response?.status === 401) {
             setMsg("❌ Phiên đăng nhập hết hạn hoặc bạn chưa được cấp quyền.");
        } else {
             setMsg("❌ Không thể tải danh sách sản phẩm.");
        }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Chuẩn bị dữ liệu gửi đi
      const productData = {
          name: form.name,
          price: parseFloat(form.price), // Đảm bảo là số
          stock: parseInt(form.stock, 10), // Đảm bảo là số nguyên
          description: form.description,
          image: form.image, // Dùng 'image'
      };
      
      if (editing) {
          // PUT (Cập nhật)
          await api.put(`/products/${editing.id}`, productData);
      } else {
          // POST (Tạo mới)
          // Không cần gửi shopId, backend sẽ lấy từ Claim JWT
          await api.post("/products", productData);
      }
      
      setShowModal(false);
      setEditing(null);
      // Reset form sau khi lưu
      setForm({ name: "", price: "", stock: "", description: "", image: "" }); 
      fetchProducts();
      setMsg("✅ Lưu sản phẩm thành công!");
    } catch (error) {
        console.error("Lỗi khi lưu sản phẩm:", error.response?.data || error.message);
        setMsg(`❌ Lỗi khi lưu sản phẩm! (${error.response?.data?.message || error.message})`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
    setLoading(true);
    try {
        await api.delete(`/products/${id}`);
        fetchProducts();
        setMsg("✅ Xóa sản phẩm thành công!");
    } catch {
        setMsg("❌ Lỗi khi xóa sản phẩm!");
    } finally {
        setLoading(false);
    }
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({
      name: p.name,
      price: p.price,
      stock: p.stock,
      description: p.description,
      image: p.image, // ✅ Đã sửa: Dùng p.image
    });
    setShowModal(true);
  };

  // Hàm để đóng modal và reset form/editing state
  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
    setForm({ name: "", price: "", stock: "", description: "", image: "" });
  };


  return (
    <div style={{ padding: 20 }}>
      <h2>📦 Quản lý sản phẩm</h2>
      <button onClick={() => setShowModal(true)} style={btnBlue}>
        ➕ Thêm sản phẩm
      </button>
      {/* ⚠️ Hiển thị lỗi hoặc thông báo (nếu có) */}
      {msg && <div style={toast}>{msg}</div>}

      {loading && products.length === 0 ? (
        <p>⏳ Đang tải...</p>
      ) : products.length === 0 ? (
        <p>Hiện tại không có sản phẩm nào. Vui lòng thêm sản phẩm mới.</p>
      ) : (
        <table style={table}>
          <thead>
            <tr>
              <th>Tên</th>
              <th>Giá</th>
              <th>Tồn kho</th>
              <th>Mô tả</th>
              <th>Ảnh</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                {/* Đảm bảo p.price là số trước khi format */}
                <td>{p.price ? p.price.toLocaleString() : 0} ₫</td>
                <td>{p.stock}</td>
                <td>{p.description}</td>
                <td>
                  {/* ✅ Đã sửa: Dùng p.image */}
                  <img
                    src={p.image || "https://via.placeholder.com/60"}
                    alt={p.name}
                    width="60"
                    height="60"
                    style={{ borderRadius: 6 }}
                  />
                </td>
                <td>
                  <button onClick={() => openEdit(p)} style={btnGray}>
                    Sửa
                  </button>
                  <button onClick={() => handleDelete(p.id)} style={btnRed}>
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* 🧾 Modal thêm / sửa */}
      {showModal && (
        <div style={backdrop}>
          <div style={modal}>
            <h3>{editing ? "✏️ Sửa sản phẩm" : "➕ Thêm sản phẩm"}</h3>
            <form onSubmit={handleSave}>
              <input
                placeholder="Tên sản phẩm"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={input}
                required
              />
              <input
                type="number"
                placeholder="Giá"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                style={input}
                required
              />
              <input
                type="number"
                placeholder="Tồn kho"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                style={input}
                required // Thêm required vì Stock là non-nullable
              />
              <textarea
                placeholder="Mô tả"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                style={{...input, minHeight: 80}}
              />
              <input
                placeholder="Ảnh (URL)"
                value={form.image} // ✅ Đã sửa: Dùng form.image
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                style={input}
              />
              <button type="submit" style={btnBlue} disabled={loading}>
                {loading ? "Đang xử lý..." : editing ? "Lưu thay đổi" : "Thêm mới"}
              </button>
              <button type="button" onClick={closeModal} style={btnGray} disabled={loading}>
                Hủy
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* 🎨 CSS nội bộ */
const table = { width: "100%", borderCollapse: "collapse", marginTop: 20 };
const btnBlue = { background: "#1677ff", color: "#fff", border: "none", padding: "8px 12px", borderRadius: 5, marginRight: 6, cursor: "pointer" };
const btnGray = { background: "#ddd", border: "none", padding: "8px 12px", borderRadius: 5, marginRight: 6, cursor: "pointer" };
const btnRed = { background: "#ef4444", color: "#fff", border: "none", padding: "8px 12px", borderRadius: 5, cursor: "pointer" };
const backdrop = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 };
const modal = { background: "#fff", padding: "20px", borderRadius: "10px", width: "400px", zIndex: 1001, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' };
const input = { width: "100%", padding: "10px", marginBottom: "12px", border: "1px solid #ccc", borderRadius: "6px", boxSizing: 'border-box' };
const toast = { position: "fixed", bottom: 20, right: 20, background: "#111", color: "#fff", padding: "10px 16px", borderRadius: 8, zIndex: 1002 };