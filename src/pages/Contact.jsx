import React from 'react';
import { useNavigate } from 'react-router-dom';

const Contact = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-slate-50 min-h-screen py-20 px-6">
            <div className="max-w-6xl mx-auto">
                <button onClick={() => navigate(-1)} className="mb-8 flex items-center text-blue-600 font-bold hover:text-blue-800 transition-colors">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Back
                </button>
                <div className="text-center mb-16">
                    <span className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-2 block">We'd love to hear from you</span>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight font-['Nunito'] mb-6">Contact Us</h1>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto">Have a question about a product, your order, or just want to say hi? Fill out the form below and our team will get back to you as soon as possible.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-4 md:p-8 border border-slate-100 overflow-hidden">
                    
                    {/* Contact Info */}
                    <div className="bg-slate-900 text-white p-10 md:p-12 rounded-[2rem] lg:w-1/3 relative overflow-hidden flex flex-col">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                        
                        <div className="relative z-10 flex-1">
                            <h3 className="text-2xl font-black mb-8 font-['Nunito']">Get in Touch</h3>
                            
                            <div className="space-y-8">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center shrink-0">📍</div>
                                    <div>
                                        <h4 className="font-bold mb-1">Our Headquarters</h4>
                                        <p className="text-slate-300 text-sm leading-relaxed">123 Toyland Avenue, Suite 400<br/>New York, NY 10001<br/>United States</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center shrink-0">📞</div>
                                    <div>
                                        <h4 className="font-bold mb-1">Phone Number</h4>
                                        <p className="text-slate-300 text-sm leading-relaxed">+1 (555) 123-4567<br/>Mon-Fri, 9am - 6pm EST</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center shrink-0">✉️</div>
                                    <div>
                                        <h4 className="font-bold mb-1">Email Address</h4>
                                        <p className="text-slate-300 text-sm leading-relaxed">support@appiflytoys.com<br/>We reply within 24 hours</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="p-4 md:p-8 lg:w-2/3">
                        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">First Name</label>
                                    <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="John" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Last Name</label>
                                    <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="Doe" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Email Address</label>
                                <input type="email" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="john@example.com" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Message</label>
                                <textarea rows="5" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="How can we help you?"></textarea>
                            </div>
                            <button type="submit" className="bg-[#1D4ED8] hover:bg-[#a31521] text-white px-8 py-4 rounded-xl font-bold shadow-lg transition-transform hover:scale-105 active:scale-95 w-full md:w-auto">
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
