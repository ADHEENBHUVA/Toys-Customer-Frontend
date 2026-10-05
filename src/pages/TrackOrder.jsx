import React from 'react';
import { useNavigate } from 'react-router-dom';

const TrackOrder = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-slate-50 min-h-screen py-20 px-6 flex items-center justify-center">
            <div className="w-full max-w-2xl">
                <button onClick={() => navigate(-1)} className="mb-8 flex items-center text-blue-600 font-bold hover:text-blue-800 transition-colors">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Back
                </button>
                <div className="w-full bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.05)] p-10 md:p-16 border border-slate-100 text-center relative overflow-hidden">
                <div className="absolute -top-32 -left-32 w-64 h-64 bg-blue-50 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-rose-50 rounded-full blur-3xl"></div>
                
                <div className="relative z-10">
                    <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-8 shadow-inner">
                        📦
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight font-['Nunito'] mb-4 font-serif">Track Your Order</h1>
                    <p className="text-slate-500 mb-10">Enter your order number and email address below to see the current status of your magical delivery.</p>

                    <form className="space-y-6 text-left" onSubmit={(e) => e.preventDefault()}>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-2">Order Number</label>
                            <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all text-lg" placeholder="e.g. ORD-12345678" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-2">Email Address</label>
                            <input type="email" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all text-lg" placeholder="Used during checkout" pattern="[^@\s]+@[^@\s]+\.[^@\s]+" title="Please enter a valid email address with @ and ." />
                        </div>
                        <button type="submit" className="w-full bg-slate-900 hover:bg-blue-600 text-white px-8 py-5 rounded-2xl font-bold shadow-xl transition-all duration-300 hover:shadow-blue-500/30 active:scale-95 text-lg mt-4">
                            Track Package
                        </button>
                    </form>
                </div>
            </div>
            </div>
        </div>
    );
};

export default TrackOrder;
