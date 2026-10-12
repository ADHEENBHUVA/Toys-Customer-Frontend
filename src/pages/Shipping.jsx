import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Clock, Globe, Box } from 'lucide-react';

const Shipping = () => {
    return (
        <div className="max-w-[1200px] mx-auto px-4 py-10 font-['Outfit'] bg-white min-h-[60vh]">
            

            {/* Title */}
            <div className="text-center mb-12">
                <span className="text-[#E51A22] text-[13px] font-bold uppercase tracking-[0.2em] mb-3 block">INFORMATION</span>
                <h1 className="text-4xl font-black text-[#1A1A24] mb-4">
                    Shipping & Delivery
                </h1>
                <p className="text-[#555] font-medium text-[15px]">Everything you need to know about how we get your little joys to you.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="border border-slate-100 rounded-2xl p-8 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(229,26,34,0.08)] hover:border-red-50 transition-all bg-white group">
                    <div className="bg-red-50 group-hover:bg-[#E51A22] w-14 h-14 rounded-full flex items-center justify-center mb-6 transition-colors">
                        <Truck className="w-7 h-7 text-[#E51A22] group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold text-[#1A1A24] mb-3">Free Shipping</h3>
                    <p className="text-[#555] font-medium leading-relaxed text-[15px]">
                        We offer free standard shipping on all orders over ₹500. For orders under ₹500, a minimal standard shipping fee of ₹50 will be applied at checkout.
                    </p>
                </div>

                <div className="border border-slate-100 rounded-2xl p-8 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(229,26,34,0.08)] hover:border-red-50 transition-all bg-white group">
                    <div className="bg-red-50 group-hover:bg-[#E51A22] w-14 h-14 rounded-full flex items-center justify-center mb-6 transition-colors">
                        <Clock className="w-7 h-7 text-[#E51A22] group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold text-[#1A1A24] mb-3">Delivery Timelines</h3>
                    <ul className="text-[#555] font-medium leading-relaxed space-y-3 text-[15px]">
                        <li className="flex items-center"><span className="w-2 h-2 rounded-full bg-[#E51A22] mr-3"></span> <strong>Standard:</strong>&nbsp;3-5 business days</li>
                        <li className="flex items-center"><span className="w-2 h-2 rounded-full bg-[#E51A22] mr-3"></span> <strong>Express:</strong>&nbsp;1-2 business days (+₹100)</li>
                    </ul>
                </div>

                <div className="border border-slate-100 rounded-2xl p-8 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(229,26,34,0.08)] hover:border-red-50 transition-all bg-white group">
                    <div className="bg-red-50 group-hover:bg-[#E51A22] w-14 h-14 rounded-full flex items-center justify-center mb-6 transition-colors">
                        <Box className="w-7 h-7 text-[#E51A22] group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold text-[#1A1A24] mb-3">Order Processing</h3>
                    <p className="text-[#555] font-medium leading-relaxed text-[15px]">
                        Orders are processed within 1-2 business days. We do not ship on weekends or public holidays. During peak seasons, processing may take slightly longer.
                    </p>
                </div>

                <div className="border border-slate-100 rounded-2xl p-8 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(229,26,34,0.08)] hover:border-red-50 transition-all bg-white group">
                    <div className="bg-red-50 group-hover:bg-[#E51A22] w-14 h-14 rounded-full flex items-center justify-center mb-6 transition-colors">
                        <Globe className="w-7 h-7 text-[#E51A22] group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold text-[#1A1A24] mb-3">Order Tracking</h3>
                    <p className="text-[#555] font-medium leading-relaxed text-[15px]">
                        Once your order is dispatched, you will receive an email with your tracking number. You can track your package directly through our website or the courier partner's portal.
                    </p>
                </div>
            </div>
            
            <div className="bg-red-50 rounded-3xl p-8 md:p-12 border border-red-100 text-center max-w-3xl mx-auto">
                <h3 className="text-2xl font-black text-[#1A1A24] mb-3">Need Help With Your Delivery?</h3>
                <p className="text-[#555] font-medium mb-8 text-[15px] max-w-xl mx-auto">
                    If you haven't received your order within the estimated delivery time, or if your package arrived damaged, our support team is ready to help!
                </p>
                <Link to="/contact" className="inline-block bg-[#1A1A24] text-white px-8 py-3.5 rounded-full font-bold hover:bg-[#E51A22] hover:-translate-y-1 hover:shadow-lg transition-all tracking-wide">
                    Contact Support
                </Link>
            </div>
        </div>
    );
};

export default Shipping;
