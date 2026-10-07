import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Tag, RefreshCcw, ShieldAlert } from 'lucide-react';

const Terms = () => {
    return (
        <div className="max-w-[1200px] mx-auto px-4 py-10 font-['Outfit'] bg-white min-h-[60vh]">
            {/* Breadcrumb */}
            <div className="text-[14px] mb-8 font-medium">
                <Link to="/" className="text-[#2e4053] font-bold hover:text-[#1282a2] transition-colors">Home</Link>
                <span className="text-slate-400 mx-2">/</span>
                <span className="text-[#1282a2]">Terms of Service</span>
            </div>

            {/* Title */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#2e4053] font-serif mb-2">
                    Terms of Service
                </h1>
                <p className="text-[15px] text-[#666666]">Last updated: {new Date().toLocaleDateString('en-GB')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="border border-slate-200 rounded-2xl p-8 hover:shadow-lg transition-shadow bg-slate-50">
                    <div className="bg-[#1282a2]/10 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                        <FileText className="w-7 h-7 text-[#1282a2]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#2e4053] mb-3">1. Acceptance of Terms</h3>
                    <p className="text-[#666666] leading-relaxed text-[15px]">
                        By accessing and using Little Joys, you accept and agree to be bound by the terms and provision of this agreement. When using this website's services, you shall be subject to any posted guidelines or rules applicable to such services.
                    </p>
                </div>

                <div className="border border-slate-200 rounded-2xl p-8 hover:shadow-lg transition-shadow bg-slate-50">
                    <div className="bg-[#e6a27a]/10 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                        <Tag className="w-7 h-7 text-[#e6a27a]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#2e4053] mb-3">2. Products and Pricing</h3>
                    <p className="text-[#666666] leading-relaxed text-[15px]">
                        All prices are subject to change without notice. We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time.
                    </p>
                </div>

                <div className="border border-slate-200 rounded-2xl p-8 hover:shadow-lg transition-shadow bg-slate-50">
                    <div className="bg-[#f4a261]/10 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                        <RefreshCcw className="w-7 h-7 text-[#f4a261]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#2e4053] mb-3">3. Return Policy</h3>
                    <p className="text-[#666666] leading-relaxed text-[15px]">
                        Our return policy lasts 30 days. If 30 days have gone by since your purchase, unfortunately, we cannot offer you a refund or exchange. To be eligible for a return, your item must be unused and in original condition.
                    </p>
                </div>

                <div className="border border-slate-200 rounded-2xl p-8 hover:shadow-lg transition-shadow bg-slate-50">
                    <div className="bg-[#2a9d8f]/10 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                        <ShieldAlert className="w-7 h-7 text-[#2a9d8f]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#2e4053] mb-3">4. Limitation of Liability</h3>
                    <p className="text-[#666666] leading-relaxed text-[15px]">
                        In no case shall Little Joys, our directors, officers, employees, affiliates, or suppliers be liable for any injury, loss, claim, or any direct, indirect, incidental, or consequential damages of any kind.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Terms;

