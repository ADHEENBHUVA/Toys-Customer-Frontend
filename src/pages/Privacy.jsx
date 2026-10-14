import React, { useEffect } from 'react';

const Privacy = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-[#FDFBF7] min-h-screen py-16 px-4 md:px-8 font-sans">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 md:p-12 lg:p-16 shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-slate-100">
                <div className="mb-10 text-center">
                    <span className="text-[#E51A22] font-bold tracking-widest uppercase text-sm mb-3 block">Legal Information</span>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#1A1A24] mb-4">Privacy Policy</h1>
                    <p className="text-slate-500 font-medium">Last Updated: {new Date().toLocaleDateString('en-GB')}</p>
                </div>

                <div className="prose prose-slate max-w-none text-slate-600 leading-loose">
                    <p className="mb-6">
                        At <strong>Little Joys</strong>, your privacy and the security of your personal information are our highest priority. This Privacy Policy outlines how we collect, use, and protect the data you provide to us when you use our website and services.
                    </p>

                    <h2 className="text-2xl font-bold text-[#1A1A24] mt-10 mb-4">1. We Do Not Sell Your Data (Zero Data Selling Policy)</h2>
                    <p className="mb-6 text-[#1A1A24] font-semibold bg-red-50 p-6 rounded-2xl border border-red-100">
                        We strictly value your privacy and do not sell, rent, trade, or share any of your personal information (such as your name, phone number, email address, or shipping address) with third parties for marketing or any other purposes. Your data is solely and securely used to fulfill your orders and enhance your shopping experience with us.
                    </p>

                    <h2 className="text-2xl font-bold text-[#1A1A24] mt-10 mb-4">2. Information We Collect</h2>
                    <p className="mb-4">
                        We collect information that you voluntarily provide to us when registering on the website, expressing an interest in obtaining information about us or our products, or otherwise contacting us.
                    </p>
                    <ul className="list-disc pl-6 mb-6 space-y-2">
                        <li><strong>Personal Information:</strong> Name, email address, phone number, and billing/shipping addresses.</li>
                        <li><strong>Payment Information:</strong> We collect payment data necessary to process your purchase. (Note: All payment data is handled securely by our certified payment processors. We do not store your credit card numbers on our servers).</li>
                        <li><strong>Account Details:</strong> Order history, wishlists, and preferences.</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-[#1A1A24] mt-10 mb-4">3. How We Use Your Information</h2>
                    <p className="mb-4">
                        The information we collect is used strictly for fulfilling our services to you. We use your data to:
                    </p>
                    <ul className="list-disc pl-6 mb-6 space-y-2">
                        <li>Process and deliver your orders efficiently.</li>
                        <li>Send you important updates regarding your order status and shipping tracking.</li>
                        <li>Respond to your customer service inquiries and support requests.</li>
                        <li>Improve our website design, product offerings, and user experience.</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-[#1A1A24] mt-10 mb-4">4. Data Security</h2>
                    <p className="mb-6">
                        We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure. Although we will do our best to protect your personal information, transmission of personal information to and from our website is at your own risk.
                    </p>

                    <h2 className="text-2xl font-bold text-[#1A1A24] mt-10 mb-4">5. Cookies and Tracking Technologies</h2>
                    <p className="mb-6">
                        We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies. If you disable or refuse cookies, please note that some parts of this website may become inaccessible or not function properly.
                    </p>

                    <h2 className="text-2xl font-bold text-[#1A1A24] mt-10 mb-4">6. Contact Us</h2>
                    <p className="mb-6">
                        If you have questions or comments about this Privacy Policy, please contact us at our customer support email or through the Contact Us page on our website.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Privacy;

