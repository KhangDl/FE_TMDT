// src/App.js (Đã sửa)

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext.jsx';
import Home from "./pages/Customer/Home.jsx";
// Giả định bạn có component LoginPage để đăng nhập
import LoginModal from "./pages/Auth/Login.jsx";
import NotFound from "./pages/Customer/NotFound.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";
import SellerDashboard from "./pages/Seller/SellerDashboard.jsx";
import CheckoutPage from './pages/Buyer/CheckoutPage';
import { CartProvider } from './hooks/useCart.jsx'; 
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ProfilePage from "./pages/Profile/ProfilePage.jsx";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            
            {/* Thêm Route cho trang Đăng nhập */}
            <Route path="/login" element={<LoginModal />} />

            {/* ⭐️ ROUTE ĐÃ BẢO VỆ CHÍNH XÁC ⭐️ */}
            <Route 
              path="/checkout" 
              element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Các Route khác */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/seller/dashboard" element={<SellerDashboard />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;