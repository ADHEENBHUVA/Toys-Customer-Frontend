import React from 'react';
import { useNavigate } from 'react-router-dom';

const Shipping = () => {
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
                    <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight font-['Nunito']">Shipping & Delivery</h1>
                </div>
                <div className="prose prose-slate max-w-none prose-headings:font-black prose-headings:font-['Nunito']">
                    <h3>Free Shipping Eligibility</h3>
                    <p>We offer free standard shipping on all orders over ₹500. For orders under ₹500, a standard shipping fee of ₹50 will apply.</p>

                    <h3>Delivery Timelines</h3>
                    <ul>
                        <li><strong>Standard Delivery:</strong> 3-5 business days</li>
                        <li><strong>Express Delivery:</strong> 1-2 business days (Additional ₹100)</li>
                        <li><strong>International Shipping:</strong> 7-14 business days</li>
                    </ul>

                    <h3>Order Processing</h3>
                    <p>All orders are processed within 1-2 business days. Orders are not shipped or delivered on weekends or holidays. If we are experiencing a high volume of orders, shipments may be delayed by a few days.</p>

                    <h3>Tracking Your Order</h3>
                    <p>You will receive a Shipment Confirmation email once your order has shipped containing your tracking number(s). The tracking number will be active within 24 hours.</p>
                </div>
            </div>
        </div>
    );
};

export default Shipping;
