import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, Tag, ShoppingBag, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { usePopup } from '../context/PopupContext';

const CartDrawer = () => {
    const {
        cartItems,
        removeFromCart,
        updateQuantity,
        getCartTotal,
        getCartCount,
        isCartOpen,
        closeCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        shippingSettings
    } = useCart();

    const { showSuccess, openConfirm } = usePopup();

    const navigate = useNavigate();
    const [couponCode, setCouponCode] = useState('');
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
    const [isDiscountOpen, setIsDiscountOpen] = useState(false);
    const drawerRef = React.useRef(null);

    // Handle Escape key when drawer is open (without locking body scroll, allowing dashboard to scroll)
    useEffect(() => {
        if (!isCartOpen) return;
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') closeCart();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isCartOpen, closeCart]);

    // Prevent wheel scroll inside CartDrawer from propagating to the Dashboard background
    useEffect(() => {
        const drawerEl = drawerRef.current;
        if (!drawerEl || !isCartOpen) return;

        const handleWheel = (e) => {
            const scrollable = drawerEl.querySelector('.cart-custom-scroll');
            if (!scrollable) {
                e.preventDefault();
                return;
            }

            const { scrollTop, scrollHeight, clientHeight } = scrollable;
            const deltaY = e.deltaY;
            const isUp = deltaY < 0;
            const isDown = deltaY > 0;

            // When at top or bottom, prevent the scroll event from leaking out to Dashboard
            if ((isUp && scrollTop <= 0) || (isDown && scrollTop + clientHeight >= scrollHeight - 1)) {
                e.preventDefault();
            }
        };

        drawerEl.addEventListener('wheel', handleWheel, { passive: false });
        return () => {
            drawerEl.removeEventListener('wheel', handleWheel);
        };
    }, [isCartOpen]);

    const subTotal = getCartTotal();
    const cartCount = getCartCount();

    // Free shipping calculation threshold (default ₹500 or from settings)
    const freeShippingThreshold = shippingSettings?.freeShippingMinAmount || 500;
    const isFreeShipping = subTotal >= freeShippingThreshold;
    const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subTotal);
    const freeShippingProgress = Math.min(100, Math.round((subTotal / freeShippingThreshold) * 100));

    // Calculate discount
    let discount = 0;
    if (appliedCoupon) {
        if (appliedCoupon.discountType === 'Percentage') {
            discount = (subTotal * appliedCoupon.discountValue) / 100;
        } else {
            discount = appliedCoupon.discountValue;
        }
        if (discount > subTotal) discount = subTotal;
    }

    const estimatedTotal = Math.max(0, subTotal - discount);

    const handleApplyCoupon = async (e) => {
        e?.preventDefault();
        if (!couponCode.trim()) return;
        setIsApplyingCoupon(true);
        const res = await applyCoupon(couponCode.trim(), subTotal);
        if (res.success) {
            setCouponCode('');
        }
        setIsApplyingCoupon(false);
    };

    const handleCheckout = () => {
        closeCart();
        navigate('/checkout');
    };

    const getImageUrl = (item) => {
        const img = item.images?.[0] || item.thumbnailImage || item.image;
        if (!img) return 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=300&q=80';
        if (img.startsWith('http') || img.startsWith('data:')) return img;
        const base = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5001';
        return `${base}${img.startsWith('/') ? '' : '/'}${img}`;
    };

    return (
        <AnimatePresence>
            {isCartOpen && (
                <div className="fixed inset-0 z-[120] flex justify-end font-sans pointer-events-none">
                    {/* CSS: Hide scrollbar on Dashboard while allowing it to scroll, and visible scrollbar in Cart */}
                    <style>{`
                        html.cart-open, body.cart-open {
                            scrollbar-width: none !important;
                            -ms-overflow-style: none !important;
                        }
                        html.cart-open::-webkit-scrollbar, body.cart-open::-webkit-scrollbar {
                            display: none !important;
                            width: 0 !important;
                            height: 0 !important;
                        }
                        .cart-custom-scroll {
                            scrollbar-width: thin;
                            scrollbar-color: #cbd5e1 #f8fafc;
                            overscroll-behavior: contain;
                        }
                        .cart-custom-scroll::-webkit-scrollbar {
                            width: 6px;
                            display: block !important;
                        }
                        .cart-custom-scroll::-webkit-scrollbar-track {
                            background: #f8fafc;
                            border-radius: 9999px;
                        }
                        .cart-custom-scroll::-webkit-scrollbar-thumb {
                            background: #cbd5e1;
                            border-radius: 9999px;
                        }
                        .cart-custom-scroll::-webkit-scrollbar-thumb:hover {
                            background: #94a3b8;
                        }
                    `}</style>

                    {/* On mobile: transparent click-away backdrop to close cart */}
                    <motion.div 
                        key="cart-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={closeCart}
                        className="fixed inset-0 bg-transparent lg:hidden cursor-pointer z-10 pointer-events-auto"
                    />

                    {/* Slide-over Drawer Panel: Docked on the right, matching 2nd image */}
                    <motion.aside 
                        ref={drawerRef}
                        key="cart-drawer-panel"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                        className="relative w-full sm:w-[460px] xl:w-[480px] bg-white h-full shadow-2xl border-l border-slate-200/90 flex flex-col z-20 overscroll-contain pointer-events-auto"
                    >
                        {/* 1. Unique Header */}
                        <div className="px-6 py-4 border-b border-slate-100 bg-white/95 backdrop-blur-sm shrink-0">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-full bg-rose-50 text-[#E51A22] flex items-center justify-center">
                                        <ShoppingBag className="w-4 h-4 stroke-[2.2]" />
                                    </div>
                                    <h2 className="text-xl font-black text-[#1A1A24] tracking-tight">Your Cart</h2>
                                    <span className="bg-[#E51A22] text-white text-[11px] font-black px-2 py-0.5 rounded-full shadow-xs">
                                        {cartCount}
                                    </span>
                                </div>

                                <button 
                                    onClick={closeCart}
                                    aria-label="Close cart"
                                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-all cursor-pointer hover:rotate-90 duration-200"
                                >
                                    <X className="w-4 h-4" strokeWidth={2.5} />
                                </button>
                            </div>

                            {/* Free Shipping Dynamic Progress Pill */}
                            {cartItems.length > 0 && (
                                <div className="mt-3 bg-[#FAFBFD] border border-slate-100 rounded-xl p-2.5">
                                    <div className="flex items-center justify-between text-[11.5px] font-bold text-slate-700 mb-1.5">
                                        {isFreeShipping ? (
                                            <span className="text-emerald-600 flex items-center gap-1">
                                                <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-600 text-white" />
                                                Unlocked Free Delivery!
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1">
                                                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                                Add ₹{amountNeededForFreeShipping.toFixed(0)} more for Free Shipping
                                            </span>
                                        )}
                                        <span className="text-slate-400 font-semibold">{freeShippingProgress}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-200/80 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full transition-all duration-500 rounded-full ${isFreeShipping ? 'bg-emerald-500' : 'bg-[#E51A22]'}`}
                                            style={{ width: `${freeShippingProgress}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 2. Scrollable Body with Visible Custom Scrollbar */}
                        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 cart-custom-scroll">
                            {cartItems.length === 0 ? (
                                <div className="py-24 flex flex-col items-center justify-center text-center">
                                    <div className="w-20 h-20 rounded-full bg-rose-50 text-[#E51A22] flex items-center justify-center mb-4 shadow-sm">
                                        <ShoppingBag className="w-9 h-9 stroke-[1.8]" />
                                    </div>
                                    <h3 className="text-lg font-black text-slate-800 mb-1">Your cart is empty</h3>
                                    <p className="text-xs text-slate-500 mb-6 max-w-xs leading-relaxed font-medium">
                                        Looks like you haven't added any toys yet. Start exploring our magical collection!
                                    </p>
                                    <button
                                        onClick={() => {
                                            closeCart();
                                            navigate('/products');
                                        }}
                                        className="px-6 py-2.5 bg-[#1A1A24] hover:bg-[#E51A22] text-white text-xs font-black rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer"
                                    >
                                        Discover Toys
                                    </button>
                                </div>
                            ) : (
                                cartItems.map((item) => {
                                    const unitPrice = Number(item.price || 0);
                                    const qty = Number(item.quantity || 1);
                                    const lineTotal = unitPrice * qty;

                                    return (
                                        <div 
                                            key={item._id} 
                                            className="bg-[#FAFBFD] hover:bg-white rounded-2xl p-3.5 border border-slate-100 hover:border-slate-200 hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)] transition-all duration-200 flex gap-3.5 items-start group"
                                        >
                                            {/* Thumbnail */}
                                            <div className="w-20 h-20 rounded-xl bg-white border border-slate-200/80 p-1 overflow-hidden shrink-0 shadow-2xs">
                                                <img 
                                                    src={getImageUrl(item)} 
                                                    alt={item.name}
                                                    className="w-full h-full object-cover object-center rounded-lg group-hover:scale-105 transition-transform duration-300"
                                                    onError={(e) => {
                                                        e.target.src = 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=300&q=80';
                                                    }}
                                                />
                                            </div>

                                            {/* Product Details */}
                                            <div className="flex-1 min-w-0 flex flex-col">
                                                <div className="flex justify-between items-start gap-2">
                                                    <h4 className="text-[14px] font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-[#E51A22] transition-colors">
                                                        {item.name}
                                                    </h4>
                                                    <span className="text-[14.5px] font-black text-slate-900 whitespace-nowrap">
                                                        ₹{lineTotal.toLocaleString('en-IN')}.00
                                                    </span>
                                                </div>

                                                {/* Variant / Category details */}
                                                <div className="text-[11.5px] text-slate-400 font-semibold mt-1 flex items-center gap-1.5">
                                                    <span>{item.ageGroup ? `Age: ${Array.isArray(item.ageGroup) ? item.ageGroup[0] : item.ageGroup}` : (item.category || 'Toy')}</span>
                                                    <span>•</span>
                                                    <span className="text-slate-600 font-medium">₹{unitPrice.toLocaleString('en-IN')}.00 each</span>
                                                </div>

                                                {/* Controls: [ - 1 + ] Pill and Trash icon */}
                                                <div className="flex items-center justify-between gap-3 mt-3 pt-2 border-t border-slate-100/80">
                                                    <div className="inline-flex items-center bg-white border border-slate-200 rounded-full px-1.5 py-0.5 shadow-2xs">
                                                        <button
                                                            type="button"
                                                            onClick={() => updateQuantity(item._id, qty - 1)}
                                                            className="w-6 h-6 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 active:scale-90 transition-all cursor-pointer"
                                                            aria-label="Decrease quantity"
                                                        >
                                                            <Minus className="w-3 h-3 stroke-[2.5]" />
                                                        </button>
                                                        <span className="w-6 text-center text-xs font-black text-slate-800 select-none">
                                                            {qty}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => updateQuantity(item._id, qty + 1)}
                                                            className="w-6 h-6 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 active:scale-90 transition-all cursor-pointer"
                                                            aria-label="Increase quantity"
                                                        >
                                                            <Plus className="w-3 h-3 stroke-[2.5]" />
                                                        </button>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            openConfirm({
                                                                title: 'Remove from Cart?',
                                                                message: `Are you sure you want to remove "${item.name}" from your cart?`,
                                                                confirmText: 'Remove Item',
                                                                cancelText: 'Keep in Cart',
                                                                confirmColor: 'red',
                                                                badgeText: 'REMOVE ITEM',
                                                                onConfirm: () => {
                                                                    removeFromCart(item._id);
                                                                    showSuccess({
                                                                        title: 'Item Removed 🗑️',
                                                                        message: `"${item.name}" has been removed from your cart.`,
                                                                        badgeText: 'REMOVED',
                                                                        triggerConfetti: false
                                                                    });
                                                                }
                                                            });
                                                        }}
                                                        className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                                                        title="Remove item"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* 3. Bottom Fixed / Non-Scrolling Section */}
                        {cartItems.length > 0 && (
                            <div className="border-t border-slate-200 bg-white/95 backdrop-blur-md px-6 pt-2 pb-5 relative shrink-0 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] z-20">
                                {/* Discount Accordion - Directly above Estimated Total */}
                                <div className="mb-3">
                                    <div className="py-2">
                                        <button 
                                            type="button"
                                            onClick={() => setIsDiscountOpen(prev => !prev)}
                                            className="w-full flex items-center justify-between text-left text-[13px] font-bold text-slate-800 hover:text-[#E51A22] transition-colors cursor-pointer group"
                                        >
                                            <span className="flex items-center gap-2">
                                                <Tag className="w-3.5 h-3.5 text-[#E51A22]" />
                                                Have a promo code?
                                            </span>
                                            <span className="w-5 h-5 flex items-center justify-center text-slate-500 group-hover:text-[#E51A22]">
                                                {isDiscountOpen ? (
                                                    <Minus className="w-3.5 h-3.5" strokeWidth={2.2} />
                                                ) : (
                                                    <Plus className="w-3.5 h-3.5" strokeWidth={2.2} />
                                                )}
                                            </span>
                                        </button>

                                        {isDiscountOpen && (
                                            <div className="mt-2.5 space-y-2 animate-fadeIn">
                                                {appliedCoupon ? (
                                                    <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3.5 py-2.5 rounded-xl text-xs">
                                                        <div className="flex items-center gap-2 text-emerald-800 font-bold">
                                                            <Tag className="w-3.5 h-3.5" />
                                                            <span>{appliedCoupon.code}</span>
                                                            <span className="text-emerald-600 font-normal">
                                                                (-₹{discount.toFixed(0)})
                                                            </span>
                                                        </div>
                                                        <button 
                                                            type="button"
                                                            onClick={removeCoupon}
                                                            className="text-xs text-red-500 hover:underline font-bold cursor-pointer"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                                                        <input 
                                                            type="text"
                                                            value={couponCode}
                                                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                                            placeholder="ENTER COUPON CODE"
                                                            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs uppercase font-bold focus:outline-none focus:border-[#E51A22] focus:bg-white transition-all tracking-wide"
                                                        />
                                                        <button 
                                                            type="submit"
                                                            disabled={isApplyingCoupon || !couponCode.trim()}
                                                            className="px-4 py-2 bg-[#1A1A24] text-white rounded-xl text-xs font-bold hover:bg-[#E51A22] transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
                                                        >
                                                            {isApplyingCoupon ? '...' : 'Apply'}
                                                        </button>
                                                    </form>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Estimated total row (with ₹ Rupees symbol!) */}
                                <div className="flex items-center justify-between text-[#1A1A24] mb-1 pt-2 border-t border-slate-100">
                                    <span className="text-base font-bold text-slate-800">Estimated total</span>
                                    <span className="text-xl font-black text-slate-950 tracking-tight">
                                        ₹{estimatedTotal.toLocaleString('en-IN')}.00
                                    </span>
                                </div>

                                {/* Tax & shipping note */}
                                <p className="text-xs text-slate-500 font-medium leading-relaxed mb-4">
                                    Duties and taxes included. Shipping is calculated at checkout.
                                </p>

                                {/* Check out CTA Button */}
                                <button
                                    type="button"
                                    onClick={handleCheckout}
                                    className="w-full bg-[#1A1A24] hover:bg-[#E51A22] active:scale-[0.99] text-white text-[15px] font-black py-3.5 rounded-xl shadow-md hover:shadow-xl hover:shadow-red-500/20 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer group"
                                >
                                    <span>Check out</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>

                                {/* Micro trust badges */}
                                <div className="mt-3 flex items-center justify-center gap-3 text-[11px] font-semibold text-slate-400">
                                    <span className="flex items-center gap-1">
                                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                                        100% Safe Checkout
                                    </span>
                                    <span>•</span>
                                    <span>Easy Returns</span>
                                </div>
                            </div>
                        )}
                    </motion.aside>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CartDrawer;
