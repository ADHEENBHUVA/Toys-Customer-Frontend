import React from 'react';
import { useNavigate } from 'react-router-dom';

const FAQ = () => {
    const navigate = useNavigate();
    const faqs = [
        {
            question: "How long does shipping take?",
            answer: "Standard shipping takes 3-5 business days. Express shipping takes 1-2 business days. International orders can take up to 14 days depending on customs."
        },
        {
            question: "What is your return policy?",
            answer: "We offer a 30-day money-back guarantee. If you are not satisfied with your purchase, you can return it within 30 days in its original condition and packaging for a full refund."
        },
        {
            question: "Are your toys safe for toddlers?",
            answer: "Yes! Safety is our top priority. All our toys are thoroughly tested, certified non-toxic, and meet or exceed all international safety standards. Please check the recommended age rating on each product page."
        },
        {
            question: "How can I track my order?",
            answer: "Once your order is shipped, you will receive an email with a tracking number. You can also track your order directly on our website by clicking the 'Track Your Order' link in the footer."
        },
        {
            question: "Do you ship internationally?",
            answer: "Yes, we ship to over 50 countries worldwide. Shipping costs and delivery times will be calculated at checkout based on your location."
        }
    ];

    return (
        <div className="bg-slate-50 min-h-screen py-20 px-6">
            <div className="max-w-3xl mx-auto">
                <button onClick={() => navigate(-1)} className="mb-8 flex items-center text-blue-600 font-bold hover:text-blue-800 transition-colors">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Back
                </button>
                <div className="text-center mb-16">
                    <span className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-2 block">Support Center</span>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight font-['Nunito'] mb-6">Frequently Asked Questions</h1>
                    <p className="text-slate-500 text-lg">Find answers to our most common questions below.</p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <div key={idx} className="bg-white border border-slate-100 rounded-[1.5rem] p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow group">
                            <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors font-['Nunito']">{faq.question}</h3>
                            <p className="text-slate-500 leading-relaxed">{faq.answer}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-16 bg-blue-50 border border-blue-100 rounded-[2rem] p-10 text-center">
                    <h3 className="text-2xl font-bold text-slate-800 mb-4 font-['Nunito']">Still have questions?</h3>
                    <p className="text-slate-600 mb-6">Can't find the answer you're looking for? Please chat to our friendly team.</p>
                    <a href="/contact" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-bold shadow-lg transition-transform hover:scale-105 active:scale-95">
                        Get in Touch
                    </a>
                </div>
            </div>
        </div>
    );
};

export default FAQ;
