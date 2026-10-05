import React from 'react';
import { useNavigate } from 'react-router-dom';

const Terms = () => {
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
                    <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight font-['Nunito'] font-serif">Terms of Service</h1>
                </div>
                <div className="prose prose-slate max-w-none prose-headings:font-black prose-headings:font-['Nunito'] prose-a:text-blue-600 hover:prose-a:text-blue-500">
                    <p className="text-lg text-slate-500 mb-8 font-medium">Last updated: {new Date().toLocaleDateString('en-GB')}</p>
                    
                    <h3>1. Acceptance of Terms</h3>
                    <p>By accessing and using Appifly Toys, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using this website's particular services, you shall be subject to any posted guidelines or rules applicable to such services.</p>

                    <h3>2. Products and Pricing</h3>
                    <p>All prices are subject to change without notice. We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time.</p>

                    <h3>3. Return Policy</h3>
                    <p>Our return policy lasts 30 days. If 30 days have gone by since your purchase, unfortunately, we cannot offer you a refund or exchange. To be eligible for a return, your item must be unused and in the same condition that you received it.</p>

                    <h3>4. Limitation of Liability</h3>
                    <p>In no case shall Appifly Toys, our directors, officers, employees, affiliates, agents, contractors, interns, suppliers, service providers or licensors be liable for any injury, loss, claim, or any direct, indirect, incidental, punitive, special, or consequential damages of any kind.</p>
                </div>
            </div>
        </div>
    );
};

export default Terms;

