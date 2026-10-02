import React from 'react';
import { useNavigate } from 'react-router-dom';

const Privacy = () => {
    const navigate = useNavigate();
    
    return (
        <div className="bg-slate-50 min-h-screen py-20 px-6">
            <div className="max-w-4xl mx-auto bg-white rounded-[2rem] shadow-sm p-10 md:p-16 border border-slate-100">
                <button onClick={() => navigate(-1)} className="mb-8 flex items-center text-blue-600 font-bold hover:text-blue-800 transition-colors">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Back
                </button>
                <div className="mb-12 text-center">
                    <span className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-2 block">Legal Information</span>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight font-['Nunito'] font-serif">Privacy Policy</h1>
                </div>
                <div className="prose prose-slate max-w-none prose-headings:font-black prose-headings:font-['Nunito'] prose-a:text-blue-600 hover:prose-a:text-blue-500">
                    <p className="text-lg text-slate-500 mb-8 font-medium">Last updated: {new Date().toLocaleDateString()}</p>
                    
                    <h3>1. Information We Collect</h3>
                    <p>At Appifly Toys, we collect information to provide better services to our users. This includes personal information such as your name, email address, phone number, and shipping details when you create an account or make a purchase.</p>

                    <h3>2. How We Use Information</h3>
                    <p>We use the information we collect to process transactions, deliver your purchases, communicate with you about your order, and send promotional offers if you have opted in to our newsletter.</p>

                    <h3>3. Information Sharing</h3>
                    <p>We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. This does not include trusted third parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.</p>

                    <h3>4. Data Security</h3>
                    <p>We implement a variety of security measures to maintain the safety of your personal information when you place an order or access your personal information.</p>
                </div>
            </div>
        </div>
    );
};

export default Privacy;
