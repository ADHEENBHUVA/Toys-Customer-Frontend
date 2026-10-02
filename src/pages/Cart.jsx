import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { X } from 'lucide-react';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal, calculateShipping, shippingSettings } = useCart();
    const [coupon, setCoupon] = useState('');
    const shipping = calculateShipping();
    const subTotal = getCartTotal();
    const total = subTotal + shipping; // Could add coupon logic here if needed

    const handleQuantityChange = (id, currentQty, delta) => {
        const newQty = currentQty + delta;
        if (newQty > 0) {
            updateQuantity(id, newQty);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="max-w-[1200px] mx-auto px-4 py-16 text-center font-['Outfit'] min-h-[50vh] flex flex-col justify-center items-center">
                <span className="text-6xl mb-4 grayscale opacity-50 block">🛒</span>
                <h3 className="text-3xl font-black text-slate-800 mb-4" style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", "Comic Neue", cursive' }}>Your cart is empty</h3>
                <p className="text-slate-500 font-medium mb-8">Looks like you haven't added any products yet.</p>
                <Link to="/products" className="bg-[#1282a2] hover:bg-[#0f6c87] text-white py-3 px-8 rounded-full font-bold transition-colors">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-[1200px] mx-auto px-4 py-10 font-['Outfit']">
            {/* Breadcrumb */}
            <div className="text-[14px] mb-8 font-medium">
                <span className="text-[#2e4053] font-bold">Home</span>
                <span className="text-slate-400 mx-2">/</span>
                <span className="text-[#1282a2]">Your shopping cart</span>
            </div>

            {/* Title & Free Shipping Banner */}
            <div className="flex flex-col md:flex-row justify-between md:items-end mb-8 gap-4">
                <h1 className="text-3xl font-bold text-[#2e4053] font-serif" style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", "Comic Neue", cursive' }}>
                    Your Cart
                </h1>
                
                {shippingSettings && shippingSettings.isFreeShippingActive && shipping > 0 && (
                    <div className="bg-[#f0f9ff] border border-[#bae6fd] text-[#0369a1] px-4 py-2 rounded-lg text-[14px] font-medium flex items-center gap-2">
                        <span>🚚</span>
                        {shippingSettings.freeShippingMinAmount > 0 && (
                            <span>Add ₹{(shippingSettings.freeShippingMinAmount - subTotal).toFixed(2)} more for Free Shipping!</span>
                        )}
                        {shippingSettings.freeShippingMinAmount > 0 && shippingSettings.freeShippingMinItems > 0 && <span> or </span>}
                        {shippingSettings.freeShippingMinItems > 0 && (
                            <span>Add {shippingSettings.freeShippingMinItems - cartItems.length} more item(s) for Free Shipping!</span>
                        )}
                    </div>
                )}
                {shippingSettings && shippingSettings.isFreeShippingActive && shipping === 0 && (
                    <div className="bg-[#f0fdf4] border border-[#bbf7d0] text-[#166534] px-4 py-2 rounded-lg text-[14px] font-bold flex items-center gap-2">
                        <span>🎉</span> You've unlocked Free Shipping!
                    </div>
                )}
            </div>

            {/* Desktop Table Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 bg-[#f3f4f6] py-4 px-6 rounded-t-md font-bold text-[#2e4053] text-[15px]">
                <div className="col-span-5">Product</div>
                <div className="col-span-2">Price</div>
                <div className="col-span-2">Quantity</div>
                <div className="col-span-2">Subtotal</div>
                <div className="col-span-1 text-center">Action</div>
            </div>

            {/* Cart Items */}
            <div className="flex flex-col border-b border-slate-200">
                {cartItems.map(item => (
                    <div key={item._id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-6 px-0 md:px-6 border-t border-slate-100">
                        
                        {/* Product */}
                        <div className="col-span-5 flex items-center gap-6">
                            <div className="w-24 h-24 border border-slate-200 rounded-2xl flex items-center justify-center p-2 shrink-0 bg-white">
                                <img 
                                    src={item.thumbnailImage || (item.images && item.images[0]) || '/placeholder.png'} 
                                    alt={item.name} 
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <h3 className="font-semibold text-[#2e4053] text-[15px]">{item.name}</h3>
                        </div>

                        {/* Price */}
                        <div className="col-span-2 font-bold text-[#2e4053] text-[14px] mt-2 md:mt-0">
                            <span className="md:hidden text-slate-400 font-normal mr-2">Price:</span>
                            ₹{item.price.toFixed(2)}
                        </div>

                        {/* Quantity */}
                        <div className="col-span-2 flex items-center mt-2 md:mt-0">
                            <div className="flex items-center border border-[#1282a2] rounded-full overflow-hidden h-9 w-28">
                                <button 
                                    onClick={() => handleQuantityChange(item._id, item.quantity, -1)} 
                                    className="w-1/3 h-full flex items-center justify-center text-[#1282a2] hover:bg-slate-50 font-bold"
                                >
                                    -
                                </button>
                                <span className="w-1/3 h-full flex items-center justify-center font-bold text-[#2e4053] text-[14px] border-x border-[#1282a2]">
                                    {item.quantity}
                                </span>
                                <button 
                                    onClick={() => handleQuantityChange(item._id, item.quantity, 1)} 
                                    className="w-1/3 h-full flex items-center justify-center text-[#1282a2] hover:bg-slate-50 font-bold"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Subtotal */}
                        <div className="col-span-2 font-bold text-[#2e4053] text-[14px] mt-2 md:mt-0">
                            <span className="md:hidden text-slate-400 font-normal mr-2">Subtotal:</span>
                            ₹{(item.price * item.quantity).toFixed(2)}
                        </div>

                        {/* Action */}
                        <div className="col-span-1 text-right md:text-center mt-4 md:mt-0 absolute md:static right-4">
                            <button 
                                onClick={() => removeFromCart(item._id)} 
                                className="text-slate-400 hover:text-red-500 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Actions Below Table */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-8 gap-4">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <input 
                        type="text" 
                        placeholder="Coupon code" 
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                        className="border border-slate-300 rounded-full px-5 py-2.5 text-[14px] w-full md:w-64 focus:outline-none focus:border-[#1282a2] text-[#2e4053]"
                    />
                    <button className="bg-[#1282a2] hover:bg-[#0f6c87] text-white px-8 py-2.5 rounded-full font-bold text-[14px] transition-colors shrink-0">
                        Apply
                    </button>
                </div>
                
                <div className="flex items-center gap-4 w-full md:w-auto mt-4 md:mt-0">
                    <Link to="/products" className="bg-[#e5e7eb] hover:bg-[#d1d5db] text-[#4b5563] px-6 py-2.5 rounded-full font-bold text-[14px] transition-colors w-full md:w-auto text-center">
                        Continue Shopping
                    </Link>
                    <button className="bg-[#1282a2] hover:bg-[#0f6c87] text-white px-6 py-2.5 rounded-full font-bold text-[14px] transition-colors w-full md:w-auto">
                        Update Cart
                    </button>
                </div>
            </div>

            {/* Cart Total Box */}
            <div className="flex justify-end mt-16 mb-20">
                <div className="w-full md:w-[400px] border border-slate-200 rounded-2xl p-8">
                    <h2 className="text-xl font-bold text-[#2e4053] mb-6 font-serif" style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", "Comic Neue", cursive' }}>
                        Cart total
                    </h2>
                    
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-[#4b5563] font-medium text-[15px]">Subtotal</span>
                        <span className="font-bold text-[#2e4053] text-[15px]">₹{subTotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center mb-4">
                        <span className="text-[#4b5563] font-medium text-[15px]">Shipping</span>
                        <span className="font-bold text-[#2e4053] text-[15px]">
                            {shipping === 0 ? <span className="text-[#10b981]">Free</span> : `₹${shipping.toFixed(2)}`}
                        </span>
                    </div>
                    
                    <div className="flex justify-between items-center mb-8 border-t border-slate-100 pt-4">
                        <span className="text-[#4b5563] font-medium text-[15px]">Total</span>
                        <span className="font-bold text-[#2e4053] text-[15px]">₹{total.toFixed(2)}</span>
                    </div>
                    
                    <Link to="/checkout" className="block w-full bg-[#fbdf14] hover:bg-[#ebd013] text-[#2e4053] text-center font-bold py-3.5 rounded-full transition-colors">
                        Proceed to checkout
                    </Link>
                </div>
            </div>

        </div>
    );
};

export default Cart;
