import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Contact = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        if (e.target.name === 'phone') {
            const value = e.target.value.replace(/\D/g, '').slice(0, 10);
            setFormData({ ...formData, phone: value });
            return;
        }
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.phone && formData.phone.length !== 10) {
            setError('Phone number must be exactly 10 digits.');
            return;
        }

        setIsSubmitting(true);
        setError(null);
        
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: `${formData.firstName} ${formData.lastName}`.trim(),
                    email: formData.email,
                    phone: formData.phone,
                    subject: 'General Inquiry',
                    message: formData.message
                })
            });

            const data = await response.json();

            if (response.ok) {
                setIsSubmitted(true);
                setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '' });
            } else {
                setError(data.message || 'Something went wrong. Please try again.');
            }
        } catch (err) {
            setError('Network error. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="font-sans bg-[#FDFBF7] min-h-screen">
            {/* Header Banner - Medium Size */}
            <div className="bg-gradient-to-b from-gray-50 to-[#FDFBF7] pt-10 sm:pt-12 md:pt-14 pb-16 sm:pb-20 relative overflow-hidden border-b border-gray-100">
                {/* Decorative Elements */}
                <div className="absolute top-8 left-10 w-44 h-44 bg-[#E51A22]/5 rounded-full blur-2xl pointer-events-none"></div>
                <div className="absolute bottom-6 right-10 w-52 h-52 bg-blue-500/5 rounded-full blur-2xl pointer-events-none"></div>

                <div className="max-w-[1200px] mx-auto px-4 md:px-6 relative z-10 text-center">
                    <span className="inline-block bg-white text-[#E51A22] border border-gray-100 font-extrabold tracking-[0.18em] uppercase text-[11px] sm:text-xs px-3.5 py-1 rounded-full mb-3 shadow-xs">
                        Reach Out To Us
                    </span>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-black text-[#1A1A24] mb-2.5 leading-tight">
                        Let's Get In <span className="text-[#E51A22]">Touch</span>
                    </h1>
                    <p className="text-[#555] text-xs sm:text-sm md:text-[15px] max-w-xl mx-auto leading-relaxed font-medium">
                        Have a question about our toys, your order, or just want to say hello? We'd love to hear from you. Our team is always here to help.
                    </p>
                </div>
            </div>

            <div className="max-w-[1060px] mx-auto px-4 md:px-6 pb-16 sm:pb-20 -mt-6 sm:-mt-8 relative z-20">
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                    
                    {/* Left Section: Info Cards (Medium Size) */}
                    <div className="lg:w-[35%] flex flex-col gap-4 sm:gap-4.5">
                        {/* Phone Card */}
                        <a href="tel:8347640423" className="block bg-white rounded-2xl p-5 sm:p-5.5 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group relative overflow-hidden flex flex-col items-start cursor-pointer">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#E51A22]/5 to-transparent opacity-50 rounded-bl-[80px] pointer-events-none transition-transform duration-500 group-hover:scale-110"></div>
                            <div className="w-11 h-11 rounded-xl bg-[#E51A22]/10 flex items-center justify-center text-[#E51A22] mb-3.5 group-hover:scale-105 group-hover:bg-[#E51A22] group-hover:text-white transition-all duration-300 shadow-xs">
                                <Phone className="w-5 h-5" strokeWidth={2.2} />
                            </div>
                            <h3 className="font-black text-[#1A1A24] text-base sm:text-[17px] mb-1">Phone Support</h3>
                            <p className="text-slate-500 text-xs sm:text-[13px] leading-relaxed mb-0.5">Mon - Sat, 9am to 7pm</p>
                            <p className="text-[#E51A22] font-bold text-sm sm:text-[15px]">8347640423</p>
                        </a>
                        
                        {/* Email Card */}
                        <a href="mailto:hello@littlejoys.com" className="block bg-white rounded-2xl p-5 sm:p-5.5 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group relative overflow-hidden flex flex-col items-start cursor-pointer">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#1A1A24]/5 to-transparent opacity-50 rounded-bl-[80px] pointer-events-none transition-transform duration-500 group-hover:scale-110"></div>
                            <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center text-[#1A1A24] mb-3.5 group-hover:scale-105 group-hover:bg-[#1A1A24] group-hover:text-white transition-all duration-300 shadow-xs">
                                <Mail className="w-5 h-5" strokeWidth={2.2} />
                            </div>
                            <h3 className="font-black text-[#1A1A24] text-base sm:text-[17px] mb-1">Email Us</h3>
                            <p className="text-slate-500 text-xs sm:text-[13px] leading-relaxed mb-0.5">We'll reply within 24 hours</p>
                            <p className="text-[#1A1A24] font-bold text-sm sm:text-[15px]">hello@littlejoys.com</p>
                        </a>
                        
                        {/* Address Card */}
                        <a href="https://www.google.com/maps/place/Tulsi+Arcade" target="_blank" rel="noopener noreferrer" className="block bg-white rounded-2xl p-5 sm:p-5.5 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group relative overflow-hidden flex flex-col items-start cursor-pointer">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-blue-50 to-transparent opacity-50 rounded-bl-[80px] pointer-events-none transition-transform duration-500 group-hover:scale-110"></div>
                            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 mb-3.5 group-hover:scale-105 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 shadow-xs">
                                <MapPin className="w-5 h-5" strokeWidth={2.2} />
                            </div>
                            <h3 className="font-black text-[#1A1A24] text-base sm:text-[17px] mb-1">Our Store</h3>
                            <p className="text-slate-500 text-xs sm:text-[13px] leading-relaxed mb-0.5">Come visit us in person</p>
                            <p className="text-[#1A1A24] font-bold text-xs sm:text-[13.5px]">Tulsi Arcade, Mota Varachha, Surat</p>
                        </a>
                    </div>

                    {/* Right Section: Contact Form (Medium Size) */}
                    <div className="lg:w-[65%] flex flex-col">
                        <div className="h-full bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm overflow-hidden relative">
                            <div className="p-5 sm:p-7 md:p-8 relative z-10 flex flex-col justify-center h-full">
                                {isSubmitted ? (
                                    <div className="text-center py-8 px-4">
                                        <div className="w-14 h-14 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xs border border-green-100">
                                            <CheckCircle2 className="w-7 h-7" strokeWidth={2.2} />
                                        </div>
                                        <h3 className="text-2xl font-black text-[#1A1A24] mb-2">Message Sent!</h3>
                                        <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
                                            Thank you for reaching out to us. Our team will get back to you as soon as possible.
                                        </p>
                                        <button 
                                            onClick={() => setIsSubmitted(false)}
                                            className="bg-gray-100 text-[#1A1A24] hover:bg-[#E51A22] hover:text-white px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer"
                                        >
                                            Send another message
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="mb-5 sm:mb-6">
                                            <h2 className="text-xl sm:text-2xl font-black text-[#1A1A24] mb-1.5">
                                                Send a Message
                                            </h2>
                                            <p className="text-slate-500 text-xs sm:text-sm">
                                                Fill out the form below and we will get back to you as soon as possible.
                                            </p>
                                            {error && (
                                                <div className="mt-3 p-3 bg-red-50 border border-red-100 text-[#E51A22] rounded-xl text-xs font-medium">
                                                    {error}
                                                </div>
                                            )}
                                        </div>
                                        
                                        <form className="space-y-4" onSubmit={handleSubmit}>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-[11px] sm:text-xs font-bold text-[#1A1A24] mb-1.5 uppercase tracking-wide">First Name</label>
                                                    <input 
                                                        type="text" 
                                                        name="firstName"
                                                        value={formData.firstName}
                                                        onChange={handleChange}
                                                        placeholder="Jane" 
                                                        required
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 sm:py-3 text-sm text-[#1A1A24] font-medium focus:outline-none focus:border-[#E51A22] focus:bg-white focus:ring-3 focus:ring-[#E51A22]/10 transition-all placeholder-gray-400"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] sm:text-xs font-bold text-[#1A1A24] mb-1.5 uppercase tracking-wide">Last Name</label>
                                                    <input 
                                                        type="text" 
                                                        name="lastName"
                                                        value={formData.lastName}
                                                        onChange={handleChange}
                                                        placeholder="Doe" 
                                                        required
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 sm:py-3 text-sm text-[#1A1A24] font-medium focus:outline-none focus:border-[#E51A22] focus:bg-white focus:ring-3 focus:ring-[#E51A22]/10 transition-all placeholder-gray-400"
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-[11px] sm:text-xs font-bold text-[#1A1A24] mb-1.5 uppercase tracking-wide">Email Address</label>
                                                    <input 
                                                        type="email" 
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        placeholder="jane@example.com" 
                                                        required
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 sm:py-3 text-sm text-[#1A1A24] font-medium focus:outline-none focus:border-[#E51A22] focus:bg-white focus:ring-3 focus:ring-[#E51A22]/10 transition-all placeholder-gray-400" 
                                                        pattern="[^@\s]+@[^@\s]+\.[^@\s]+" 
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] sm:text-xs font-bold text-[#1A1A24] mb-1.5 uppercase tracking-wide">Phone Number</label>
                                                    <input 
                                                        type="tel" 
                                                        name="phone"
                                                        value={formData.phone}
                                                        onChange={handleChange}
                                                        placeholder="9876543210" 
                                                        required
                                                        maxLength={10}
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 sm:py-3 text-sm text-[#1A1A24] font-medium focus:outline-none focus:border-[#E51A22] focus:bg-white focus:ring-3 focus:ring-[#E51A22]/10 transition-all placeholder-gray-400"
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div>
                                                <label className="block text-[11px] sm:text-xs font-bold text-[#1A1A24] mb-1.5 uppercase tracking-wide">Message</label>
                                                <textarea 
                                                    name="message"
                                                    value={formData.message}
                                                    onChange={handleChange}
                                                    placeholder="How can we help you today?" 
                                                    rows="3"
                                                    required
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 sm:py-3 text-sm text-[#1A1A24] font-medium focus:outline-none focus:border-[#E51A22] focus:bg-white focus:ring-3 focus:ring-[#E51A22]/10 transition-all placeholder-gray-400 resize-none"
                                                ></textarea>
                                            </div>
                                            
                                            <div className="pt-1">
                                                <button 
                                                    type="submit" 
                                                    disabled={isSubmitting}
                                                    className={`w-full sm:w-auto inline-flex items-center justify-center gap-2.5 text-white font-bold text-sm sm:text-[15px] px-6 py-3 rounded-xl transition-all cursor-pointer ${
                                                        isSubmitting ? "bg-[#E51A22]/70 cursor-not-allowed" : "bg-[#E51A22] hover:bg-[#c9161d] hover:shadow-md hover:shadow-[#E51A22]/20 hover:-translate-y-0.5"
                                                    }`}
                                                >
                                                    {isSubmitting ? (
                                                        <>
                                                            <span>Sending...</span>
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span>Send Message</span>
                                                            <ArrowRight className="w-4 h-4" strokeWidth={2.2} />
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </form>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Map Section (Medium Size) */}
                <div className="mt-10 sm:mt-12">
                    <div className="relative bg-white p-5 sm:p-6 md:p-7 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm">
                        <div className="mb-5 sm:mb-6 text-center flex flex-col items-center">
                            <h2 className="text-xl sm:text-2xl font-black text-[#1A1A24] mb-1.5">Find Us Here</h2>
                            <p className="text-slate-500 text-xs sm:text-sm max-w-md">We're located in the heart of Surat. Come visit our store in person, we'd love to see you!</p>
                        </div>
                        <div className="w-full h-[280px] sm:h-[320px] md:h-[360px] rounded-2xl overflow-hidden border border-gray-100 shadow-inner relative group">
                            {/* Overlay that fades out on hover to make it feel interactive */}
                            <div className="absolute inset-0 bg-[#1A1A24]/5 pointer-events-none transition-opacity duration-300 group-hover:opacity-0 z-10"></div>
                            
                            <iframe 
                                src="https://maps.google.com/maps?q=Tulsi%20Arcade,%20Mota%20Varachha,%20Surat&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                                width="100%" 
                                height="100%" 
                                style={{ border: 0 }} 
                                allowFullScreen="" 
                                loading="lazy" 
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Google Maps Location of Tulsi Arcade, Surat"
                                className="w-full h-full relative z-0 transition-all duration-500"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
