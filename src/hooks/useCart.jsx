import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Khởi tạo Context
const CartContext = createContext();

// 2. Component Provider (Được export để dùng trong App.js)
export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        try {
            const localCart = localStorage.getItem('cart');
            return localCart ? JSON.parse(localCart) : [];
        } catch (e) {
            console.error("Lỗi khi đọc giỏ hàng từ Local Storage", e);
            return [];
        }
    });

    // Lưu giỏ hàng vào Local Storage mỗi khi cart thay đổi
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const handleAddToCart = (product, quantity = 1) => {
        if (!product || !product.id || !product.name || typeof product.price !== 'number' || product.price === undefined) {
            console.error("Lỗi: Dữ liệu sản phẩm không hợp lệ:", product);
            alert("Lỗi: Không thể thêm sản phẩm vào giỏ hàng do thiếu thông tin sản phẩm.");
            return; 
        }
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                // Tăng số lượng nếu sản phẩm đã có
                return prevCart.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
                );
            } else {
                // Thêm sản phẩm mới
                const newProduct = { 
                    id: product.id, 
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: quantity,
                    shopName: product.shopName || 'Unknown Shop' 
                };
                return [...prevCart, newProduct];
            }
        });
        // ❌ Bỏ alert ở đây, alert sẽ được xử lý trong component gọi hàm
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    };
    
    const updateCartItemQuantity = (id, quantity) => {
        setCart(prevCart => {
            if (quantity <= 0) {
                return prevCart.filter(item => item.id !== id);
            }
            return prevCart.map(item =>
                item.id === id ? { ...item, quantity: quantity } : item
            );
        });
    };
    
    const removeCartItem = (id) => {
        setCart(prevCart => prevCart.filter(item => item.id !== id));
    };

    const clearCart = () => {
        setCart([]);
    }

    const contextValue = { 
        cart, 
        handleAddToCart, 
        updateCartItemQuantity, 
        removeCartItem, 
        calculateTotal,
        clearCart
    };

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
};

// 3. Custom Hook (useCart)
export default function useCart() {
    return useContext(CartContext);
}