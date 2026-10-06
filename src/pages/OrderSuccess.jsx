import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Package, FileText, ArrowRight, Truck } from 'lucide-react';

const OrderSuccess = () => {
    const [orderDetails, setOrderDetails] = useState({
        orderNumber: '',
        date: '',
        deliveryDate: ''
    });

    useEffect(() => {
        // Generate mock order details for display
        const num = Math.floor(10000000 + Math.random() * 90000000);
        const today = new Date();
        const delivery = new Date(today);
        delivery.setDate(delivery.getDate() + 4); 
        
        setOrderDetails({
            orderNumber: `OD${num}`,
            date: today.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
            deliveryDate: delivery.toLocaleDateString('en-US', { day: 'numeric', month: 'long', weekday: 'long' })
        });
    }, []);

    return (
        <div className="bg-[#fcfaf7] min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center font-sans">
            <div className="w-full max-w-3xl relative">
                
                {/* Background decorative blob */}
                <div className="absolute -top-10 -left-10 w-64 h-64 bg-[#f3eee7] rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
                <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-[#f0f7f4] rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>

                <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(230,162,122,0.08)] relative z-10 overflow-hidden border border-[#f3eee7]/60">
                    
                    {/* Top Accent Bar */}
                    <div className="h-2 w-full bg-gradient-to-r from-[#e6a27a] via-[#f0ccb6] to-[#93b38c]"></div>

                    <div className="p-8 md:p-12">
                        {/* Success Header */}
                        <div className="flex flex-col items-center text-center mb-10">
                            <div className="w-20 h-20 bg-[#f0f7f4] rounded-full flex items-center justify-center mb-6 relative">
                                <div className="absolute inset-0 bg-[#93b38c] rounded-full opacity-20 animate-ping"></div>
                                <Check className="w-10 h-10 text-[#71966a]" strokeWidth={3} />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-[#3d3130] mb-3 font-serif">
                                Order Confirmed
                            </h1>
                            <p className="text-[#8b7e7c] text-lg max-w-md">
                                Thank you for your purchase! We've received your order and are getting it ready for shipment.
                            </p>
                        </div>

                        {/* Order Details Card */}
                        <div className="bg-[#fcfaf7] rounded-2xl p-6 md:p-8 mb-10 border border-[#f3eee7]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                
                                {/* Order Info */}
                                <div>
                                    <h3 className="text-sm font-bold text-[#b5a8a6] uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <FileText className="w-4 h-4" /> Order Details
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-[#8b7e7c] text-sm mb-1">Order Number</p>
                                            <p className="font-bold text-[#3d3130] text-lg">{orderDetails.orderNumber}</p>
                                        </div>
                                        <div>
                                            <p className="text-[#8b7e7c] text-sm mb-1">Date Placed</p>
                                            <p className="font-medium text-[#3d3130]">{orderDetails.date}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Delivery Info */}
                                <div>
                                    <h3 className="text-sm font-bold text-[#b5a8a6] uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <Truck className="w-4 h-4" /> Delivery
                                    </h3>
                                    <div className="bg-white rounded-xl p-4 border border-[#f3eee7] shadow-sm">
                                        <p className="text-[#8b7e7c] text-sm mb-1">Estimated Arrival</p>
                                        <p className="font-bold text-[#71966a] text-lg mb-2">
                                            {orderDetails.deliveryDate}
                                        </p>
                                        <p className="text-[#b5a8a6] text-xs leading-relaxed">
                                            We will send you a shipping confirmation email with your tracking number once your order has shipped.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link 
                                to="/orders" 
                                className="w-full sm:w-auto px-8 py-3.5 bg-white text-[#3d3130] font-bold rounded-xl border-2 border-[#f3eee7] hover:border-[#e6a27a] hover:bg-[#fcfaf7] transition-all flex items-center justify-center gap-2"
                            >
                                <Package className="w-5 h-5" />
                                View Order History
                            </Link>
                            <Link 
                                to="/products" 
                                className="w-full sm:w-auto px-8 py-3.5 bg-[#e6a27a] hover:bg-[#d99268] text-white font-bold rounded-xl transition-all shadow-[0_8px_20px_rgba(230,162,122,0.3)] hover:-translate-y-0.5 flex items-center justify-center gap-2"
                            >
                                Continue Shopping
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;
