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
            {/* Header Banner */}
            <div className="bg-gradient-to-b from-gray-50 to-[#FDFBF7] pt-20 pb-28 relative overflow-hidden border-b border-gray-100">
                {/* Decorative Elements */}
                <div className="absolute top-10 left-10 w-48 h-48 bg-[#E51A22]/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>

                <div className="max-w-[1200px] mx-auto px-4 md:px-6 relative z-10 text-center">
                    <span className="inline-block bg-white text-[#E51A22] border border-gray-100 font-bold tracking-[0.2em] uppercase text-xs px-4 py-2 rounded-full mb-6 shadow-sm">Reach Out To Us</span>
                    <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#1A1A24] mb-6 leading-tight">
                        Let's Get In <span className="text-[#E51A22]">Touch</span>
                    </h1>
                    <p className="text-[#555] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                        Have a question about our toys, your order, or just want to say hello? We'd love to hear from you. Our team is always here to help.
                    </p>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-4 md:px-6 pb-28 md:pb-20 -mt-12 relative z-20">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    
                    {/* Left Section: Info Cards (Vertical) */}
                    <div className="lg:w-[35%] flex flex-col gap-6">
                        {/* Phone Card */}
                        <a href="tel:8347640423" className="block bg-white rounded-3xl p-8 border border-gray-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden flex flex-col items-start cursor-pointer">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#E51A22]/5 to-transparent opacity-50 rounded-bl-[100px] pointer-events-none transition-transform duration-500 group-hover:scale-110"></div>
                            <div className="w-14 h-14 rounded-2xl bg-[#E51A22]/10 flex items-center justify-center text-[#E51A22] mb-6 group-hover:scale-110 group-hover:bg-[#E51A22] group-hover:text-white transition-all duration-300 shadow-sm">
                                <Phone className="w-6 h-6" strokeWidth={2.5} />
                            </div>
                            <h3 className="font-black text-[#1A1A24] text-xl mb-2">Phone Support</h3>
                            <p className="text-[#555] leading-relaxed mb-1">Mon - Sat, 9am to 7pm</p>
                            <p className="text-[#E51A22] font-bold text-lg">8347640423</p>
                        </a>
                        
                        {/* Email Card */}
                        <a href="mailto:hello@littlejoys.com" className="block bg-white rounded-3xl p-8 border border-gray-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden flex flex-col items-start cursor-pointer">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#1A1A24]/5 to-transparent opacity-50 rounded-bl-[100px] pointer-events-none transition-transform duration-500 group-hover:scale-110"></div>
                            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center text-[#1A1A24] mb-6 group-hover:scale-110 group-hover:bg-[#1A1A24] group-hover:text-white transition-all duration-300 shadow-sm">
                                <Mail className="w-6 h-6" strokeWidth={2.5} />
                            </div>
                            <h3 className="font-black text-[#1A1A24] text-xl mb-2">Email Us</h3>
                            <p className="text-[#555] leading-relaxed mb-1">We'll reply within 24 hours</p>
                            <p className="text-[#1A1A24] font-bold text-lg">hello@littlejoys.com</p>
                        </a>
                        
                        {/* Address Card */}
                        <a href="https://www.google.com/maps/place/Tulsi+Arcade" target="_blank" rel="noopener noreferrer" className="block bg-white rounded-3xl p-8 border border-gray-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden flex flex-col items-start cursor-pointer">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-50 to-transparent opacity-50 rounded-bl-[100px] pointer-events-none transition-transform duration-500 group-hover:scale-110"></div>
                            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 shadow-sm">
                                <MapPin className="w-6 h-6" strokeWidth={2.5} />
                            </div>
                            <h3 className="font-black text-[#1A1A24] text-xl mb-2">Our Store</h3>
                            <p className="text-[#555] leading-relaxed mb-1">Come visit us in person</p>
                            <p className="text-[#1A1A24] font-bold text-[15px]">Tulsi Arcade, Mota Varachha, Surat</p>
                        </a>
                    </div>

                    {/* Right Section: Contact Form */}
                    <div className="lg:w-[65%] flex flex-col">
                        <div className="h-full bg-white rounded-[2rem] sm:rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden relative">
                            <div className="p-5 sm:p-8 md:p-12 relative z-10 flex flex-col justify-center h-full">
                                {isSubmitted ? (
                                    <div className="text-center py-12 px-4">
                                        <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-green-100">
                                            <CheckCircle2 className="w-10 h-10" strokeWidth={2.5} />
                                        </div>
                                        <h3 className="text-3xl font-black text-[#1A1A24] mb-4">Message Sent!</h3>
                                        <p className="text-[#555] text-lg max-w-md mx-auto mb-8">
                                            Thank you for reaching out to us. Our team will get back to you as soon as possible.
                                        </p>
                                        <button 
                                            onClick={() => setIsSubmitted(false)}
                                            className="bg-gray-100 text-[#1A1A24] hover:bg-[#E51A22] hover:text-white px-8 py-3 rounded-full font-bold transition-all duration-300"
                                        >
                                            Send another message
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="mb-8">
                                            <h2 className="text-3xl font-black text-[#1A1A24] mb-3">
                                                Send a Message
                                            </h2>
                                            <p className="text-[#555] text-lg">
                                                Fill out the form below and we will get back to you as soon as possible.
                                            </p>
                                            {error && (
                                                <div className="mt-4 p-4 bg-red-50 border border-red-100 text-[#E51A22] rounded-xl text-sm font-medium">
                                                    {error}
                                                </div>
                                            )}
                                        </div>
                                        
                                        <form className="space-y-6" onSubmit={handleSubmit}>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-bold text-[#1A1A24] mb-2 uppercase tracking-wide">First Name</label>
                                                    <input 
                                                        type="text" 
                                                        name="firstName"
                                                        value={formData.firstName}
                                                        onChange={handleChange}
                                                        placeholder="Jane" 
                                                        required
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 text-[#1A1A24] font-medium focus:outline-none focus:border-[#E51A22] focus:bg-white focus:ring-4 focus:ring-[#E51A22]/10 transition-all placeholder-gray-400"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-[#1A1A24] mb-2 uppercase tracking-wide">Last Name</label>
                                                    <input 
                                                        type="text" 
                                                        name="lastName"
                                                        value={formData.lastName}
                                                        onChange={handleChange}
                                                        placeholder="Doe" 
                                                        required
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 text-[#1A1A24] font-medium focus:outline-none focus:border-[#E51A22] focus:bg-white focus:ring-4 focus:ring-[#E51A22]/10 transition-all placeholder-gray-400"
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-bold text-[#1A1A24] mb-2 uppercase tracking-wide">Email Address</label>
                                                    <input 
                                                        type="email" 
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        placeholder="jane@example.com" 
                                                        required
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 text-[#1A1A24] font-medium focus:outline-none focus:border-[#E51A22] focus:bg-white focus:ring-4 focus:ring-[#E51A22]/10 transition-all placeholder-gray-400" 
                                                        pattern="[^@\s]+@[^@\s]+\.[^@\s]+" 
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-[#1A1A24] mb-2 uppercase tracking-wide">Phone Number</label>
                                                    <input 
                                                        type="tel" 
                                                        name="phone"
                                                        value={formData.phone}
                                                        onChange={handleChange}
                                                        placeholder="9876543210" 
                                                        required
                                                        maxLength={10}
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 text-[#1A1A24] font-medium focus:outline-none focus:border-[#E51A22] focus:bg-white focus:ring-4 focus:ring-[#E51A22]/10 transition-all placeholder-gray-400"
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-bold text-[#1A1A24] mb-2 uppercase tracking-wide">Message</label>
                                                <textarea 
                                                    name="message"
                                                    value={formData.message}
                                                    onChange={handleChange}
                                                    placeholder="How can we help you today?" 
                                                    rows="4"
                                                    required
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 text-[#1A1A24] font-medium focus:outline-none focus:border-[#E51A22] focus:bg-white focus:ring-4 focus:ring-[#E51A22]/10 transition-all placeholder-gray-400 resize-none"
                                                ></textarea>
                                            </div>
                                            
                                            <div className="pt-2">
                                                <button 
                                                    type="submit" 
                                                    disabled={isSubmitting}
                                                    className={`w-full sm:w-auto inline-flex items-center justify-center gap-3 text-white font-bold text-lg px-8 py-4 rounded-xl transition-all ${
                                                        isSubmitting ? "bg-[#E51A22]/70 cursor-not-allowed" : "bg-[#E51A22] hover:bg-[#c9161d] hover:shadow-lg hover:shadow-[#E51A22]/20 hover:-translate-y-1"
                                                    }`}
                                                >
                                                    {isSubmitting ? (
                                                        <>
                                                            <span>Sending...</span>
                                                            <Loader2 className="w-5 h-5 animate-spin" />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span>Send Message</span>
                                                            <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
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

                {/* Map Section */}
                <div className="mt-20">
                    <div className="relative bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-100 shadow-xl">
                        <div className="mb-8 text-center flex flex-col items-center">
                            <h2 className="text-3xl font-black text-[#1A1A24] mb-3">Find Us Here</h2>
                            <p className="text-[#555] text-lg max-w-lg">We're located in the heart of Surat. Come visit our store in person, we'd love to see you!</p>
                        </div>
                        <div className="w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden border border-gray-100 shadow-inner relative group">
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
