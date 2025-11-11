import React, { useState } from "react";
import api from "../../services/api";
import "../../css/Home.css";
import { useNavigate } from "react-router-dom";


export default function Home() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();


  // Điều khiển 3 modal
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showCreateShop, setShowCreateShop] = useState(false);

  // Form đăng nhập
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

  // Form đăng ký người mua
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  // Form tạo cửa hàng (dành cho người chưa có tài khoản)
  const [sellerForm, setSellerForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    area: "",
    shopName: "",
    shopDescription: "",
    logo: "",
  });

  // Xử lý đăng nhập
  const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMsg("");

  try {
    const res = await api.post("/auth/login", loginForm);
    const { token, role } = res.data;

    // ✅ Lưu token và role
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);

    setMsg("✅ Đăng nhập thành công!");

    // ✅ Chuyển trang theo vai trò
    setTimeout(() => {
      if (role === "admin") navigate("/admin/dashboard");
      else if (role === "seller") navigate("/seller/dashboard");
      else navigate("/buyer/home");
    }, 800);
  } catch (err) {
    setMsg(err.response?.data || "❌ Đăng nhập thất bại!");
  } finally {
    setLoading(false);
    setShowLogin(false);
  }
};


  // Xử lý đăng ký người mua
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      await api.post("/auth/register", registerForm);
      setMsg("✅ Đăng ký thành công! Vui lòng đăng nhập.");
      setShowRegister(false);
      setShowLogin(true);
    } catch (err) {
      setMsg(err.response?.data || "❌ Đăng ký thất bại!");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý tạo cửa hàng + tài khoản seller
  const handleCreateShop = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      await api.post("/auth/register-seller", sellerForm);
      setMsg("✅ Đăng ký & tạo cửa hàng thành công! Vui lòng chờ admin duyệt.");
      setShowCreateShop(false);
    } catch (err) {
      setMsg(err.response?.data || "❌ Không thể tạo cửa hàng!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-wrap">
      {/* Header */}
      <header className="home-header">
        <div className="brand">🛍️ AN KHANG BÌNH VƯỢNG SHOP</div>
        <nav className="nav">
          <button className="btn ghost" onClick={() => setShowLogin(true)}>
            Đăng nhập
          </button>
          <button className="btn primary" onClick={() => setShowRegister(true)}>
            Đăng ký người mua
          </button>
          <button className="btn seller" onClick={() => setShowCreateShop(true)}>
             Tạo cửa hàng
          </button>
        </nav>
      </header>

      {/* Hero section */}
      <section className="hero">
        <h1>Kết nối người bán nhỏ lẻ với khách hàng quanh bạn</h1>
        <p>
          Bán hàng dễ dàng, mua sắm thuận tiện — nền tảng thương mại điện tử cộng đồng.
        </p>
        <button className="btn big" onClick={() => setShowCreateShop(true)}>
          🏪 Trở thành người bán ngay hôm nay
        </button>
      </section>

      <footer className="home-footer">
        © {new Date().getFullYear()} ShopTMDT • Cộng đồng bán hàng địa phương
      </footer>

      {/* Thông báo */}
      {msg && (
        <div className="toast" onClick={() => setMsg("")}>
          {msg}
        </div>
      )}

      {/* ========== Modal Đăng nhập ========== */}
      {showLogin && (
        <div className="modal-backdrop" onClick={() => setShowLogin(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>🔐 Đăng nhập</h3>
            <form onSubmit={handleLogin} className="form">
              <label>Email</label>
              <input
                type="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                required
              />
              <label>Mật khẩu</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                required
              />
              <button className="btn primary" disabled={loading}>
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========== Modal Đăng ký người mua ========== */}
      {showRegister && (
        <div className="modal-backdrop" onClick={() => setShowRegister(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>📝 Đăng ký người mua</h3>
            <form onSubmit={handleRegister} className="form">
              <label>Họ và tên</label>
              <input
                value={registerForm.name}
                onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                required
              />
              <label>Email</label>
              <input
                type="email"
                value={registerForm.email}
                onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                required
              />
              <label>Mật khẩu</label>
              <input
                type="password"
                value={registerForm.password}
                onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                required
              />
              <label>Số điện thoại</label>
              <input
                value={registerForm.phone}
                onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
              />
              <label>Địa chỉ</label>
              <input
                value={registerForm.address}
                onChange={(e) => setRegisterForm({ ...registerForm, address: e.target.value })}
              />
              <button className="btn primary" disabled={loading}>
                {loading ? "Đang đăng ký..." : "Tạo tài khoản"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========== Modal Tạo cửa hàng + tài khoản seller ========== */}
      {showCreateShop && (
        <div className="modal-backdrop" onClick={() => setShowCreateShop(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>🏪 Đăng ký tài khoản người bán & tạo cửa hàng</h3>
            <form onSubmit={handleCreateShop} className="form">
              <label>Họ và tên</label>
              <input
                value={sellerForm.name}
                onChange={(e) => setSellerForm({ ...sellerForm, name: e.target.value })}
                required
              />
              <label>Email</label>
              <input
                type="email"
                value={sellerForm.email}
                onChange={(e) => setSellerForm({ ...sellerForm, email: e.target.value })}
                required
              />
              <label>Mật khẩu</label>
              <input
                type="password"
                value={sellerForm.password}
                onChange={(e) => setSellerForm({ ...sellerForm, password: e.target.value })}
                required
              />
              <label>Số điện thoại</label>
              <input
                value={sellerForm.phone}
                onChange={(e) => setSellerForm({ ...sellerForm, phone: e.target.value })}
              />
              <label>Địa chỉ</label>
              <input
                value={sellerForm.address}
                onChange={(e) => setSellerForm({ ...sellerForm, address: e.target.value })}
              />
              <label>Khu vực</label>
              <input
                value={sellerForm.area}
                onChange={(e) => setSellerForm({ ...sellerForm, area: e.target.value })}
              />
              <hr />
              <label>Tên cửa hàng</label>
              <input
                value={sellerForm.shopName}
                onChange={(e) => setSellerForm({ ...sellerForm, shopName: e.target.value })}
                required
              />
              <label>Mô tả cửa hàng</label>
              <input
                value={sellerForm.shopDescription}
                onChange={(e) =>
                  setSellerForm({ ...sellerForm, shopDescription: e.target.value })
                }
              />
              <label>Logo (URL)</label>
              <input
                value={sellerForm.logo}
                onChange={(e) => setSellerForm({ ...sellerForm, logo: e.target.value })}
              />

              <button className="btn primary" disabled={loading}>
                {loading ? "Đang xử lý..." : "Đăng ký & tạo cửa hàng"}
              </button>
            </form>
          </div>
        </div>  
      )}
    </div>
  );
}
