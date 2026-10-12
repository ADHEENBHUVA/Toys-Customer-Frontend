import React, { useEffect } from 'react';

const Terms = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-[#FDFBF7] min-h-screen py-16 px-4 md:px-8 font-['Outfit']">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 md:p-12 lg:p-16 shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-slate-100">
                <div className="mb-10 text-center">
                    <span className="text-[#E51A22] font-bold tracking-widest uppercase text-sm mb-3 block">Legal Information</span>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#1A1A24] mb-4">Terms of Service</h1>
                    <p className="text-slate-500 font-medium">Last Updated: {new Date().toLocaleDateString('en-GB')}</p>
                </div>

                <div className="prose prose-slate max-w-none text-slate-600 leading-loose">
                    <p className="mb-6">
                        Welcome to <strong>Little Joys</strong>. By accessing or using our website, you agree to be bound by these Terms of Service. Please read them carefully before using our platform or purchasing our products.
                    </p>

                    <h2 className="text-2xl font-bold text-[#1A1A24] mt-10 mb-4">1. General Conditions</h2>
                    <p className="mb-4">
                        We reserve the right to refuse service to anyone for any reason at any time. You understand that your content (not including credit card information), may be transferred unencrypted and involve transmissions over various networks.
                    </p>
                    <p className="mb-6">
                        You agree not to reproduce, duplicate, copy, sell, resell or exploit any portion of the Service, use of the Service, or access to the Service without express written permission by us.
                    </p>

                    <h2 className="text-2xl font-bold text-[#1A1A24] mt-10 mb-4">2. Products and Services</h2>
                    <p className="mb-4">
                        Certain products or services may be available exclusively online through the website. These products or services may have limited quantities and are subject to return or exchange only according to our Return Policy.
                    </p>
                    <p className="mb-6">
                        We have made every effort to display as accurately as possible the colors and images of our products that appear at the store. We cannot guarantee that your computer monitor's display of any color will be accurate. We reserve the right to limit the sales of our products or Services to any person, geographic region, or jurisdiction.
                    </p>

                    <h2 className="text-2xl font-bold text-[#1A1A24] mt-10 mb-4">3. Accuracy of Billing and Account Information</h2>
                    <p className="mb-6">
                        We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household, or per order. You agree to provide current, complete, and accurate purchase and account information for all purchases made at our store.
                    </p>

                    <h2 className="text-2xl font-bold text-[#1A1A24] mt-10 mb-4">4. Modifications to the Service and Prices</h2>
                    <p className="mb-6">
                        Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time. We shall not be liable to you or to any third-party for any modification, price change, suspension, or discontinuance of the Service.
                    </p>

                    <h2 className="text-2xl font-bold text-[#1A1A24] mt-10 mb-4">5. User Comments, Feedback, and Other Submissions</h2>
                    <p className="mb-6">
                        If, at our request, you send certain specific submissions or without a request from us you send creative ideas, suggestions, proposals, plans, or other materials, you agree that we may, at any time, without restriction, edit, copy, publish, distribute, translate, and otherwise use in any medium any comments that you forward to us.
                    </p>

                    <h2 className="text-2xl font-bold text-[#1A1A24] mt-10 mb-4">6. Contact Information</h2>
                    <p className="mb-6">
                        Questions about the Terms of Service should be sent to us at our customer support contact details provided on the website.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Terms;

