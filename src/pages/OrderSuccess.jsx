import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Check, Package, FileText, ArrowRight, Truck, FileOutput } from 'lucide-react';
import Invoice from '../components/Invoice';

const OrderSuccess = () => {
    const location = useLocation();
    const orderId = location.state?.orderId;
    const [fetchedOrder, setFetchedOrder] = useState(null);

    const [orderDetails, setOrderDetails] = useState({
        orderNumber: '',
        date: '',
        deliveryDate: ''
    });
    const [showInvoice, setShowInvoice] = useState(false);

    useEffect(() => {
        const fetchOrderData = async () => {
            const token = localStorage.getItem('token');
            const targetOrderId = orderId || 
                new URLSearchParams(location.search).get('orderId') || 
                localStorage.getItem('lastOrderId');

            if (targetOrderId) {
                try {
                    const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/orders/${targetOrderId}`, {
                        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
                    });
                    if (res.ok) {
                        const data = await res.json();
                        setFetchedOrder(data);
                        const orderDate = new Date(data.createdAt || Date.now());
                        const delivDate = new Date(orderDate);
                        delivDate.setDate(delivDate.getDate() + 4);
                        setOrderDetails({
                            orderNumber: `#OD-${data._id.slice(-8).toUpperCase()}`,
                            date: orderDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
                            deliveryDate: delivDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', weekday: 'long' })
                        });
                        return;
                    }
                } catch (err) {
                    console.error("Error loading order in success page:", err);
                }
            }

            // If not found by ID, fetch the customer's most recent actual order
            if (token) {
                try {
                    const listRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/orders`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (listRes.ok) {
                        const list = await listRes.json();
                        if (Array.isArray(list) && list.length > 0) {
                            const latest = list[0];
                            setFetchedOrder(latest);
                            const orderDate = new Date(latest.createdAt || Date.now());
                            const delivDate = new Date(orderDate);
                            delivDate.setDate(delivDate.getDate() + 4);
                            setOrderDetails({
                                orderNumber: `#OD-${latest._id.slice(-8).toUpperCase()}`,
                                date: orderDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
                                deliveryDate: delivDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', weekday: 'long' })
                            });
                            return;
                        }
                    }
                } catch (e) {
                    console.error("Error fetching latest user order:", e);
                }
            }
        };

        fetchOrderData();
        
        // Ensure audio plays by creating it dynamically with high volume
        try {
            const audio = new Audio("https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3?filename=success-1-6297.mp3");
            audio.volume = 1.0;
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log("Autoplay prevented. Audio will play on first interaction.");
                    // Fallback: play on first click anywhere
                    const playOnInteraction = () => {
                        audio.play();
                        document.removeEventListener('click', playOnInteraction);
                    };
                    document.addEventListener('click', playOnInteraction);
                });
            }
        } catch(e) {
            console.log("Audio error", e);
        }
    }, []);

    return (
        <div className="bg-[#FDFBF7] min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center font-sans overflow-hidden">
            <style>{`
                @keyframes slideUpFade {
                    0% { transform: translateY(50px) scale(0.95); opacity: 0; }
                    100% { transform: translateY(0) scale(1); opacity: 1; }
                }
                @keyframes scaleTick {
                    0% { transform: scale(0); opacity: 0; }
                    50% { transform: scale(1.3); opacity: 1; }
                    100% { transform: scale(1); opacity: 1; }
                }
                .animate-slide-up {
                    animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .animate-tick {
                    animation: scaleTick 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                    animation-delay: 0.3s;
                    opacity: 0;
                }
            `}</style>
            
            <div className="w-full max-w-3xl relative animate-slide-up">
                
                {/* Background decorative blob */}
                <div className="absolute -top-10 -left-10 w-64 h-64 bg-red-100/60 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-blue-100/60 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

                <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(229,26,34,0.08)] relative z-10 overflow-hidden border border-slate-100">
                    
                    {/* Top Accent Bar */}
                    <div className="h-2 w-full bg-gradient-to-r from-[#1A1A24] via-[#E51A22] to-[#1A1A24]"></div>

                    <div className="p-8 md:p-12">
                        {/* Success Header */}
                        <div className="flex flex-col items-center text-center mb-10">
                            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 relative animate-tick">
                                <div className="absolute inset-0 bg-green-400 rounded-full opacity-20 animate-ping" style={{ animationDuration: '2.5s' }}></div>
                                <div className="absolute inset-2 bg-green-100 rounded-full"></div>
                                <Check className="w-12 h-12 text-green-500 relative z-10" strokeWidth={4} />
                            </div>
                            <h1 className="text-3xl md:text-5xl font-black text-[#1A1A24] mb-4 tracking-tight">
                                Order Confirmed!
                            </h1>
                            <p className="text-[#555] font-medium text-lg max-w-md">
                                Thank you for your purchase. Your little joys are getting ready for shipment.
                            </p>
                        </div>

                        {/* Order Details Card */}
                        <div className="bg-slate-50 rounded-2xl p-6 md:p-8 mb-10 border border-slate-100">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                
                                {/* Order Info */}
                                <div>
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <FileText className="w-4 h-4" /> Order Details
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-slate-500 font-medium text-sm mb-1">Order Number</p>
                                            <p className="font-black text-[#1A1A24] text-lg">{orderDetails.orderNumber}</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-500 font-medium text-sm mb-1">Date Placed</p>
                                            <p className="font-bold text-[#1A1A24]">{orderDetails.date}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Delivery Info */}
                                <div>
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <Truck className="w-4 h-4" /> Delivery
                                    </h3>
                                    <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                                        <p className="text-slate-500 font-medium text-sm mb-1">Estimated Arrival</p>
                                        <p className="font-black text-green-600 text-lg mb-2">
                                            {orderDetails.deliveryDate}
                                        </p>
                                        <p className="text-slate-400 font-medium text-xs leading-relaxed">
                                            We will send you a shipping confirmation email with your tracking number once your order has shipped.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <button 
                                onClick={() => setShowInvoice(true)}
                                className="w-full sm:w-auto px-8 py-3.5 bg-white text-[#1A1A24] font-bold rounded-xl border-2 border-slate-200 hover:border-[#1A1A24] transition-all flex items-center justify-center gap-2"
                            >
                                <FileOutput className="w-5 h-5" />
                                View & Download Invoice
                            </button>
                            <Link 
                                to="/products" 
                                className="w-full sm:w-auto px-8 py-3.5 bg-[#1A1A24] hover:bg-[#E51A22] text-white font-bold rounded-xl transition-all shadow-[0_8px_30px_rgba(229,26,34,0.2)] hover:-translate-y-1 flex items-center justify-center gap-2"
                            >
                                Continue Shopping
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                    
                </div>
            </div>

            {showInvoice && (
                <Invoice 
                    order={fetchedOrder || {
                        orderNumber: orderDetails.orderNumber,
                        date: orderDetails.date
                    }} 
                    onClose={() => setShowInvoice(false)} 
                />
            )}
        </div>
    );
};

export default OrderSuccess;
