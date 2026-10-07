import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Clock, Globe, Box } from 'lucide-react';

const Shipping = () => {
    return (
        <div className="max-w-[1200px] mx-auto px-4 py-10 font-['Outfit'] bg-white min-h-[60vh]">
            {/* Breadcrumb */}
            <div className="text-[14px] mb-8 font-medium">
                <Link to="/" className="text-[#2e4053] font-bold hover:text-[#1282a2] transition-colors">Home</Link>
                <span className="text-slate-400 mx-2">/</span>
                <span className="text-[#1282a2]">Shipping & Delivery</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-[#2e4053] mb-8 font-serif">
                Shipping & Delivery
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="border border-slate-200 rounded-2xl p-8 hover:shadow-lg transition-shadow bg-slate-50">
                    <div className="bg-[#1282a2]/10 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                        <Truck className="w-7 h-7 text-[#1282a2]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#2e4053] mb-3">Free Shipping</h3>
                    <p className="text-[#666666] leading-relaxed text-[15px]">
                        We offer free standard shipping on all orders over ₹500. For orders under ₹500, a minimal standard shipping fee of ₹50 will be applied at checkout.
                    </p>
                </div>

                <div className="border border-slate-200 rounded-2xl p-8 hover:shadow-lg transition-shadow bg-slate-50">
                    <div className="bg-[#e6a27a]/10 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                        <Clock className="w-7 h-7 text-[#e6a27a]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#2e4053] mb-3">Delivery Timelines</h3>
                    <ul className="text-[#666666] leading-relaxed space-y-2 text-[15px]">
                        <li className="flex items-center"><span className="w-2 h-2 rounded-full bg-[#e6a27a] mr-3"></span> <strong>Standard:</strong> 3-5 business days</li>
                        <li className="flex items-center"><span className="w-2 h-2 rounded-full bg-[#e6a27a] mr-3"></span> <strong>Express:</strong> 1-2 business days (+₹100)</li>
                    </ul>
                </div>

                <div className="border border-slate-200 rounded-2xl p-8 hover:shadow-lg transition-shadow bg-slate-50">
                    <div className="bg-[#f4a261]/10 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                        <Box className="w-7 h-7 text-[#f4a261]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#2e4053] mb-3">Order Processing</h3>
                    <p className="text-[#666666] leading-relaxed text-[15px]">
                        Orders are processed within 1-2 business days. We do not ship on weekends or public holidays. During peak seasons, processing may take slightly longer.
                    </p>
                </div>

                <div className="border border-slate-200 rounded-2xl p-8 hover:shadow-lg transition-shadow bg-slate-50">
                    <div className="bg-[#2a9d8f]/10 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                        <Globe className="w-7 h-7 text-[#2a9d8f]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#2e4053] mb-3">Order Tracking</h3>
                    <p className="text-[#666666] leading-relaxed text-[15px]">
                        Once your order is dispatched, you will receive an email with your tracking number. You can track your package directly through our website or the courier partner's portal.
                    </p>
                </div>
            </div>
            
            <div className="bg-[#1282a2]/5 rounded-2xl p-8 border border-[#1282a2]/20">
                <h3 className="text-xl font-bold text-[#2e4053] mb-3">Need Help With Your Delivery?</h3>
                <p className="text-[#666666] mb-4 text-[15px]">
                    If you haven't received your order within the estimated delivery time, or if your package arrived damaged, our support team is ready to help!
                </p>
                <Link to="/contact" className="inline-block bg-[#1282a2] text-white px-6 py-2.5 rounded-full font-medium hover:bg-[#0f6c87] transition-colors">
                    Contact Support
                </Link>
            </div>
        </div>
    );
};

export default Shipping;
