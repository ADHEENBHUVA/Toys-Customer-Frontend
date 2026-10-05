import React from 'react';
import { Link } from 'react-router-dom';
import { RefreshCcw, ShieldCheck, Banknote, HelpCircle } from 'lucide-react';

const Returns = () => {
    return (
        <div className="max-w-[1200px] mx-auto px-4 py-10 font-['Outfit'] bg-white min-h-[60vh]">
            {/* Breadcrumb */}
            <div className="text-[14px] mb-8 font-medium">
                <Link to="/" className="text-[#2e4053] font-bold hover:text-[#1282a2] transition-colors">Home</Link>
                <span className="text-slate-400 mx-2">/</span>
                <span className="text-[#1282a2]">Returns & Exchanges</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-[#2e4053] mb-8 font-serif" style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", "Comic Neue", cursive' }}>
                Returns & Exchanges
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="border border-slate-200 rounded-2xl p-8 hover:shadow-lg transition-shadow bg-slate-50">
                    <div className="bg-[#1282a2]/10 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                        <RefreshCcw className="w-7 h-7 text-[#1282a2]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#2e4053] mb-3">Our 30-Day Guarantee</h3>
                    <p className="text-[#666666] leading-relaxed text-[15px]">
                        We want you to be completely satisfied with your purchase. If you or your little ones are not happy with the toys, you can return them within 30 days of receipt for a full refund or exchange.
                    </p>
                </div>

                <div className="border border-slate-200 rounded-2xl p-8 hover:shadow-lg transition-shadow bg-slate-50">
                    <div className="bg-[#e6a27a]/10 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                        <ShieldCheck className="w-7 h-7 text-[#e6a27a]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#2e4053] mb-3">Return Conditions</h3>
                    <ul className="text-[#666666] leading-relaxed space-y-2 text-[15px]">
                        <li className="flex items-start"><span className="w-2 h-2 rounded-full bg-[#e6a27a] mt-2 mr-3 shrink-0"></span> Items must be unused and in the same condition that you received them.</li>
                        <li className="flex items-start"><span className="w-2 h-2 rounded-full bg-[#e6a27a] mt-2 mr-3 shrink-0"></span> Items must be in the original intact packaging.</li>
                        <li className="flex items-start"><span className="w-2 h-2 rounded-full bg-[#e6a27a] mt-2 mr-3 shrink-0"></span> A receipt or proof of purchase is required.</li>
                    </ul>
                </div>

                <div className="border border-slate-200 rounded-2xl p-8 hover:shadow-lg transition-shadow bg-slate-50">
                    <div className="bg-[#f4a261]/10 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                        <Banknote className="w-7 h-7 text-[#f4a261]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#2e4053] mb-3">Refund Process</h3>
                    <p className="text-[#666666] leading-relaxed text-[15px]">
                        Once your return is received and inspected, we will send you an email to notify you. If approved, your refund will be processed and a credit will automatically be applied to your original method of payment within 5-7 business days.
                    </p>
                </div>

                <div className="border border-slate-200 rounded-2xl p-8 hover:shadow-lg transition-shadow bg-slate-50">
                    <div className="bg-[#2a9d8f]/10 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                        <HelpCircle className="w-7 h-7 text-[#2a9d8f]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#2e4053] mb-3">Damaged or Defective Items</h3>
                    <p className="text-[#666666] leading-relaxed text-[15px]">
                        If you receive a defective or damaged product, please contact our support team immediately. We will arrange a free replacement and cover all return shipping costs.
                    </p>
                </div>
            </div>
            
            <div className="bg-[#1282a2]/5 rounded-2xl p-8 border border-[#1282a2]/20">
                <h3 className="text-xl font-bold text-[#2e4053] mb-3">Want to Start a Return?</h3>
                <p className="text-[#666666] mb-4 text-[15px]">
                    Have your order number ready and click below to contact our friendly support team. We'll guide you through the quick and easy return process!
                </p>
                <Link to="/contact" className="inline-block bg-[#1282a2] text-white px-6 py-2.5 rounded-full font-medium hover:bg-[#0f6c87] transition-colors">
                    Start a Return
                </Link>
            </div>
        </div>
    );
};

export default Returns;
