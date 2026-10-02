import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

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
            {/* Breadcrumb */}
            <div className="text-[14px] mb-8 font-medium">
                <span className="text-[#2e4053] font-bold">Home</span>
                <span className="text-slate-400 mx-2">/</span>
                <span className="text-[#1282a2]">FAQ'S</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-[#2e4053] mb-8 font-serif" style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", "Comic Neue", cursive' }}>
                FAQ'S
            </h1>

            {/* FAQ Container */}
            <div className="border border-slate-200 rounded-2xl p-6 md:p-10 mb-16">
                <div className="space-y-6">
                    {faqs.map((faq, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div key={index} className="flex flex-col">
                                <button 
                                    onClick={() => toggleFaq(index)}
                                    className="flex items-center gap-4 text-left w-full focus:outline-none py-2"
                                >
                                    <div className="text-[#2e4053] shrink-0">
                                        {isOpen ? (
                                            <Minus strokeWidth={2} className="w-5 h-5" />
                                        ) : (
                                            <Plus strokeWidth={2} className="w-5 h-5" />
                                        )}
                                    </div>
                                    <span className="font-semibold text-[#2e4053] text-[16px] leading-snug">
                                        {faq.question}
                                    </span>
                                </button>
                                
                                <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'}`}>
                                    <div className="overflow-hidden">
                                        <p className="pl-9 text-[#666666] text-[14px] leading-relaxed max-w-5xl">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default FAQ;
