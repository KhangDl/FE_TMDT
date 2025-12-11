import React, { createContext, useState, useEffect, useContext } from 'react';

// Tạo Context
const AuthContext = createContext({
    isAuthenticated: false,
    userName: "",
    userRole: "",
    login: () => {},
    logout: () => {},
});

// Hook tùy chỉnh để sử dụng Context
export const useAuth = () => useContext(AuthContext);

// Provider Component
export const AuthProvider = ({ children }) => {
    // 1. Khởi tạo trạng thái từ localStorage
    const [isAuthenticated, setIsAuthenticated] = useState(
        !!localStorage.getItem("token")
    );
    const [userName, setUserName] = useState(
        localStorage.getItem("userName") || ""
    );
    const [userRole, setUserRole] = useState(
        localStorage.getItem("role") || ""
    );
    const [loading, setLoading] = useState(true); // Thêm state loading để xử lý kiểm tra ban đầu

    // Giả lập quá trình kiểm tra token/khởi tạo ban đầu
    useEffect(() => {
        // Có thể thêm logic kiểm tra token hợp lệ qua API ở đây nếu cần
        setLoading(false); 
    }, []);

    // 2. Hàm Login và Logout
    const login = (token, role, name) => {
        // Lưu vào localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("userName", name);
        
        // Cập nhật State
        setIsAuthenticated(true);
        setUserName(name);
        setUserRole(role);
    };

    const logout = () => {
        // Xóa khỏi localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userName");

        // Cập nhật State
        setIsAuthenticated(false);
        setUserName("");
        setUserRole("");
    };

    const value = {
        isAuthenticated,
        userName,
        userRole,
        login,
        logout,
        loading // Truyền trạng thái loading
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};