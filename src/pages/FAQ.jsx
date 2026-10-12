import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(0);

    const faqs = [
        {
            question: "How will my order be delivered to me?",
            answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
        },
        {
            question: "What do I need to know?",
            answer: "We use standard courier services to deliver our products safely to your doorstep. You will receive a tracking link via email once your order has been dispatched."
        },
        {
            question: "How will I know if order is placed successfully?",
            answer: "Upon successful placement of your order, you will receive an order confirmation email and SMS containing your order details and reference number."
        },
        {
            question: "How do I check the status of my order?",
            answer: "You can track your order by logging into your account and visiting the 'Track my order' section, or by using the tracking link provided in your shipping confirmation email."
        },
        {
            question: "Can I cancel my order?",
            answer: "Yes, orders can be cancelled within 24 hours of placement provided they haven't been shipped yet. Please contact our support team immediately if you wish to cancel."
        }
    ];

    const toggleFaq = (index) => {
        setOpenIndex(openIndex === index ? -1 : index);
    };

    return (
        <div className="max-w-[1200px] mx-auto px-4 py-10 font-['Outfit'] bg-white min-h-[60vh]">
            

            {/* Title */}
            <div className="text-center mb-12">
                <span className="text-[#E51A22] text-[13px] font-bold uppercase tracking-[0.2em] mb-3 block">INFORMATION</span>
                <h1 className="text-4xl font-black text-[#1A1A24] mb-4">
                    Frequently Asked Questions
                </h1>
                <p className="text-[#555] font-medium text-[15px]">Find quick answers to common questions about our products and services.</p>
            </div>

            {/* FAQ Container */}
            <div className="border border-slate-100 rounded-3xl p-6 md:p-10 mb-12 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] max-w-4xl mx-auto">
                <div className="space-y-4">
                    {faqs.map((faq, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div key={index} className="flex flex-col border border-slate-100 rounded-2xl overflow-hidden transition-all duration-300">
                                <button 
                                    onClick={() => toggleFaq(index)}
                                    className={`flex items-center gap-4 text-left w-full focus:outline-none p-5 transition-colors duration-300 ${isOpen ? 'bg-red-50' : 'bg-white hover:bg-slate-50'}`}
                                >
                                    <div className={`${isOpen ? 'text-[#E51A22]' : 'text-slate-400'} shrink-0 transition-colors`}>
                                        {isOpen ? (
                                            <Minus strokeWidth={2.5} className="w-5 h-5" />
                                        ) : (
                                            <Plus strokeWidth={2.5} className="w-5 h-5" />
                                        )}
                                    </div>
                                    <span className={`font-bold text-[16px] leading-snug transition-colors ${isOpen ? 'text-[#E51A22]' : 'text-[#1A1A24]'}`}>
                                        {faq.question}
                                    </span>
                                </button>
                                
                                <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 bg-red-50/30' : 'grid-rows-[0fr] opacity-0 bg-white'}`}>
                                    <div className="overflow-hidden">
                                        <p className="px-5 pb-6 pt-2 text-[#555] font-medium text-[15px] leading-relaxed">
                                            {faq.question === "How will my order be delivered to me?" ? "We use trusted courier partners to ensure your little joys are delivered safely and securely to your doorstep. You will receive a tracking link via email once your order has been dispatched." : faq.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Need Help CTA */}
            <div className="bg-red-50 rounded-3xl p-8 md:p-12 border border-red-100 text-center max-w-3xl mx-auto">
                <h3 className="text-2xl font-black text-[#1A1A24] mb-3">Still have questions?</h3>
                <p className="text-[#555] font-medium mb-8 text-[15px] max-w-xl mx-auto">
                    Can't find the answer you're looking for? Our friendly support team is always here to help you out!
                </p>
                <Link to="/contact" className="inline-block bg-[#1A1A24] text-white px-8 py-3.5 rounded-full font-bold hover:bg-[#E51A22] hover:-translate-y-1 hover:shadow-lg transition-all tracking-wide">
                    Contact Support
                </Link>
            </div>
        </div>
    );
};

export default FAQ;
