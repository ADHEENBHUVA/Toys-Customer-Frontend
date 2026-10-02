import React from 'react';
import { useNavigate } from 'react-router-dom';

const Returns = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-slate-50 min-h-screen py-20 px-6">
            <div className="max-w-4xl mx-auto bg-white rounded-[2rem] shadow-sm p-10 md:p-16 border border-slate-100">
                <button onClick={() => navigate(-1)} className="mb-8 flex items-center text-blue-600 font-bold hover:text-blue-800 transition-colors">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Back
                </button>
                <div className="mb-12 text-center">
                    <span className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-2 block">Customer Support</span>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight font-['Nunito'] font-serif">Returns & Refunds</h1>
                </div>
                <div className="prose prose-slate max-w-none prose-headings:font-black prose-headings:font-['Nunito']">
                    <h3>Our 30-Day Guarantee</h3>
                    <p>We want you to be completely satisfied with your purchase. If you are not happy with your toys, you can return them within 30 days of receipt for a full refund or exchange.</p>

                    <h3>Return Conditions</h3>
                    <ul>
                        <li>Items must be unused and in the same condition that you received them.</li>
                        <li>Items must be in the original packaging.</li>
                        <li>A receipt or proof of purchase is required.</li>
                    </ul>

                    <h3>Refund Process</h3>
                    <p>Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund. If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment within 5-7 business days.</p>

                    <h3>Damaged or Defective Items</h3>
                    <p>If you receive a defective or damaged product, please contact our support team immediately. We will arrange a free replacement and cover all shipping costs.</p>
                </div>
            </div>
        </div>
    );
};

export default Returns;
