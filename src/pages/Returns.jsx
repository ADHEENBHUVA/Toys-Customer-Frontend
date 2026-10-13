import React, { useEffect } from 'react';

const Returns = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-[#FDFBF7] min-h-screen py-16 px-4 md:px-8 font-sans">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 md:p-12 lg:p-16 shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-slate-100">
                <div className="mb-10 text-center">
                    <span className="text-[#E51A22] font-bold tracking-widest uppercase text-sm mb-3 block">Legal Information</span>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#1A1A24] mb-4">Refund & Return Policy</h1>
                    <p className="text-slate-500 font-medium">Last Updated: {new Date().toLocaleDateString('en-GB')}</p>
                </div>

                <div className="prose prose-slate max-w-none text-slate-600 leading-loose">
                    <p className="mb-6">
                        At <strong>Little Joys</strong>, we want you to be completely satisfied with your purchase. If you or your little ones are not entirely happy with our products, we are here to help. This Refund and Return Policy outlines the conditions under which you can return items and receive a refund.
                    </p>

                    <h2 className="text-2xl font-bold text-[#1A1A24] mt-10 mb-4">1. Our 30-Day Guarantee</h2>
                    <p className="mb-4">
                        Our standard return policy lasts for 30 days. If 30 days have gone by since you received your order, unfortunately, we cannot offer you a refund or an exchange. To be eligible for a return, the item must be unused, in the same condition that you received it, and in its original, unopened packaging.
                    </p>
                    <p className="mb-6">
                        Some types of goods are exempt from being returned, such as personalized toys, intimate or sanitary goods, hazardous materials, or flammable liquids or gases.
                    </p>

                    <h2 className="text-2xl font-bold text-[#1A1A24] mt-10 mb-4">2. Return Process</h2>
                    <p className="mb-4">
                        To initiate a return, please contact our support team with your receipt or proof of purchase. Please do not send your purchase back to the manufacturer directly. Once we receive your request, we will provide you with a return shipping address and instructions on how to send the package.
                    </p>
                    <p className="mb-6">
                        You will be responsible for paying for your own shipping costs for returning your item unless the item received was damaged or defective. Shipping costs are non-refundable. If you receive a refund, the cost of return shipping may be deducted from your refund.
                    </p>

                    <h2 className="text-2xl font-bold text-[#1A1A24] mt-10 mb-4">3. Refunds</h2>
                    <p className="mb-4">
                        Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund based on the condition of the item.
                    </p>
                    <p className="mb-6">
                        If you are approved, then your refund will be processed, and a credit will automatically be applied to your credit card or original method of payment, usually within 5 to 7 business days depending on your bank's processing time.
                    </p>

                    <h2 className="text-2xl font-bold text-[#1A1A24] mt-10 mb-4">4. Late or Missing Refunds</h2>
                    <p className="mb-6">
                        If you haven't received a refund yet, first check your bank account again. Then contact your credit card company, it may take some time before your refund is officially posted. Next contact your bank. There is often some processing time before a refund is posted. If you've done all of this and you still have not received your refund yet, please contact our support team.
                    </p>

                    <h2 className="text-2xl font-bold text-[#1A1A24] mt-10 mb-4">5. Damaged or Defective Items</h2>
                    <p className="mb-6">
                        We only replace items if they are defective or damaged upon arrival. If you need to exchange it for the same item, send us an email immediately with photographic proof of the damage, and we will arrange a free replacement and cover all return shipping costs for the damaged item.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Returns;
