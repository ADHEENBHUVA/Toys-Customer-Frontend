import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import { ShieldCheck, Lock, CreditCard, MapPin, User, Phone, Mail, ArrowLeft, Building2, Map } from 'lucide-react';

const Checkout = () => {
    const { cartItems, updateQuantity, clearCart, shippingSettings, appliedCoupon } = useCart();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('razorpay');

    // Check if user came via Buy Now (either from location.state or sessionStorage)
    const [buyNowItem, setBuyNowItem] = useState(() => {
        if (location.state?.buyNowItem) return location.state.buyNowItem;
        try {
            const saved = sessionStorage.getItem('magic_toys_buynow');
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    const isBuyNow = Boolean(buyNowItem);
    const checkoutItems = isBuyNow ? [buyNowItem] : cartItems;

    const handleQuantityChange = (id, delta) => {
        if (isBuyNow) {
            const currentQty = buyNowItem.quantity || 1;
            const newQty = currentQty + delta;
            if (newQty < 1) return;
            const updated = { ...buyNowItem, quantity: newQty };
            setBuyNowItem(updated);
            sessionStorage.setItem('magic_toys_buynow', JSON.stringify(updated));
        } else {
            const item = cartItems.find(i => i._id === id);
            if (!item) return;
            const currentQty = item.quantity || 1;
            const newQty = currentQty + delta;
            if (newQty < 1) return;
            updateQuantity(id, newQty);
        }
    };

    const isLoggedIn = !!localStorage.getItem('token');

    const [address, setAddress] = useState({
        firstName: '',
        lastName: '',
        streetAddress: '',
        city: '',
        state: '',
        zipCode: '',
        phone: '',
        email: '',
        orderNotes: ''
    });

    const subTotal = checkoutItems.reduce((acc, item) => acc + (Number(item.price || 0) * Number(item.quantity || 1)), 0);
    const checkoutItemCount = checkoutItems.reduce((acc, item) => acc + Number(item.quantity || 1), 0);

    const calculateShippingCharge = () => {
        if (!shippingSettings || !shippingSettings.isFreeShippingActive) {
            return shippingSettings?.baseShippingCharge ?? 50;
        }
        const minAmount = shippingSettings.freeShippingMinAmount || 0;
        const minItems = shippingSettings.freeShippingMinItems || 0;

        if (minAmount === 0 && minItems === 0) {
            return shippingSettings.baseShippingCharge ?? 50;
        }
        const amountMet = minAmount > 0 && subTotal >= minAmount;
        const itemsMet = minItems > 0 && checkoutItemCount >= minItems;
        if (amountMet || itemsMet) return 0;
        return shippingSettings.baseShippingCharge ?? 50;
    };

    const shippingCharge = calculateShippingCharge();
    
    let discount = 0;
    if (appliedCoupon) {
        if (appliedCoupon.discountType === 'Percentage') {
            discount = (subTotal * appliedCoupon.discountValue) / 100;
        } else {
            discount = appliedCoupon.discountValue;
        }
        if (discount > subTotal) discount = subTotal;
    }
    
    const totalAmount = subTotal + shippingCharge - discount;

    const handleInputChange = async (e) => {
        const { name, value } = e.target;
        setAddress(prev => ({ ...prev, [name]: value }));

        if (name === 'zipCode' && value.length === 6) {
            try {
                const res = await fetch(`https://api.postalpincode.in/pincode/${value}`);
                const data = await res.json();
                if (data && data[0] && data[0].Status === 'Success') {
                    const postOffice = data[0].PostOffice[0];
                    setAddress(prev => ({
                        ...prev,
                        city: postOffice.District,
                        state: postOffice.State
                    }));
                }
            } catch (error) {
                console.error('Failed to fetch pincode details', error);
            }
        }
    };

    const handlePayment = async () => {
        if (!isLoggedIn) {
            toast.error('Please login to proceed to payment.');
            navigate('/login');
            return;
        }

        if (checkoutItems.length === 0) {
            toast.error('No items to checkout!');
            return;
        }

        if (!address.firstName || !address.lastName || !address.streetAddress || !address.city || !address.zipCode || !address.phone || !address.email) {
            toast.error('Please fill in all required delivery fields.');
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const createOrderRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/payment/create-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ amount: totalAmount })
            });
            const orderData = await createOrderRes.json();

            if (!orderData.success) {
                toast.error('Failed to initialize payment');
                setLoading(false);
                return;
            }

            const options = {
                key: 'rzp_test_TciOZDXIMiQnYr',
                amount: orderData.order.amount,
                currency: 'INR',
                name: 'Magic Toys',
                description: 'Purchase from Magic Toys',
                order_id: orderData.order.id,
                handler: async function (response) {
                    try {
                        const verifyRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/payment/verify`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                orderData: {
                                    items: checkoutItems.map(item => ({ productId: item._id, quantity: item.quantity, price: item.price })),
                                    shippingAddress: { ...address, fullName: `${address.firstName} ${address.lastName}` },
                                    subTotal,
                                    shippingCharge,
                                    discountAmount: discount,
                                    couponCode: appliedCoupon?.code,
                                    totalAmount
                                }
                            })
                        });
                        
                        const verifyData = await verifyRes.json();
                        if (verifyData.success) {
                            toast.success('Payment successful! Order placed.');
                            if (isBuyNow) {
                                sessionStorage.removeItem('magic_toys_buynow');
                            } else {
                                clearCart();
                            }
                            navigate('/order-success', { state: { orderId: verifyData.orderId } });
                        } else {
                            toast.error('Payment verification failed');
                        }
                    } catch (err) {
                        console.error(err);
                        toast.error('An error occurred during verification');
                    }
                },
                prefill: {
                    name: `${address.firstName} ${address.lastName}`,
                    email: address.email,
                    contact: address.phone
                },
                theme: {
                    color: '#2eb3a6'
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response){
                toast.error(`Payment failed: ${response.error.description}`);
            });
            rzp.open();

        } catch (error) {
            console.error('Payment flow error:', error);
            toast.error('An error occurred during payment processing');
        } finally {
            setLoading(false);
        }
    };

    if (checkoutItems.length === 0) {
        return (
            <div className="max-w-[1400px] mx-auto px-4 py-20 min-h-[60vh] flex flex-col justify-center items-center">
                <h3 className="text-2xl font-bold text-slate-800 mb-4">No items to checkout</h3>
                <Link to="/products" className="text-[#E51A22] font-bold flex items-center gap-2 hover:underline">
                    <ArrowLeft className="w-4 h-4" /> Return to shop
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-10 md:py-16 font-sans">
            <div className="flex items-center gap-2 mb-8 text-sm font-bold tracking-wide">
                <Link to="/" className="text-slate-400 hover:text-[#E51A22] transition-colors">HOME</Link>
                <span className="text-slate-300">/</span>
                <Link to="/cart" className="text-slate-400 hover:text-[#E51A22] transition-colors">CART</Link>
                <span className="text-slate-300">/</span>
                <span className="text-slate-800">CHECKOUT</span>
            </div>

            <div className="mb-6 sm:mb-10 flex items-center justify-between">
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-[#1A1A24] tracking-tight">Secure Checkout</h1>
                <div className="hidden sm:flex items-center gap-2 text-green-600 bg-green-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-green-200">
                    <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-xs sm:text-sm font-bold">SSL Encrypted</span>
                </div>
            </div>

            {isBuyNow && (
                <div className="mb-6 p-4 rounded-2xl bg-amber-50/90 border border-amber-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm shadow-xs">
                    <div className="flex items-center gap-2 text-amber-900 font-semibold">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#E51A22] animate-pulse shrink-0"></span>
                        <span>Direct Purchase: Checking out <strong>"{buyNowItem.name}"</strong> ({buyNowItem.quantity} {buyNowItem.quantity === 1 ? 'item' : 'items'}) only.</span>
                    </div>
                    {cartItems.length > 0 && (
                        <button
                            type="button"
                            onClick={() => {
                                setBuyNowItem(null);
                                sessionStorage.removeItem('magic_toys_buynow');
                            }}
                            className="text-xs font-bold text-[#E51A22] hover:underline cursor-pointer shrink-0"
                        >
                            Checkout full cart ({cartItems.length} items) instead →
                        </button>
                    )}
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 xl:gap-14">
                {/* Left Column - Forms */}
                <div className="w-full lg:w-[60%]">
                    <div className="bg-white border border-slate-100 rounded-3xl p-4 sm:p-6 md:p-10 mb-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)]">
                        <h2 className="text-2xl font-black text-[#1A1A24] mb-8 flex items-center gap-3">
                            <MapPin className="w-6 h-6 text-[#E51A22]" /> 
                            Shipping Details
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">First Name *</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><User className="w-4 h-4 text-slate-400" /></div>
                                    <input type="text" name="firstName" value={address.firstName} onChange={handleInputChange} placeholder="John" className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-11 pr-4 py-3.5 text-[#1A1A24] focus:outline-none focus:ring-2 focus:ring-[#E51A22]/20 focus:border-[#E51A22] font-medium transition-all" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Last Name *</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><User className="w-4 h-4 text-slate-400" /></div>
                                    <input type="text" name="lastName" value={address.lastName} onChange={handleInputChange} placeholder="Doe" className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-11 pr-4 py-3.5 text-[#1A1A24] focus:outline-none focus:ring-2 focus:ring-[#E51A22]/20 focus:border-[#E51A22] font-medium transition-all" />
                                </div>
                            </div>
                            
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Email Address *</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Mail className="w-4 h-4 text-slate-400" /></div>
                                    <input type="email" name="email" value={address.email} onChange={handleInputChange} placeholder="john@example.com" className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-11 pr-4 py-3.5 text-[#1A1A24] focus:outline-none focus:ring-2 focus:ring-[#E51A22]/20 focus:border-[#E51A22] font-medium transition-all" pattern="[^@\s]+@[^@\s]+\.[^@\s]+" title="Please enter a valid email address with @ and ." />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Phone Number *</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Phone className="w-4 h-4 text-slate-400" /></div>
                                    <input type="text" name="phone" value={address.phone} onChange={handleInputChange} placeholder="+91 9876543210" className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-11 pr-4 py-3.5 text-[#1A1A24] focus:outline-none focus:ring-2 focus:ring-[#E51A22]/20 focus:border-[#E51A22] font-medium transition-all" pattern="[0-9]{10}" maxLength="10" minLength="10" title="Please enter exactly 10 digits" onInput={(e) => { e.target.value = e.target.value.replace(/[^0-9]/g, ''); }} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">ZIP Code *</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Map className="w-4 h-4 text-slate-400" /></div>
                                    <input type="text" name="zipCode" value={address.zipCode} onChange={handleInputChange} maxLength="6" placeholder="380015" className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-11 pr-4 py-3.5 text-[#1A1A24] focus:outline-none focus:ring-2 focus:ring-[#E51A22]/20 focus:border-[#E51A22] font-medium transition-all" />
                                </div>
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Street Address *</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Building2 className="w-4 h-4 text-slate-400" /></div>
                                    <input type="text" name="streetAddress" value={address.streetAddress} onChange={handleInputChange} placeholder="House number and street name" className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-11 pr-4 py-3.5 text-[#1A1A24] focus:outline-none focus:ring-2 focus:ring-[#E51A22]/20 focus:border-[#E51A22] font-medium transition-all" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Town / City *</label>
                                <input type="text" name="city" value={address.city} onChange={handleInputChange} placeholder="City" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-[#1A1A24] focus:outline-none focus:ring-2 focus:ring-[#E51A22]/20 focus:border-[#E51A22] font-medium transition-all" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">State *</label>
                                <input type="text" name="state" value={address.state} onChange={handleInputChange} placeholder="State" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-[#1A1A24] focus:outline-none focus:ring-2 focus:ring-[#E51A22]/20 focus:border-[#E51A22] font-medium transition-all" />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Order Notes (Optional)</label>
                                <textarea name="orderNotes" value={address.orderNotes} onChange={handleInputChange} placeholder="Special notes for delivery..." rows="3" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-[#1A1A24] focus:outline-none focus:ring-2 focus:ring-[#E51A22]/20 focus:border-[#E51A22] font-medium transition-all resize-none"></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-10 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)]">
                        <h2 className="text-2xl font-black text-[#1A1A24] mb-8 flex items-center gap-3">
                            <CreditCard className="w-6 h-6 text-[#E51A22]" /> 
                            Payment Method
                        </h2>
                        
                        <div className={`border-2 rounded-2xl p-5 mb-8 cursor-pointer transition-all ${paymentMethod === 'razorpay' ? 'border-[#E51A22] bg-red-50' : 'border-slate-100 hover:border-slate-300'}`} onClick={() => setPaymentMethod('razorpay')}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'razorpay' ? 'border-[#E51A22]' : 'border-slate-300'}`}>
                                        {paymentMethod === 'razorpay' && <div className="w-3 h-3 bg-[#E51A22] rounded-full"></div>}
                                    </div>
                                    <div>
                                        <span className="font-bold text-[#1A1A24] block text-lg">Pay with Razorpay</span>
                                        <span className="text-sm text-slate-500 font-medium block">Cards, UPI, NetBanking, Wallets</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="w-10 h-7 bg-blue-600 rounded flex items-center justify-center text-[9px] text-white font-bold italic">VISA</div>
                                    <div className="w-10 h-7 bg-slate-800 rounded flex items-center justify-center">
                                        <div className="flex -space-x-1.5">
                                            <div className="w-4 h-4 rounded-full bg-red-500 opacity-90"></div>
                                            <div className="w-4 h-4 rounded-full bg-yellow-500 opacity-90"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Summary */}
                <div className="w-full lg:w-[40%]">
                    <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 lg:p-8 sticky top-32">
                        <h2 className="text-2xl font-black text-[#1A1A24] mb-6 tracking-tight">Order Summary</h2>
                        
                        <div className="flex flex-col gap-5 mb-8 max-h-[400px] overflow-y-auto pt-3 pr-3 pl-1 pb-1 custom-scrollbar">
                            {checkoutItems.map(item => (
                                <div key={item._id} className="flex gap-4 items-center">
                                    <div className="relative shrink-0 mr-1.5 mt-1">
                                        <div className="w-20 h-20 rounded-2xl border border-slate-200/90 p-2 bg-white flex items-center justify-center overflow-hidden shadow-2xs group">
                                            <img 
                                                src={item.thumbnailImage || (item.images && item.images[0]) || '/placeholder.png'} 
                                                alt={item.name} 
                                                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                        <div className="absolute -top-2.5 -right-2.5 min-w-[24px] h-[24px] px-1 bg-[#1A1A24] text-white rounded-full flex items-center justify-center text-xs font-black border-2 border-white shadow-md z-20 pointer-events-none">
                                            {item.quantity}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-[14px] sm:text-[15px] font-bold text-[#1A1A24] line-clamp-2 leading-tight mb-2">{item.name}</h4>
                                        <div className="flex items-center justify-between gap-2 flex-wrap">
                                            {/* Quantity Selector */}
                                            <div className="inline-flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden h-7 shadow-2xs">
                                                <button
                                                    type="button"
                                                    onClick={() => handleQuantityChange(item._id, -1)}
                                                    disabled={item.quantity <= 1}
                                                    className="w-7 h-full flex items-center justify-center text-slate-500 hover:text-black hover:bg-slate-100 font-bold text-xs disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                                                    title="Decrease quantity"
                                                >
                                                    -
                                                </button>
                                                <span className="w-8 text-center text-xs font-black text-[#1A1A24]">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleQuantityChange(item._id, 1)}
                                                    className="w-7 h-full flex items-center justify-center text-slate-500 hover:text-black hover:bg-slate-100 font-bold text-xs cursor-pointer transition-colors"
                                                    title="Increase quantity"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            {/* Product Total Price */}
                                            <div className="text-right">
                                                <span className="text-[15px] font-black text-[#1A1A24] block leading-tight">
                                                    ₹{(Number(item.price || 0) * Number(item.quantity || 1)).toFixed(2)}
                                                </span>
                                                {item.quantity > 1 && (
                                                    <span className="text-[10px] text-slate-400 font-medium">
                                                        (₹{Number(item.price || 0).toFixed(2)} × {item.quantity})
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="space-y-4 mb-8 pt-6 border-t border-slate-200/80">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-500 font-medium text-[15px]">Subtotal</span>
                                <span className="font-bold text-[#1A1A24] text-[15px]">₹{subTotal.toFixed(2)}</span>
                            </div>
                            {appliedCoupon && (
                                <div className="flex justify-between items-center text-green-600">
                                    <span className="font-medium text-[15px]">Discount ({appliedCoupon.code})</span>
                                    <span className="font-bold text-[15px]">-₹{discount.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center">
                                <span className="text-slate-500 font-medium text-[15px]">Shipping</span>
                                <span className="font-bold text-[#1A1A24] text-[15px]">
                                    {shippingCharge === 0 ? <span className="text-[#E51A22] bg-red-50 px-2 border border-red-100 py-0.5 rounded-md text-xs uppercase tracking-wider">Free</span> : `₹${shippingCharge.toFixed(2)}`}
                                </span>
                            </div>
                            
                            <div className="pt-4 mt-4 border-t border-slate-200/80 flex justify-between items-center">
                                <span className="text-lg font-bold text-[#1A1A24]">Total</span>
                                <span className="text-3xl font-black text-[#1A1A24]">₹{totalAmount.toFixed(2)}</span>
                            </div>
                        </div>

                        <button 
                            onClick={handlePayment} 
                            disabled={loading}
                            className="w-full bg-[#1A1A24] hover:bg-[#E51A22] text-white py-4 rounded-xl font-bold text-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-[0_8px_30px_rgba(229,26,34,0.2)] hover:-translate-y-1 flex items-center justify-center gap-2 group"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Processing...
                                </span>
                            ) : (
                                <>
                                    <Lock className="w-5 h-5" />
                                    Pay ₹{totalAmount.toFixed(2)}
                                </>
                            )}
                        </button>
                        
                        <p className="text-center text-xs text-slate-400 font-medium mt-4 flex items-center justify-center gap-1">
                            <Lock className="w-3 h-3" /> Secure checkout via Razorpay
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
