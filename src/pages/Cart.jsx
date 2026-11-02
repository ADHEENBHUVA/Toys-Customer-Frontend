import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
    ShoppingBag, ArrowRight, ArrowLeft, Trash2, Plus, Minus, 
    Tag, ShieldCheck, Truck, Sparkles, Lock, PackageCheck 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { usePopup } from '../context/PopupContext';
import toast from 'react-hot-toast';

const Cart = () => {
    const {
        cartItems,
        removeFromCart,
        updateQuantity,
        shippingSettings,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        orderNotes,
        setOrderNotes
    } = useCart();

    const { openConfirm, showSuccess } = usePopup();
    const navigate = useNavigate();

    const [couponCode, setCouponCode] = useState('');
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

    // Calculate subtotal
    const subTotal = cartItems.reduce(
        (acc, item) => acc + Number(item.price || 0) * Number(item.quantity || 1),
        0
    );
    const cartCount = cartItems.reduce((acc, item) => acc + Number(item.quantity || 1), 0);

    // Free shipping calculation
    const freeShippingThreshold = shippingSettings?.freeShippingMinAmount || 500;
    const isFreeShipping = subTotal >= freeShippingThreshold;
    const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subTotal);
    const freeShippingProgress = Math.min(100, Math.round((subTotal / freeShippingThreshold) * 100));

    // Shipping charge
    const shippingCharge = isFreeShipping
        ? 0
        : shippingSettings?.baseShippingCharge ?? 50;

    // Coupon discount calculation
    let discount = 0;
    if (appliedCoupon) {
        if (appliedCoupon.discountType === 'Percentage') {
            discount = (subTotal * appliedCoupon.discountValue) / 100;
        } else {
            discount = appliedCoupon.discountValue;
        }
        if (discount > subTotal) discount = subTotal;
    }

    const grandTotal = Math.max(0, subTotal + shippingCharge - discount);

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

    const handleRemoveItem = (id, name) => {
        openConfirm({
            title: 'Remove Product?',
            message: `Are you sure you want to remove "${name}" from your cart?`,
            confirmText: 'Remove',
            cancelText: 'Keep Item',
            confirmColor: 'red',
            badgeText: 'REMOVE ITEM',
            onConfirm: () => {
                removeFromCart(id);
                showSuccess({
                    title: 'Product Removed 🗑️',
                    message: 'Item has been removed from your cart.',
                    badgeText: 'REMOVED',
                    triggerConfetti: false
                });
            }
        });
    };

    const handleProceedToCheckout = () => {
        if (cartItems.length === 0) {
            toast.error('Your cart is empty!');
            return;
        }
        // Direct navigation to Checkout page - NO login blocking here!
        navigate('/checkout');
    };

    const getImageUrl = (item) => {
        const img = item.images?.[0] || item.thumbnailImage || item.image;
        if (!img) return 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=300&q=80';
        if (img.startsWith('http') || img.startsWith('data:')) return img;
        const base = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5001';
        return `${base}${img.startsWith('/') ? '' : '/'}${img}`;
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[70vh] bg-[#FBF9F5] flex flex-col justify-center items-center px-4 py-20 text-center font-sans">
                <div className="w-24 h-24 rounded-3xl bg-rose-50 text-[#E51A22] flex items-center justify-center mb-6 shadow-xs border border-rose-100">
                    <ShoppingBag className="w-12 h-12" />
                </div>
                <h1 className="text-3xl font-black text-[#1A1A24] mb-2 tracking-tight">Your Cart is Empty</h1>
                <p className="text-slate-500 text-sm max-w-md mb-8 leading-relaxed">
                    Looks like you haven't added any toys yet. Explore our vibrant, child-safe, developmental toys!
                </p>
                <Link
                    to="/products"
                    className="inline-flex items-center gap-2 bg-[#E51A22] hover:bg-[#c9141b] text-white font-bold text-sm px-8 py-3.5 rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-95"
                >
                    <ArrowLeft className="w-4 h-4" /> Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FBF9F5] font-sans pb-24">
            {/* Top Header Bar */}
            <div className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
                <div className="max-w-[1300px] mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link to="/" className="text-xl font-black text-[#1A1A24] hover:text-[#E51A22] transition-colors">
                            Little Joys <span className="text-[#E51A22]">Toys</span>
                        </Link>
                        <span className="text-slate-300">/</span>
                        <h2 className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                            <ShoppingBag className="w-4 h-4 text-[#E51A22]" /> Shopping Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})
                        </h2>
                    </div>

                    <Link to="/products" className="text-xs font-bold text-slate-600 hover:text-[#E51A22] flex items-center gap-1 transition-colors">
                        <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-[1300px] mx-auto px-4 sm:px-6 pt-8">
                {/* Free Shipping Progress Banner */}
                <div className="mb-8 p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
                    <div className="flex items-center justify-between text-xs sm:text-sm font-bold mb-2">
                        {isFreeShipping ? (
                            <span className="text-emerald-700 flex items-center gap-1.5 font-black">
                                <Sparkles className="w-4 h-4 text-emerald-600" /> 🎉 Congratulations! You've unlocked FREE Shipping!
                            </span>
                        ) : (
                            <span className="text-slate-700">
                                Add <strong className="text-[#E51A22]">₹{amountNeededForFreeShipping.toLocaleString('en-IN')}.00</strong> more to get <strong className="text-emerald-600">FREE Delivery!</strong>
                            </span>
                        )}
                        <span className="text-slate-500 font-semibold">{freeShippingProgress}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all duration-500 ${isFreeShipping ? 'bg-emerald-500' : 'bg-[#E51A22]'}`}
                            style={{ width: `${freeShippingProgress}%` }}
                        />
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* LEFT COLUMN: Cart Items Table */}
                    <div className="w-full lg:w-[65%] flex flex-col gap-4">
                        <div className="bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xs">
                            <h3 className="text-lg font-black text-[#1A1A24] mb-4 pb-3 border-b border-slate-100">
                                Products in Cart
                            </h3>

                            <div className="flex flex-col divide-y divide-slate-100">
                                {cartItems.map((item) => {
                                    const qty = Number(item.quantity || 1);
                                    const price = Number(item.price || 0);

                                    return (
                                        <div key={item._id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                            {/* Thumbnail + Title */}
                                            <div className="flex items-center gap-4 min-w-0 flex-1">
                                                <Link to={`/product/${item.productId || item._id}`} className="shrink-0">
                                                    <img
                                                        src={getImageUrl(item)}
                                                        alt={item.name}
                                                        className="w-20 h-20 object-cover rounded-xl border border-slate-100 bg-slate-50"
                                                        onError={(e) => {
                                                            e.target.src = 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=300&q=80';
                                                        }}
                                                    />
                                                </Link>
                                                <div className="min-w-0">
                                                    <Link
                                                        to={`/product/${item.productId || item._id}`}
                                                        className="text-sm sm:text-base font-bold text-[#1A1A24] hover:text-[#E51A22] transition-colors line-clamp-2 block leading-snug"
                                                    >
                                                        {item.name}
                                                    </Link>
                                                    <span className="text-xs text-slate-500 font-semibold block mt-1">
                                                        ₹{price.toLocaleString('en-IN')}.00 each
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Quantity + Subtotal + Remove */}
                                            <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0">
                                                {/* Quantity Selector */}
                                                <div className="inline-flex items-center border border-slate-200 rounded-xl bg-slate-50/80 p-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => updateQuantity(item._id, qty - 1)}
                                                        disabled={qty <= 1}
                                                        className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:text-black font-bold disabled:opacity-40 cursor-pointer shadow-2xs"
                                                    >
                                                        <Minus className="w-3.5 h-3.5" />
                                                    </button>
                                                    <span className="w-8 text-center text-xs font-black text-slate-800">
                                                        {qty}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => updateQuantity(item._id, qty + 1)}
                                                        className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:text-black font-bold cursor-pointer shadow-2xs"
                                                    >
                                                        <Plus className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>

                                                {/* Total line item price */}
                                                <div className="text-right min-w-[90px]">
                                                    <span className="text-sm sm:text-base font-black text-[#1A1A24] block">
                                                        ₹{(price * qty).toLocaleString('en-IN')}.00
                                                    </span>
                                                </div>

                                                {/* Remove Button */}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveItem(item._id, item.name)}
                                                    className="text-slate-400 hover:text-[#E51A22] p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                                                    title="Remove item"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Order Notes Field */}
                            <div className="mt-6 pt-5 border-t border-slate-100">
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                    Special Instructions / Order Notes (Optional)
                                </label>
                                <textarea
                                    value={orderNotes || ''}
                                    onChange={(e) => setOrderNotes(e.target.value)}
                                    placeholder="Add any landmark instructions or gift packaging note..."
                                    rows="2"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#E51A22] focus:bg-white transition-all resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Order Summary Box */}
                    <div className="w-full lg:w-[35%] sticky top-24">
                        <div className="bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl p-6 sm:p-7 shadow-sm">
                            <h3 className="text-lg font-black text-[#1A1A24] pb-4 border-b border-slate-100 mb-5">
                                Order Summary
                            </h3>

                            {/* Coupon Code Section */}
                            <div className="mb-5 pb-5 border-b border-slate-100">
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
                                            placeholder="ENTER PROMO CODE"
                                            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs uppercase font-bold focus:outline-none focus:border-[#E51A22] focus:bg-white transition-all tracking-wider"
                                        />
                                        <button
                                            type="submit"
                                            disabled={isApplyingCoupon || !couponCode.trim()}
                                            className="px-4 py-2.5 bg-[#1A1A24] text-white rounded-xl text-xs font-bold hover:bg-[#E51A22] transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
                                        >
                                            {isApplyingCoupon ? '...' : 'Apply'}
                                        </button>
                                    </form>
                                )}
                            </div>

                            {/* Price Breakdown */}
                            <div className="space-y-3 text-xs sm:text-sm">
                                <div className="flex justify-between text-slate-600">
                                    <span>Subtotal ({cartCount} {cartCount === 1 ? 'item' : 'items'})</span>
                                    <span className="font-bold text-[#1A1A24]">₹{subTotal.toLocaleString('en-IN')}.00</span>
                                </div>

                                {appliedCoupon && (
                                    <div className="flex justify-between text-emerald-600 font-medium">
                                        <span>Discount ({appliedCoupon.code})</span>
                                        <span className="font-bold">-₹{discount.toLocaleString('en-IN')}.00</span>
                                    </div>
                                )}

                                <div className="flex justify-between text-slate-600">
                                    <span>Estimated Shipping</span>
                                    <span className="font-bold text-[#1A1A24]">
                                        {shippingCharge === 0 ? (
                                            <span className="text-emerald-600 font-black">FREE</span>
                                        ) : (
                                            `₹${shippingCharge.toFixed(2)}`
                                        )}
                                    </span>
                                </div>

                                {/* Grand Total */}
                                <div className="pt-4 border-t border-slate-200 flex justify-between items-baseline text-base sm:text-lg font-black text-[#1A1A24]">
                                    <span>Total Amount</span>
                                    <span className="text-2xl font-black text-[#E51A22] tracking-tight">
                                        ₹{grandTotal.toLocaleString('en-IN')}.00
                                    </span>
                                </div>
                                <p className="text-[11px] text-slate-400 text-right">All taxes &amp; duties included</p>
                            </div>

                            {/* Proceed to Checkout Button - Goes directly to /checkout (No login popup upfront!) */}
                            <button
                                type="button"
                                onClick={handleProceedToCheckout}
                                className="w-full mt-6 bg-[#E51A22] hover:bg-[#c9141b] active:scale-[0.99] text-white py-4 rounded-xl font-black text-sm sm:text-base transition-all shadow-md shadow-red-500/20 hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer group"
                            >
                                <span>Proceed to Checkout</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>

                            <p className="text-[11.5px] text-slate-500 font-medium text-center mt-3">
                                🔒 Delivery details are entered next. Login is only required at final payment step.
                            </p>

                            {/* Trust Guarantees */}
                            <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col gap-2.5 text-[11.5px] text-slate-500 font-medium">
                                <div className="flex items-center gap-2 text-slate-600">
                                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                    <span>100% Safe &amp; Verified Checkout</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-600">
                                    <Truck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                    <span>Fast delivery across India</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
