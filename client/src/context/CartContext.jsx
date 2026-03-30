import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const saved = localStorage.getItem('cartItems');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, qty) => {
        const existItem = cartItems.find((x) => x.id === product.id);

        if (existItem) {
            setCartItems(
                cartItems.map((x) =>
                    x.id === existItem.id ? { ...existItem, quantity: existItem.quantity + qty } : x
                )
            );
        } else {
            setCartItems([...cartItems, { ...product, quantity: qty }]);
        }
    };

    const removeFromCart = (id) => {
        setCartItems(cartItems.filter((x) => x.id !== id));
    };

    const updateQuantity = (id, qty) => {
        setCartItems(
            cartItems.map((x) => (x.id === id ? { ...x, quantity: qty } : x))
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};
