import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Customer/Home.jsx";
import NotFound from "./pages/Customer/NotFound.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";
import SellerDashboard from "./pages/Seller/SellerDashboard.jsx";
import BuyerHome from "./pages/Buyer/BuyerHome.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Trang chủ (mặc định, chứa form đăng nhập/đăng ký) */}
        <Route path="/" element={<Home />} />

        {/* Sau đăng nhập sẽ chuyển sang các trang này */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/seller/dashboard" element={<SellerDashboard />} />
        <Route path="/buyer/home" element={<BuyerHome />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
