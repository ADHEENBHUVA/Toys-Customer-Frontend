import React from 'react';
import { Link } from 'react-router-dom';
import { Database, Activity, Share2, Lock } from 'lucide-react';

const Privacy = () => {
    return (
        <div className="max-w-[1200px] mx-auto px-4 py-10 font-['Outfit'] bg-white min-h-[60vh]">
            {/* Breadcrumb */}
            <div className="text-[14px] mb-8 font-medium">
                <Link to="/" className="text-[#2e4053] font-bold hover:text-[#1282a2] transition-colors">Home</Link>
                <span className="text-slate-400 mx-2">/</span>
                <span className="text-[#1282a2]">Privacy Policy</span>
            </div>

            {/* Title */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#2e4053] font-serif mb-2">
                    Privacy Policy
                </h1>
                <p className="text-[15px] text-[#666666]">Last updated: {new Date().toLocaleDateString('en-GB')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="border border-slate-200 rounded-2xl p-8 hover:shadow-lg transition-shadow bg-slate-50">
                    <div className="bg-[#1282a2]/10 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                        <Database className="w-7 h-7 text-[#1282a2]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#2e4053] mb-3">1. Information We Collect</h3>
                    <p className="text-[#666666] leading-relaxed text-[15px]">
                        At Little Joys, we collect information to provide better services to our users. This includes personal information such as your name, email address, phone number, and shipping details when you create an account or make a purchase.
                    </p>
                </div>

                <div className="border border-slate-200 rounded-2xl p-8 hover:shadow-lg transition-shadow bg-slate-50">
                    <div className="bg-[#e6a27a]/10 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                        <Activity className="w-7 h-7 text-[#e6a27a]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#2e4053] mb-3">2. How We Use Information</h3>
                    <p className="text-[#666666] leading-relaxed text-[15px]">
                        We use the information we collect to process transactions, deliver your purchases, communicate with you about your order, and send promotional offers if you have opted in to our newsletter.
                    </p>
                </div>

                <div className="border border-slate-200 rounded-2xl p-8 hover:shadow-lg transition-shadow bg-slate-50">
                    <div className="bg-[#f4a261]/10 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                        <Share2 className="w-7 h-7 text-[#f4a261]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#2e4053] mb-3">3. Information Sharing</h3>
                    <p className="text-[#666666] leading-relaxed text-[15px]">
                        We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. This does not include trusted third parties who assist us in operating our website, conducting our business, or servicing you.
                    </p>
                </div>

                <div className="border border-slate-200 rounded-2xl p-8 hover:shadow-lg transition-shadow bg-slate-50">
                    <div className="bg-[#2a9d8f]/10 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                        <Lock className="w-7 h-7 text-[#2a9d8f]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#2e4053] mb-3">4. Data Security</h3>
                    <p className="text-[#666666] leading-relaxed text-[15px]">
                        We implement a variety of security measures to maintain the safety of your personal information when you place an order or access your personal information online.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Privacy;

