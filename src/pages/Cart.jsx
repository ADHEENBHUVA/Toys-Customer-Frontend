import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal, getCartCount, shippingSettings, calculateShipping } = useCart();
    const shipping = calculateShipping();
    const subTotal = getCartTotal();
    const total = subTotal + shipping;
    
    // Calculate progress towards free shipping if applicable
    let freeShippingMessage = null;
    let progressPercent = 0;
    
    if (shippingSettings && shippingSettings.isFreeShippingActive && shipping > 0) {
        const minAmount = shippingSettings.freeShippingMinAmount || 0;
        const minItems = shippingSettings.freeShippingMinItems || 0;

        const amountNeeded = minAmount > 0 ? Math.max(0, minAmount - subTotal) : 0;
        const itemsNeeded = minItems > 0 ? Math.max(0, minItems - getCartCount()) : 0;

        if (amountNeeded > 0 && itemsNeeded > 0) {
            freeShippingMessage = `Add ₹${amountNeeded.toFixed(2)} and ${itemsNeeded} more item${itemsNeeded > 1 ? 's' : ''} for FREE Shipping!`;
            const amountProgress = (subTotal / minAmount) * 100;
            const itemsProgress = (getCartCount() / minItems) * 100;
            progressPercent = Math.min(100, (amountProgress + itemsProgress) / 2);
        } else if (amountNeeded > 0) {
            freeShippingMessage = `Add ₹${amountNeeded.toFixed(2)} more for FREE Shipping!`;
            progressPercent = Math.min(100, (subTotal / minAmount) * 100);
        } else if (itemsNeeded > 0) {
            freeShippingMessage = `Add ${itemsNeeded} more item${itemsNeeded > 1 ? 's' : ''} for FREE Shipping!`;
            progressPercent = Math.min(100, (getCartCount() / minItems) * 100);
        }
    }

    const handleQuantityChange = (id, currentQty, delta) => {
        const newQty = currentQty + delta;
        if (newQty > 0) {
            updateQuantity(id, newQty);
        }
    };

    return (
        <div className="bg-slate-50/50 min-h-screen pt-10 pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-[#1D4ED8] text-white rounded-full flex items-center justify-center font-black text-xl shadow-lg shadow-red-200">
                        {getCartCount()}
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight font-['Nunito']">Your Magic Cart</h1>
                </div>

                {freeShippingMessage && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-6 shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-emerald-700 font-bold text-sm">✨ {freeShippingMessage}</span>
                        </div>
                        <div className="w-full bg-emerald-100 rounded-full h-2.5">
                            <div className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
                        </div>
                    </div>
                )}

                <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-slate-100">
                    {cartItems.length === 0 ? (
                        <div className="text-center py-12">
                            <span className="text-6xl mb-4 grayscale opacity-50 block">🛒</span>
                            <h3 className="text-2xl font-black text-slate-700 mb-2 font-['Nunito']">Your cart is empty</h3>
                            <p className="text-slate-500 font-medium mb-6">Looks like you haven't added any magic toys yet.</p>
                            <Link to="/products" className="bg-blue-50 text-blue-700 py-3 px-8 rounded-xl font-bold hover:bg-blue-100 transition-colors inline-block">
                                Explore Toys
                            </Link>
                        </div>
                    ) : (
                        <>
                            {cartItems.map(item => (
                                <div key={item._id} className="flex flex-col md:flex-row items-center justify-between border-b border-slate-100 pb-6 mb-6 gap-4">
                                    <div className="flex items-center gap-4 w-full md:w-auto">
                                        <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center overflow-hidden shadow-inner border border-slate-100 flex-shrink-0">
                                            {item.thumbnailImage || (item.images && item.images[0]) ? (
                                                <img src={item.thumbnailImage || item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-3xl">🧸</span>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-extrabold text-xl text-slate-800 font-['Nunito']">{item.name}</h3>
                                            <p className="text-slate-400 font-bold text-sm">₹{item.price.toFixed(2)} each</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between w-full md:w-auto md:gap-8 mt-4 md:mt-0">
                                        <div className="flex items-center bg-slate-50 rounded-xl border border-slate-200 px-3 py-1 gap-4">
                                            <button onClick={() => handleQuantityChange(item._id, item.quantity, -1)} className="text-slate-500 hover:text-[#1D4ED8] font-bold text-xl px-1">-</button>
                                            <span className="font-bold text-slate-800 w-4 text-center">{item.quantity}</span>
                                            <button onClick={() => handleQuantityChange(item._id, item.quantity, 1)} className="text-slate-500 hover:text-[#1D4ED8] font-bold text-xl px-1">+</button>
                                        </div>
                                        <p className="font-black text-slate-900 text-xl md:text-2xl w-auto md:w-24 text-right">₹{(item.price * item.quantity).toFixed(2)}</p>
                                        <button onClick={() => removeFromCart(item._id)} className="w-10 h-10 rounded-full bg-red-50 text-red-500 hover:bg-[#1D4ED8] hover:text-white flex items-center justify-center transition-all ml-2 md:ml-4">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                            
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mt-8">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-slate-500 font-bold">Subtotal</span>
                                    <span className="text-slate-800 font-bold">₹{subTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-slate-500 font-bold">Shipping</span>
                                    <span className={shipping === 0 ? "text-emerald-500 font-bold" : "text-slate-800 font-bold"}>
                                        {shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                                    <span className="text-xl font-bold text-slate-500">Total:</span>
                                    <span className="text-3xl font-black text-slate-900 font-['Nunito']">₹{total.toFixed(2)}</span>
                                </div>
                            </div>
                            
                            <Link to="/checkout" className="mt-8 w-full bg-gradient-to-r from-[#1D4ED8] to-[#3B82F6] text-white py-4 rounded-xl font-black text-xl flex items-center justify-center hover:shadow-[0_10px_20px_rgba(198,26,40,0.3)] hover:-translate-y-1 transition-all">
                                Proceed to Checkout →
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Cart;
