import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle2, Loader2, ArrowRight, ExternalLink, Clock } from 'lucide-react';
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
            <div className="bg-gradient-to-b from-gray-50 to-[#FDFBF7] pt-10 sm:pt-12 md:pt-14 pb-16 sm:pb-20 relative overflow-hidden border-b border-gray-100">
                {/* Decorative Soft Glows */}
                <div className="absolute top-8 left-10 w-44 h-44 bg-[#E51A22]/5 rounded-full blur-2xl pointer-events-none"></div>
                <div className="absolute bottom-6 right-10 w-52 h-52 bg-blue-500/5 rounded-full blur-2xl pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10 text-center">
                    <span className="inline-block bg-white text-[#E51A22] border border-rose-100 font-extrabold tracking-[0.18em] uppercase text-[11px] sm:text-xs px-3.5 py-1 rounded-full mb-3 shadow-xs">
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

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20 -mt-6 sm:-mt-8 relative z-20 space-y-7 sm:space-y-8">
                
                {/* 1. TOP SECTION: Calling, Mail & Our Store in a Horizontal Row (Aadi Line) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
                    {/* Calling / Phone Card */}
                    <a 
                        href="tel:8347640423" 
                        className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-rose-100 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden flex flex-col justify-between cursor-pointer"
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#E51A22]/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
                        <div>
                            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#E51A22] border border-rose-100 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:bg-[#E51A22] group-hover:text-white transition-all shadow-xs">
                                <Phone className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.2} />
                            </div>
                            <span className="text-[10px] sm:text-[11px] font-black text-[#E51A22] uppercase tracking-wider">Quick Call</span>
                            <h3 className="font-black text-[#1A1A24] text-lg sm:text-[19px] mt-0.5 mb-1">Calling Support</h3>
                            <p className="text-slate-500 text-xs sm:text-[13px] leading-relaxed mb-3">Mon - Sat, 9:00 AM to 7:00 PM</p>
                        </div>
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-base sm:text-[17px] font-black text-[#1A1A24] group-hover:text-[#E51A22] transition-colors">+91 8347640423</span>
                            <span className="text-xs font-bold text-[#E51A22] bg-rose-50 px-2.5 py-1 rounded-full group-hover:bg-[#E51A22] group-hover:text-white transition-all">Call Now →</span>
                        </div>
                    </a>

                    {/* Mail Card */}
                    <a 
                        href="https://mail.google.com/mail/?view=cm&fs=1&to=adheenbhuva0007@gmail.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-rose-100 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden flex flex-col justify-between cursor-pointer"
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
                        <div>
                            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:bg-amber-500 group-hover:text-white transition-all shadow-xs">
                                <Mail className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.2} />
                            </div>
                            <span className="text-[10px] sm:text-[11px] font-black text-amber-600 uppercase tracking-wider">Direct Email</span>
                            <h3 className="font-black text-[#1A1A24] text-lg sm:text-[19px] mt-0.5 mb-1">Mail Support</h3>
                            <p className="text-slate-500 text-xs sm:text-[13px] leading-relaxed mb-3">We reply within 24 business hours</p>
                        </div>
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                            <span className="text-xs sm:text-[13.5px] font-bold text-[#1A1A24] group-hover:text-amber-600 transition-colors truncate" title="adheenbhuva0007@gmail.com">adheenbhuva0007@gmail.com</span>
                            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full group-hover:bg-amber-500 group-hover:text-white transition-all shrink-0">Email Us →</span>
                        </div>
                    </a>

                    {/* Our Store Card */}
                    <a 
                        href="https://www.google.com/maps/place/Tulsi+Arcade/@21.2395209,72.8755431,812m/data=!3m1!1e3!4m10!1m2!2m1!1sTulsi+Arcade,+Mota+Varachha,+Surat!3m6!1s0x3be04f705dffe915:0x1fc83e2ebcf890f5!8m2!3d21.2389143!4d72.8801442"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-rose-100 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden flex flex-col justify-between cursor-pointer"
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
                        <div>
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xs">
                                <MapPin className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.2} />
                            </div>
                            <span className="text-[10px] sm:text-[11px] font-black text-blue-600 uppercase tracking-wider">Experience Center</span>
                            <h3 className="font-black text-[#1A1A24] text-lg sm:text-[19px] mt-0.5 mb-1">Our Store</h3>
                            <p className="text-slate-500 text-xs sm:text-[13px] leading-relaxed mb-3">Open 7 Days • 10:00 AM to 9:00 PM</p>
                        </div>
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                            <span className="text-xs sm:text-[13.5px] font-bold text-[#1A1A24] group-hover:text-blue-600 transition-colors truncate">Tulsi Arcade, Mota Varachha, Surat</span>
                            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0">Map →</span>
                        </div>
                    </a>
                </div>

                {/* 2. BOTTOM SECTION: Send A Message & Map Side-by-Side (Aeni baju ma Map) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
                    
                    {/* Send A Message Form */}
                    <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm p-5 sm:p-7 md:p-8 flex flex-col justify-between h-full relative">
                        {isSubmitted ? (
                            <div className="text-center py-12 px-4 my-auto">
                                <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xs border border-green-100">
                                    <CheckCircle2 className="w-8 h-8" strokeWidth={2.2} />
                                </div>
                                <h3 className="text-2xl font-black text-[#1A1A24] mb-2">Message Sent!</h3>
                                <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
                                    Thank you for reaching out to us. Our team will get back to you as soon as possible.
                                </p>
                                <button 
                                    onClick={() => setIsSubmitted(false)}
                                    className="bg-[#E51A22] text-white hover:bg-[#c9161d] px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-300 shadow-xs cursor-pointer"
                                >
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="mb-5 sm:mb-6">
                                    <span className="inline-block text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-[#E51A22] bg-rose-50 border border-rose-100 px-3 py-1 rounded-full mb-2">
                                        SEND AN INQUIRY
                                    </span>
                                    <h2 className="text-xl sm:text-2xl font-black text-[#1A1A24]">
                                        Send A Message
                                    </h2>
                                    <p className="text-slate-500 text-xs sm:text-sm mt-1">
                                        Fill out the form below and we will get back to you as soon as possible.
                                    </p>
                                    {error && (
                                        <div className="mt-3 p-3 bg-red-50 border border-red-100 text-[#E51A22] rounded-xl text-xs font-medium">
                                            {error}
                                        </div>
                                    )}
                                </div>
                                
                                <form className="space-y-4 flex-1 flex flex-col justify-between" onSubmit={handleSubmit}>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                    </div>
                                    
                                    <div className="pt-2">
                                        <button 
                                            type="submit" 
                                            disabled={isSubmitting}
                                            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2.5 text-white font-bold text-sm sm:text-[15px] px-7 py-3.5 rounded-xl transition-all cursor-pointer shadow-md ${
                                                isSubmitting ? "bg-[#E51A22]/70 cursor-not-allowed" : "bg-[#E51A22] hover:bg-[#c9161d] hover:shadow-lg hover:shadow-[#E51A22]/25 hover:-translate-y-0.5 active:scale-95"
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

                    {/* Map Section (Beside the Form - Aeni Baju ma Map) */}
                    <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm p-5 sm:p-7 md:p-8 flex flex-col justify-between h-full">
                        <div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                                <div>
                                    <span className="inline-block text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full mb-2">
                                        STORE LOCATION
                                    </span>
                                    <h2 className="text-xl sm:text-2xl font-black text-[#1A1A24]">
                                        Find Us Here
                                    </h2>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/80 w-fit">
                                    <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                    <span>Open: 10am - 9pm</span>
                                </div>
                            </div>
                            <p className="text-slate-500 text-xs sm:text-sm mb-4">
                                Located in the prime shopping hub of Surat. Come explore our interactive play tables and exclusive toy collections in person!
                            </p>
                        </div>

                        {/* Interactive Google Map */}
                        <div className="flex-1 w-full min-h-[280px] sm:min-h-[320px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner relative group">
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
                                className="w-full h-full min-h-[280px] relative z-0 transition-all duration-500"
                            ></iframe>
                        </div>

                        {/* Map Footer Bar with Direct Navigation Link */}
                        <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-2 text-xs text-slate-600 font-medium truncate max-w-sm">
                                <MapPin className="w-4 h-4 text-[#E51A22] shrink-0" />
                                <span className="truncate">Tulsi Arcade, Sudama Chowk, Mota Varachha, Surat</span>
                            </div>
                            <a 
                                href="https://www.google.com/maps/place/Tulsi+Arcade/@21.2395209,72.8755431,812m/data=!3m1!1e3!4m10!1m2!2m1!1sTulsi+Arcade,+Mota+Varachha,+Surat!3m6!1s0x3be04f705dffe915:0x1fc83e2ebcf890f5!8m2!3d21.2389143!4d72.8801442"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1c274c] hover:bg-[#E51A22] text-white text-xs font-bold rounded-xl transition-all shadow-xs shrink-0 cursor-pointer"
                            >
                                <span>Get Directions</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Contact;