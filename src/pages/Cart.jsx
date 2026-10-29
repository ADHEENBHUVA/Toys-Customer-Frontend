import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
    const { openCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        // Automatically open the Right-side Cart Drawer
        openCart();
        
        // Redirect back so user stays on their active page with drawer open
        if (window.history.length > 2) {
            navigate(-1, { replace: true });
        } else {
            navigate('/', { replace: true });
        }
    }, [openCart, navigate]);

    return null;
};

export default Cart;
