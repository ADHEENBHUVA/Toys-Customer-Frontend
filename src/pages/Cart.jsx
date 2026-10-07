import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { X, ShoppingBag, ArrowRight, Truck, CheckCircle2, Ticket, Trash2 } from 'lucide-react';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal, calculateShipping, shippingSettings, appliedCoupon, applyCoupon, removeCoupon } = useCart();
    const [coupon, setCoupon] = useState('');
    const [applying, setApplying] = useState(false);
    
    const shipping = calculateShipping();
    const subTotal = getCartTotal();
    
    let discount = 0;
    if (appliedCoupon) {
        if (appliedCoupon.discountType === 'Percentage') {
            discount = (subTotal * appliedCoupon.discountValue) / 100;
        } else {
            discount = appliedCoupon.discountValue;
        }
        if (discount > subTotal) discount = subTotal;
    }

    const total = subTotal + shipping - discount;

    const handleApplyCoupon = async () => {
        if (!coupon) return;
        setApplying(true);
        const res = await applyCoupon(coupon, subTotal);
        if (res.success) {
            setCoupon('');
        }
        setApplying(false);
    };

    const handleQuantityChange = (id, currentQty, delta) => {
        const newQty = currentQty + delta;
        if (newQty > 0) {
            updateQuantity(id, newQty);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-20 min-h-[70vh] flex flex-col justify-center items-center">
                <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-sm border border-slate-100">
                    <ShoppingBag className="w-12 h-12 text-slate-300" />
                </div>
                <h3 className="text-3xl font-black text-slate-800 mb-3 tracking-tight">Your cart is empty</h3>
                <p className="text-slate-500 font-medium mb-8 max-w-md text-center">Looks like you haven't added any toys to your cart yet. Discover our latest arrivals and find something special!</p>
                <Link to="/products" className="bg-[#2eb3a6] hover:bg-[#26978c] text-white py-3.5 px-8 rounded-full font-bold transition-all hover:shadow-lg hover:shadow-[#2eb3a6]/20 hover:-translate-y-0.5 active:scale-95 flex items-center gap-2">
                    Start Shopping <ArrowRight className="w-5 h-5" />
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-10 md:py-16">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-[14px] mb-8 font-medium">
                <Link to="/" className="text-slate-500 hover:text-[#2eb3a6] transition-colors">Home</Link>
                <span className="text-slate-300">/</span>
                <span className="text-slate-800 font-bold">Shopping Cart</span>
            </div>

            <div className="flex flex-col lg:flex-row gap-10">
                {/* Left Side: Cart Items */}
                <div className="w-full lg:w-2/3 flex flex-col gap-6">
                    {/* Header & Shipping Banner */}
                    <div className="flex flex-col gap-4">
                        <h1 className="text-4xl font-black text-slate-800 tracking-tight">
                            Your Cart <span className="text-slate-400 text-2xl font-bold ml-2">({cartItems.length} items)</span>
                        </h1>
                        
                        {shippingSettings && shippingSettings.isFreeShippingActive && shipping > 0 && (
                            <div className="bg-indigo-50 border border-indigo-100 text-indigo-700 px-5 py-4 rounded-2xl text-[15px] font-medium flex items-center gap-3 shadow-sm">
                                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
                                    <Truck className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div>
                                    {shippingSettings.freeShippingMinAmount > 0 && (
                                        <span>Add <strong className="font-black text-indigo-900">₹{(shippingSettings.freeShippingMinAmount - subTotal).toFixed(2)}</strong> more for Free Shipping!</span>
                                    )}
                                    {shippingSettings.freeShippingMinAmount > 0 && shippingSettings.freeShippingMinItems > 0 && <span className="mx-2">or</span>}
                                    {shippingSettings.freeShippingMinItems > 0 && (
                                        <span>Add <strong className="font-black text-indigo-900">{shippingSettings.freeShippingMinItems - cartItems.length}</strong> more item(s) for Free Shipping!</span>
                                    )}
                                </div>
                            </div>
                        )}
                        {shippingSettings && shippingSettings.isFreeShippingActive && shipping === 0 && (
                            <div className="bg-[#f0fdf4] border border-[#bbf7d0] text-[#166534] px-5 py-4 rounded-2xl text-[15px] font-medium flex items-center gap-3 shadow-sm">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                                </div>
                                <span>Congratulations! You've unlocked <strong className="font-black text-green-800">Free Shipping!</strong></span>
                            </div>
                        )}
                    </div>

                    {/* Cart Items List */}
                    <div className="bg-white border border-slate-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                        {/* Desktop Header */}
                        <div className="hidden md:grid grid-cols-12 gap-4 bg-slate-50/80 border-b border-slate-100 py-4 px-6 font-bold text-slate-500 text-xs uppercase tracking-wider">
                            <div className="col-span-6">Product details</div>
                            <div className="col-span-2 text-center">Quantity</div>
                            <div className="col-span-2 text-right">Price</div>
                            <div className="col-span-2 text-right">Total</div>
                        </div>

                        <div className="divide-y divide-slate-100">
                            {cartItems.map(item => (
                                <div key={item._id} className="flex flex-col md:grid md:grid-cols-12 gap-4 md:gap-6 items-start md:items-center p-4 md:p-6 group hover:bg-slate-50/50 transition-colors relative border-b border-slate-100 last:border-0 md:border-none">
                                    
                                    {/* Mobile Premium Layout wrapper (visible on mobile, wraps image and details) */}
                                    <div className="flex w-full gap-4 md:col-span-6 md:gap-5 md:items-center">
                                        <Link to={`/product/${item._id}`} className="w-24 h-24 sm:w-28 sm:h-28 border border-slate-100 rounded-2xl flex items-center justify-center p-2 shrink-0 bg-white group-hover:border-slate-200 transition-colors">
                                            <img 
                                                src={item.thumbnailImage || (item.images && item.images[0]) || '/placeholder.png'} 
                                                alt={item.name} 
                                                className="w-full h-full object-contain"
                                            />
                                        </Link>
                                        <div className="flex flex-col flex-1 py-1 relative">
                                            <div className="flex justify-between items-start gap-2">
                                                <Link to={`/product/${item._id}`} className="font-bold text-slate-800 text-[15px] sm:text-[16px] hover:text-[#2eb3a6] transition-colors leading-tight line-clamp-2">
                                                    {item.name}
                                                </Link>
                                                {/* Mobile Remove Button */}
                                                <button 
                                                    onClick={() => removeFromCart(item._id)} 
                                                    className="md:hidden w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0 -mt-1 -mr-2"
                                                    title="Remove item"
                                                >
                                                    <Trash2 className="w-[16px] h-[16px]" />
                                                </button>
                                            </div>
                                            <span className="text-xs font-medium text-slate-400 mt-1 hidden md:block">ID: {item._id.substring(0, 8)}</span>
                                            
                                            <div className="mt-auto pt-3 flex items-center justify-between">
                                                <div className="font-black text-slate-800 text-[16px]">
                                                    ₹{item.price.toFixed(2)}
                                                </div>
                                                {/* Mobile Quantity Selector */}
                                                <div className="md:hidden flex items-center bg-slate-50 border border-slate-200 rounded-full overflow-hidden h-8 w-20">
                                                    <button onClick={() => handleQuantityChange(item._id, item.quantity, -1)} className="w-1/3 h-full flex items-center justify-center text-slate-500 hover:bg-slate-100 font-bold">-</button>
                                                    <span className="w-1/3 h-full flex items-center justify-center font-bold text-slate-800 text-[12px]">{item.quantity}</span>
                                                    <button onClick={() => handleQuantityChange(item._id, item.quantity, 1)} className="w-1/3 h-full flex items-center justify-center text-slate-500 hover:bg-slate-100 font-bold">+</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Desktop Quantity & Remove */}
                                    <div className="hidden md:flex col-span-2 justify-center items-center">
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-full overflow-hidden h-10 w-28 group-hover:bg-white group-hover:border-slate-300 transition-colors">
                                                <button onClick={() => handleQuantityChange(item._id, item.quantity, -1)} className="w-1/3 h-full flex items-center justify-center text-slate-500 hover:bg-slate-100 font-bold">-</button>
                                                <span className="w-1/3 h-full flex items-center justify-center font-bold text-slate-800 text-[14px]">{item.quantity}</span>
                                                <button onClick={() => handleQuantityChange(item._id, item.quantity, 1)} className="w-1/3 h-full flex items-center justify-center text-slate-500 hover:bg-slate-100 font-bold">+</button>
                                            </div>
                                            <button onClick={() => removeFromCart(item._id)} className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100" title="Remove item">
                                                <Trash2 className="w-[18px] h-[18px]" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Unit Price (Desktop) */}
                                    <div className="hidden md:block col-span-2 text-right">
                                        <div className="font-bold text-slate-500 text-[15px]">
                                            ₹{item.price.toFixed(2)}
                                        </div>
                                    </div>

                                    {/* Total (Desktop) */}
                                    <div className="hidden md:block col-span-2 text-right">
                                        <div className="font-black text-slate-800 text-[16px]">
                                            ₹{(item.price * item.quantity).toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Actions Below Table */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
                        <Link to="/products" className="text-slate-500 hover:text-slate-800 font-bold text-[15px] transition-colors flex items-center gap-2 px-2 py-1">
                            <ArrowRight className="w-4 h-4 rotate-180" /> Continue Shopping
                        </Link>
                    </div>
                </div>

                {/* Right Side: Order Summary */}
                <div className="w-full lg:w-1/3">
                    <div className="bg-slate-50/80 border border-slate-100 rounded-3xl p-6 lg:p-8 sticky top-32">
                        <h2 className="text-2xl font-black text-slate-800 mb-6 tracking-tight">Order Summary</h2>
                        
                        {/* Coupon Input */}
                        <div className="mb-8">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 pl-1">Discount Code</label>
                            {appliedCoupon ? (
                                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                                    <div className="flex items-center gap-2 text-green-700 font-bold">
                                        <Ticket className="w-4 h-4" />
                                        {appliedCoupon.code}
                                    </div>
                                    <button onClick={removeCoupon} className="text-green-600 hover:text-green-800 transition-colors text-xs font-bold">
                                        Remove
                                    </button>
                                </div>
                            ) : (
                                <div className="flex relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Ticket className="w-4 h-4 text-slate-400" />
                                    </div>
                                    <input 
                                        type="text" 
                                        placeholder="Enter coupon code" 
                                        value={coupon}
                                        onChange={(e) => setCoupon(e.target.value)}
                                        className="w-full bg-white border border-slate-200 rounded-xl rounded-r-none pl-10 pr-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#2eb3a6]/20 focus:border-[#2eb3a6] text-slate-800 placeholder-slate-400 font-medium transition-all"
                                    />
                                    <button 
                                        onClick={handleApplyCoupon}
                                        disabled={applying}
                                        className="bg-slate-800 hover:bg-slate-900 text-white px-5 py-3 rounded-xl rounded-l-none font-bold text-[14px] transition-colors shrink-0 border border-slate-800 disabled:opacity-50"
                                    >
                                        {applying ? 'Applying...' : 'Apply'}
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4 mb-6 pb-6 border-b border-slate-200/80">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-500 font-medium text-[15px]">Subtotal</span>
                                <span className="font-bold text-slate-800 text-[15px]">₹{subTotal.toFixed(2)}</span>
                            </div>
                            {appliedCoupon && (
                                <div className="flex justify-between items-center text-green-600">
                                    <span className="font-medium text-[15px]">Discount ({appliedCoupon.code})</span>
                                    <span className="font-bold text-[15px]">-₹{discount.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center">
                                <span className="text-slate-500 font-medium text-[15px]">Shipping</span>
                                <span className="font-bold text-slate-800 text-[15px]">
                                    {shipping === 0 ? <span className="text-[#2eb3a6] bg-[#2eb3a6]/10 px-2 py-0.5 rounded-md text-xs uppercase tracking-wider">Free</span> : `₹${shipping.toFixed(2)}`}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-500 font-medium text-[15px]">Tax</span>
                                <span className="font-bold text-slate-800 text-[15px]">Calculated at checkout</span>
                            </div>
                        </div>
                        
                        <div className="flex justify-between items-end mb-8">
                            <div className="flex flex-col">
                                <span className="text-slate-500 font-bold text-[13px] uppercase tracking-wider mb-1">Estimated Total</span>
                                <span className="text-xs text-slate-400 font-medium">Includes taxes</span>
                            </div>
                            <span className="font-black text-slate-800 text-3xl">₹{total.toFixed(2)}</span>
                        </div>
                        
                        <Link to="/checkout" className="w-full bg-[#2eb3a6] hover:bg-[#26978c] text-white text-center font-bold text-[16px] py-4 rounded-xl transition-all shadow-lg shadow-[#2eb3a6]/20 hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 group">
                            Proceed to Checkout
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        {/* Trust Badges */}
                        <div className="mt-6 flex flex-col gap-3">
                            <div className="flex items-center gap-2 text-slate-500 text-[13px] font-medium justify-center">
                                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                Secure encrypted checkout
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
