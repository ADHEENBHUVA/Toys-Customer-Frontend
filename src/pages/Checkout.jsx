import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const Checkout = () => {
    const { cartItems, getCartTotal, clearCart, calculateShipping } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('razorpay');

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

    const subTotal = getCartTotal();
    const shippingCharge = calculateShipping();
    const totalAmount = subTotal + shippingCharge;

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
                console.error("Failed to fetch pincode details", error);
            }
        }
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

        if (!address.firstName || !address.lastName || !address.streetAddress || !address.city || !address.zipCode || !address.phone || !address.email) {
            toast.error("Please fill in all required delivery fields.");
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
                toast.error("Failed to initialize payment");
                setLoading(false);
                return;
            }

            const options = {
                key: "rzp_test_TciOZDXIMiQnYr",
                amount: orderData.order.amount,
                currency: "INR",
                name: "Rainbow Rattles",
                description: "Purchase from Rainbow Rattles",
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
                                    items: cartItems.map(item => ({ productId: item._id, quantity: item.quantity, price: item.price })),
                                    shippingAddress: { ...address, fullName: `${address.firstName} ${address.lastName}` },
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
                    name: `${address.firstName} ${address.lastName}`,
                    email: address.email,
                    contact: address.phone
                },
                theme: {
                    color: "#1282a2"
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
        <div className="max-w-[1200px] mx-auto px-4 py-10 font-['Outfit'] bg-white">
            {/* Breadcrumb */}
            <div className="text-[14px] mb-8 font-medium">
                <span className="text-[#2e4053] font-bold">Home</span>
                <span className="text-slate-400 mx-2">/</span>
                <span className="text-[#1282a2]">Checkout</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-[#2e4053] mb-8" style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", "Comic Neue", cursive' }}>
                Check out
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Column (Forms) */}
                <div className="lg:col-span-7">
                    
                    {/* Delivery Info */}
                    <div className="border border-slate-200 rounded-2xl p-6 md:p-8 mb-8">
                        <h2 className="text-xl font-bold text-[#2e4053] mb-6" style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", "Comic Neue", cursive' }}>
                            Delivery info
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-bold text-[#2e4053] mb-2">First name *</label>
                                <input type="text" name="firstName" value={address.firstName} onChange={handleInputChange} placeholder="Join" className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:border-[#1282a2] text-sm text-[#2e4053]" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-[#2e4053] mb-2">Last name *</label>
                                <input type="text" name="lastName" value={address.lastName} onChange={handleInputChange} placeholder="Gray" className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:border-[#1282a2] text-sm text-[#2e4053]" />
                            </div>
                            
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-[#2e4053] mb-2">Street address *</label>
                                <input type="text" name="streetAddress" value={address.streetAddress} onChange={handleInputChange} placeholder="Address" className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:border-[#1282a2] text-sm text-[#2e4053]" />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-[#2e4053] mb-2">ZIP code *</label>
                                <input type="text" name="zipCode" value={address.zipCode} onChange={handleInputChange} placeholder="e.g. 380015" maxLength="6" className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:border-[#1282a2] text-sm text-[#2e4053]" />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-[#2e4053] mb-2">Town / City *</label>
                                <input type="text" name="city" value={address.city} onChange={handleInputChange} placeholder="City" className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:border-[#1282a2] text-sm text-[#2e4053] bg-slate-50" />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-[#2e4053] mb-2">State *</label>
                                <input type="text" name="state" value={address.state} onChange={handleInputChange} placeholder="State" className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:border-[#1282a2] text-sm text-[#2e4053] bg-slate-50" />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-[#2e4053] mb-2">Phone *</label>
                                <input type="text" name="phone" value={address.phone} onChange={handleInputChange} placeholder="(1230) 456-7868" className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:border-[#1282a2] text-sm text-[#2e4053]" />
                            </div>
                            
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-[#2e4053] mb-2">Email address *</label>
                                <input type="email" name="email" value={address.email} onChange={handleInputChange} placeholder="Example@youremail.com" className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:border-[#1282a2] text-sm text-[#2e4053]" />
                            </div>
                            
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-[#2e4053] mb-2">Order notes (optional)</label>
                                <textarea name="orderNotes" value={address.orderNotes} onChange={handleInputChange} placeholder="Notes about your order, e.g. special notes for delivery." rows="3" className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:border-[#1282a2] text-sm text-[#2e4053] resize-none"></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="border border-slate-200 rounded-2xl p-6 md:p-8">
                        <h2 className="text-xl font-bold text-[#2e4053] mb-2" style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", "Comic Neue", cursive' }}>
                            Payment
                        </h2>
                        <p className="text-sm text-slate-500 mb-6">All transactions are secure and encrypted via Razorpay.</p>
                        
                        <div className={`border rounded-lg p-5 mb-8 ${paymentMethod === 'razorpay' ? 'border-[#1282a2] bg-blue-50/30' : 'border-slate-200'}`}>
                            <label className="flex items-center cursor-pointer">
                                <div className="relative flex items-center justify-center w-5 h-5 rounded-full border border-[#1282a2] mr-3 shrink-0">
                                    {paymentMethod === 'razorpay' && <div className="w-2.5 h-2.5 bg-[#1282a2] rounded-full"></div>}
                                    <input type="radio" name="paymentMethod" value="razorpay" checked={paymentMethod === 'razorpay'} onChange={() => setPaymentMethod('razorpay')} className="absolute opacity-0 cursor-pointer" />
                                </div>
                                <div className="flex-1">
                                    <span className="font-bold text-sm text-[#2e4053] block">Pay with Razorpay</span>
                                    <span className="text-xs text-slate-500 mt-0.5 block">Cards, UPI, NetBanking, Wallets supported</span>
                                </div>
                                <div className="flex gap-2">
                                    <div className="w-8 h-5 bg-blue-600 rounded flex items-center justify-center text-[8px] text-white font-bold italic">VISA</div>
                                    <div className="w-8 h-5 bg-slate-800 rounded flex items-center justify-center">
                                        <div className="flex -space-x-1">
                                            <div className="w-3 h-3 rounded-full bg-red-500 opacity-90"></div>
                                            <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-90"></div>
                                        </div>
                                    </div>
                                    <div className="w-8 h-5 bg-white border border-slate-200 rounded flex items-center justify-center text-[9px] text-[#003087] font-black italic">UPI</div>
                                </div>
                            </label>
                        </div>
                        
                        <button 
                            onClick={handlePayment} 
                            disabled={loading}
                            className="w-full bg-[#1282a2] hover:bg-[#0f6c87] text-white py-3 rounded-xl font-bold transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
                        >
                            {loading ? 'Processing...' : 'Place order'}
                        </button>
                    </div>

                </div>

                {/* Right Column (Order Summary) */}
                <div className="lg:col-span-5">
                    <div className="border border-slate-200 rounded-2xl p-6 md:p-8">
                        <h2 className="text-xl font-bold text-[#2e4053] mb-6" style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", "Comic Neue", cursive' }}>
                            Your order
                        </h2>
                        
                        <div className="flex flex-col gap-6 mb-6">
                            {cartItems.map(item => (
                                <div key={item._id} className="flex gap-4 items-center pb-6 border-b border-slate-100 last:border-b-0 last:pb-0">
                                    <div className="w-16 h-16 rounded-xl border border-slate-200 p-1 bg-white shrink-0">
                                        <img 
                                            src={item.thumbnailImage || (item.images && item.images[0]) || '/placeholder.png'} 
                                            alt={item.name} 
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-semibold text-[#2e4053] line-clamp-2">{item.name}</h4>
                                        <p className="text-xs font-medium text-slate-500 mt-1">Amount : {item.quantity}</p>
                                    </div>
                                    <div className="text-[13px] font-bold text-[#2e4053]">
                                        ₹{(item.price * item.quantity).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="pt-6 border-t border-slate-100 flex flex-col gap-4">
                            <div className="flex justify-between text-[#4b5563] text-[13px] font-medium">
                                <span>Subtotal</span>
                                <span className="font-bold text-[#2e4053]">₹{subTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-[#4b5563] text-[13px] font-medium">
                                <span>Shipping</span>
                                <span className="font-bold text-[#2e4053]">₹{shippingCharge.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-[#2e4053] text-[15px] font-bold mt-2">
                                <span>Total</span>
                                <span>₹{totalAmount.toFixed(2)}</span>
                            </div>
                        </div>

                    </div>
                </div>
                
            </div>
        </div>
    );
};

export default Checkout;
