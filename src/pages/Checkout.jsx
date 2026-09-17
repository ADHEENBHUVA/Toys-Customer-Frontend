import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const Checkout = () => {
    const { cartItems, getCartTotal, clearCart, calculateShipping } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const isLoggedIn = !!localStorage.getItem('token');

    const [address, setAddress] = useState({
        fullName: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
        phone: ''
    });

    const subTotal = getCartTotal();
    const shippingCharge = calculateShipping();
    const totalAmount = subTotal + shippingCharge;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAddress(prev => ({ ...prev, [name]: value }));
    };

    const handlePayment = async () => {
        if (!isLoggedIn) {
            toast.error("Please login to proceed to payment.");
            navigate('/login');
            return;
        }

        if (cartItems.length === 0) {
            toast.error("Your cart is empty!");
            return;
        }

        // Basic validation
        if (!address.fullName || !address.addressLine1 || !address.city || !address.postalCode || !address.phone) {
            toast.error("Please fill in all required address fields.");
            return;
        }

        setLoading(true);

        try {
            // 1. Create order on backend
            const token = localStorage.getItem('token'); // Fixed to use 'token' as set in Login.jsx
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
                toast.error("Failed to initialize payment");
                setLoading(false);
                return;
            }

            // 2. Open Razorpay Checkout
            const options = {
                key: "rzp_test_TciOZDXIMiQnYr", // The API Key given by user
                amount: orderData.order.amount,
                currency: "INR",
                name: "Toys Website",
                description: "Purchase from Toys Website",
                order_id: orderData.order.id,
                handler: async function (response) {
                    // 3. Verify Payment on Backend
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
                                    items: cartItems.map(item => ({ productId: item._id, quantity: item.quantity, price: item.price })),
                                    shippingAddress: address,
                                    subTotal,
                                    shippingCharge,
                                    totalAmount
                                }
                            })
                        });
                        
                        const verifyData = await verifyRes.json();
                        if (verifyData.success) {
                            toast.success("Payment successful! Order placed.");
                            clearCart();
                            navigate('/order-success');
                        } else {
                            toast.error("Payment verification failed");
                        }
                    } catch (err) {
                        console.error(err);
                        toast.error("An error occurred during verification");
                    }
                },
                prefill: {
                    name: address.fullName,
                    email: '', // Not available locally
                    contact: address.phone
                },
                theme: {
                    color: "#4F46E5" // blue-600
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response){
                toast.error(`Payment failed: ${response.error.description}`);
            });
            rzp.open();

        } catch (error) {
            console.error("Payment flow error:", error);
            toast.error("An error occurred during payment processing");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-sky-600 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-blue-200">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Secure Checkout</h1>
                        <p className="text-slate-500 font-medium">Complete your order with Razorpay</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column - Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                                Shipping Address
                            </h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name *</label>
                                    <input type="text" name="fullName" value={address.fullName} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" placeholder="John Doe" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Address Line 1 *</label>
                                    <input type="text" name="addressLine1" value={address.addressLine1} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" placeholder="123 Street Name" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Address Line 2</label>
                                    <input type="text" name="addressLine2" value={address.addressLine2} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" placeholder="Apartment, suite, etc. (optional)" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">City *</label>
                                    <input type="text" name="city" value={address.city} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" placeholder="City" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">State *</label>
                                    <input type="text" name="state" value={address.state} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" placeholder="State" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Postal/Zip Code *</label>
                                    <input type="text" name="postalCode" value={address.postalCode} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" placeholder="123456" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phone Number *</label>
                                    <input type="text" name="phone" value={address.phone} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" placeholder="+91 9876543210" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 sticky top-24">
                            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                                Order Summary
                            </h2>
                            
                            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                {cartItems.map(item => (
                                    <div key={item._id} className="flex gap-4 items-center">
                                        <div className="w-16 h-16 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0 border border-slate-100 flex items-center justify-center p-1">
                                            {item.thumbnailImage || (item.images && item.images.length > 0) ? (
                                                <img src={item.thumbnailImage || item.images[0]} alt={item.name} className="w-full h-full object-contain" />
                                            ) : (
                                                <span className="text-2xl">🧸</span>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-bold text-slate-800 line-clamp-2">{item.name}</h4>
                                            <p className="text-xs font-medium text-slate-500">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="text-sm font-black text-slate-800">
                                            ₹{item.price * item.quantity}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-slate-100 pt-4 space-y-3 mb-6">
                                <div className="flex justify-between text-slate-500 font-medium text-sm">
                                    <span>Subtotal</span>
                                    <span className="text-slate-800 font-bold">₹{subTotal}</span>
                                </div>
                                <div className="flex justify-between text-slate-500 font-medium text-sm">
                                    <span>Shipping</span>
                                    <span className="text-slate-800 font-bold">{shippingCharge === 0 ? 'Free' : `₹${shippingCharge}`}</span>
                                </div>
                            </div>

                            <div className="border-t border-slate-100 pt-4 mb-8">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-bold text-slate-800">Total</span>
                                    <span className="text-2xl font-black text-blue-600">₹{totalAmount}</span>
                                </div>
                            </div>

                            <button 
                                onClick={handlePayment} 
                                disabled={loading || cartItems.length === 0}
                                className="w-full bg-slate-900 text-white py-4 rounded-xl font-black text-lg hover:bg-blue-600 transition-colors shadow-xl shadow-slate-200 active:scale-95 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                                ) : (
                                    <>
                                        Pay ₹{totalAmount} Now
                                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                    </>
                                )}
                            </button>
                            
                            <p className="text-center text-xs font-bold text-slate-400 mt-4 flex items-center justify-center gap-1">
                                <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                Secured by Razorpay
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Checkout;
