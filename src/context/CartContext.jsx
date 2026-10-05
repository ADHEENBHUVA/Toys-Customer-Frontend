import React, { createContext, useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('magic_toys_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const [waitlistItems, setWaitlistItems] = useState(() => {
        try {
            const savedWaitlist = localStorage.getItem('magic_toys_waitlist');
            return savedWaitlist ? JSON.parse(savedWaitlist) : [];
        } catch (error) {
            return [];
        }
    });

    const [shippingSettings, setShippingSettings] = useState({
        baseShippingCharge: 50,
        isFreeShippingActive: true,
        freeShippingMinAmount: 1000,
        freeShippingMinItems: 0
    });

    const [appliedCoupon, setAppliedCoupon] = useState(null);

    const [websiteSettings, setWebsiteSettings] = useState({
        discountDisplayType: 'amount'
    });

    useEffect(() => {
        localStorage.setItem('magic_toys_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        localStorage.setItem('magic_toys_waitlist', JSON.stringify(waitlistItems));
    }, [waitlistItems]);

    // Removed coupon localStorage persistence

    useEffect(() => {
        const fetchShippingSettings = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/shipping`);
                if (res.ok) {
                    const data = await res.json();
                    setShippingSettings(data);
                }
            } catch (err) {
                console.error("Error fetching shipping settings:", err);
            }
        };
        const fetchWebsiteSettings = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/settings`);
                if (res.ok) {
                    const data = await res.json();
                    if(data) setWebsiteSettings(data);
                }
            } catch (err) {
                console.error("Error fetching website settings:", err);
            }
        };
        fetchShippingSettings();
        fetchWebsiteSettings();
    }, []);

    const calculateShipping = () => {
        const subTotal = getCartTotal();
        const itemCount = getCartCount();
        
        if (!shippingSettings.isFreeShippingActive) {
            return shippingSettings.baseShippingCharge;
        }

        const minAmount = shippingSettings.freeShippingMinAmount || 0;
        const minItems = shippingSettings.freeShippingMinItems || 0;

        if (minAmount === 0 && minItems === 0) {
            return shippingSettings.baseShippingCharge;
        }

        const amountMet = minAmount === 0 || subTotal >= minAmount;
        const itemsMet = minItems === 0 || itemCount >= minItems;

        if (amountMet && itemsMet) {
            return 0;
        }

        return shippingSettings.baseShippingCharge;
    };

    const addToCart = (product) => {
        const existingItem = cartItems.find(item => item._id === product._id);
        if (existingItem) {
            toast.success('Added another to your cart!');
            setCartItems(prev => prev.map(item => 
                item._id === product._id 
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            toast.success('Added to your magic cart!');
            setCartItems(prev => [...prev, { ...product, quantity: 1 }]);
        }
    };

    const removeFromCart = (id) => {
        setCartItems(prev => prev.filter(item => item._id !== id));
        toast.success('Removed from cart');
    };

    const updateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) return;
        setCartItems(prev => 
            prev.map(item => 
                item._id === id 
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
        setAppliedCoupon(null);
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getCartCount = () => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    };

    const toggleWaitlist = (product) => {
        const currentWaitlist = Array.isArray(waitlistItems) ? waitlistItems : [];
        const exists = currentWaitlist.find(item => item._id === product._id);
        if (exists) {
            setWaitlistItems(prev => Array.isArray(prev) ? prev.filter(item => item._id !== product._id) : []);
            toast.success('Removed from waitlist!');
        } else {
            setWaitlistItems(prev => Array.isArray(prev) ? [...prev, product] : [product]);
            toast.success('Added to waitlist!');
        }
    };

    const getWaitlistCount = () => {
        return Array.isArray(waitlistItems) ? waitlistItems.length : 0;
    };

    const applyCoupon = async (code, subTotal) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/coupons/validate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code, subTotal })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setAppliedCoupon(data.data);
                toast.success('Coupon applied successfully!');
                return { success: true };
            } else {
                toast.error(data.message || 'Invalid coupon code');
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Error applying coupon:', error);
            toast.error('Failed to apply coupon');
            return { success: false, message: 'Server error' };
        }
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
        toast.success('Coupon removed');
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getCartTotal,
            getCartCount,
            shippingSettings,
            calculateShipping,
            waitlistItems,
            toggleWaitlist,
            getWaitlistCount,
            websiteSettings,
            appliedCoupon,
            applyCoupon,
            removeCoupon
        }}>
            {children}
        </CartContext.Provider>
    );
};
