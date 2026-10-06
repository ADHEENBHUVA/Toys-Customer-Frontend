import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle2, Loader2 } from 'lucide-react';
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
        // If it's the phone field, only allow numbers and max 10 chars
        if (e.target.name === 'phone') {
            const value = e.target.value.replace(/\D/g, '').slice(0, 10);
            setFormData({ ...formData, phone: value });
            return;
        }
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Final validation for 10 digits
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
        <div className="font-['Outfit'] bg-white min-h-screen">
            {/* Header Banner */}
            <div className="bg-gradient-to-b from-[#fcf3ea]/50 to-white pt-8 pb-12 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-8 left-8 text-[#e9b896] opacity-50 text-2xl">✦</div>
                <div className="absolute top-16 right-16 text-[#93b38c] opacity-30 text-xl">✦</div>
                <div className="absolute bottom-8 left-1/4 text-[#e8b960] opacity-40 text-lg">✦</div>

                <div className="max-w-[1000px] mx-auto px-4 md:px-6 relative z-10">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-[12px] font-medium mb-4">
                        <Link to="/" className="text-slate-500 hover:text-[#e6a27a] transition-colors">Home</Link>
                        <span className="text-slate-300">/</span>
                        <span className="text-[#e6a27a] font-bold">Contact</span>
                    </div>

                    <div className="max-w-xl">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-[#3d3130] mb-3 leading-tight">
                            Let's Get in <span className="text-[#e6a27a] italic">Touch</span>
                        </h1>
                        <p className="text-slate-500 text-[14px] md:text-[15px] leading-relaxed">
                            Have a question about our toys, your order, or just want to say hello? We'd love to hear from you. Our team is always here to help.
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-[1000px] mx-auto px-4 md:px-6 pb-16 -mt-4 relative z-20">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
                    
                    {/* Left Section: Info Cards (Vertical) */}
                    <div className="lg:w-[35%] flex flex-col gap-4">
                        {/* Phone Card */}
                        <a href="tel:1234567868" className="block bg-white rounded-3xl p-6 border border-[#f3eee7] shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden flex flex-col items-center text-center cursor-pointer">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#fcf3ea] to-transparent opacity-50 rounded-bl-full pointer-events-none transition-transform duration-500 group-hover:scale-110"></div>
                            <div className="w-12 h-12 rounded-full bg-[#fcf3ea] flex items-center justify-center text-[#e6a27a] mb-4 group-hover:scale-110 group-hover:bg-[#e6a27a] group-hover:text-white transition-all duration-300 shadow-sm">
                                <Phone className="w-5 h-5" strokeWidth={2} />
                            </div>
                            <h3 className="font-bold text-[#3d3130] text-[16px] mb-1 font-serif">Phone Support</h3>
                            <p className="text-slate-500 text-[13px] leading-relaxed">
                                Mon - Fri, 9am to 6pm<br />
                                <span className="text-[#e6a27a] font-bold mt-1 inline-block">123-456-7868</span>
                            </p>
                        </a>
                        
                        {/* Email Card */}
                        <a href="mailto:hello@littlejoys.com" className="block bg-white rounded-3xl p-6 border border-[#f3eee7] shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden flex flex-col items-center text-center cursor-pointer">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#eef4ed] to-transparent opacity-50 rounded-bl-full pointer-events-none transition-transform duration-500 group-hover:scale-110"></div>
                            <div className="w-12 h-12 rounded-full bg-[#eef4ed] flex items-center justify-center text-[#93b38c] mb-4 group-hover:scale-110 group-hover:bg-[#93b38c] group-hover:text-white transition-all duration-300 shadow-sm">
                                <Mail className="w-5 h-5" strokeWidth={2} />
                            </div>
                            <h3 className="font-bold text-[#3d3130] text-[16px] mb-1 font-serif">Email Us</h3>
                            <p className="text-slate-500 text-[13px] leading-relaxed">
                                We'll reply within 24 hours<br />
                                <span className="text-[#93b38c] font-bold mt-1 inline-block">hello@littlejoys.com</span>
                            </p>
                        </a>
                        
                        {/* Address Card */}
                        <a href="https://www.google.com/maps/place/Tulsi+Arcade/@21.2395209,72.8755431,812m/data=!3m1!1e3!4m10!1m2!2m1!1sTulsi+Arcade,+Mota+Varachha,+Surat!3m6!1s0x3be04f705dffe915:0x1fc83e2ebcf890f5!8m2!3d21.2389143!4d72.8801442!15sCiJUdWxzaSBBcmNhZGUsIE1vdGEgVmFyYWNoaGEsIFN1cmF0WiIiIHR1bHNpIGFyY2FkZSBtb3RhIHZhcmFjaGhhIHN1cmF0kgEPc2hvcHBpbmdfY2VudGVy4AEA!16s%2Fg%2F11rjyphkmm?entry=ttu&g_ep=EgoyMDI2MDkzMC4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer" className="block bg-white rounded-3xl p-6 border border-[#f3eee7] shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden flex flex-col items-center text-center cursor-pointer">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#fef5e7] to-transparent opacity-50 rounded-bl-full pointer-events-none transition-transform duration-500 group-hover:scale-110"></div>
                            <div className="w-12 h-12 rounded-full bg-[#fef5e7] flex items-center justify-center text-[#e8b960] mb-4 group-hover:scale-110 group-hover:bg-[#e8b960] group-hover:text-white transition-all duration-300 shadow-sm">
                                <MapPin className="w-5 h-5" strokeWidth={2} />
                            </div>
                            <h3 className="font-bold text-[#3d3130] text-[16px] mb-1 font-serif">Our Store</h3>
                            <p className="text-slate-500 text-[13px] leading-relaxed">
                                Come visit us in person<br />
                                <span className="text-[#3d3130] font-medium mt-1 inline-block">Tulsi Arcade, Mota Varachha, Surat</span>
                            </p>
                        </a>
                    </div>

                    {/* Right Section: Contact Form */}
                    <div className="lg:w-[65%] flex flex-col">
                        <div className="h-full bg-gradient-to-br from-[#fcfaf7] to-white rounded-3xl border border-[#f3eee7] shadow-sm overflow-hidden relative">
                            {/* Background Decor */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#fcf3ea]/80 to-transparent rounded-bl-full pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#eef4ed]/80 to-transparent rounded-tr-full pointer-events-none"></div>
                            
                            <div className="p-6 md:p-8 relative z-10 flex flex-col justify-center h-full">
                                {isSubmitted ? (
                                    <div className="text-center py-8 px-4">
                                        <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm border border-green-100">
                                            <CheckCircle2 className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-[#3d3130] font-serif mb-3">Message Sent!</h3>
                                        <p className="text-slate-500 text-[14px] max-w-sm mx-auto mb-6">
                                            Thank you for reaching out to us. Our team will get back to you as soon as possible.
                                        </p>
                                        <button 
                                            onClick={() => setIsSubmitted(false)}
                                            className="text-[#e6a27a] font-bold text-[14px] hover:underline"
                                        >
                                            Send another message
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="mb-6">
                                            <h2 className="text-2xl md:text-3xl font-bold text-[#3d3130] mb-2 font-serif">
                                                Send a Message
                                            </h2>
                                            <p className="text-slate-500 text-[14px]">
                                                Fill out the form below and we will get back to you as soon as possible.
                                            </p>
                                            {error && (
                                                <div className="mt-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm">
                                                    {error}
                                                </div>
                                            )}
                                        </div>
                                        
                                        <form className="space-y-5" onSubmit={handleSubmit}>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <div>
                                                    <label className="block text-[12px] font-bold text-[#3d3130] mb-1.5">First Name</label>
                                                    <input 
                                                        type="text" 
                                                        name="firstName"
                                                        value={formData.firstName}
                                                        onChange={handleChange}
                                                        placeholder="Jane" 
                                                        required
                                                        className="w-full bg-white border border-[#f3eee7] rounded-lg px-4 py-3 text-[13px] text-[#3d3130] focus:outline-none focus:border-[#e6a27a] focus:ring-4 focus:ring-[#e6a27a]/10 transition-all placeholder-slate-300 shadow-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[12px] font-bold text-[#3d3130] mb-1.5">Last Name</label>
                                                    <input 
                                                        type="text" 
                                                        name="lastName"
                                                        value={formData.lastName}
                                                        onChange={handleChange}
                                                        placeholder="Doe" 
                                                        required
                                                        className="w-full bg-white border border-[#f3eee7] rounded-lg px-4 py-3 text-[13px] text-[#3d3130] focus:outline-none focus:border-[#e6a27a] focus:ring-4 focus:ring-[#e6a27a]/10 transition-all placeholder-slate-300 shadow-sm"
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <div>
                                                    <label className="block text-[12px] font-bold text-[#3d3130] mb-1.5">Email Address</label>
                                                    <input 
                                                        type="email" 
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        placeholder="jane@example.com" 
                                                        required
                                                        className="w-full bg-white border border-[#f3eee7] rounded-lg px-4 py-3 text-[13px] text-[#3d3130] focus:outline-none focus:border-[#e6a27a] focus:ring-4 focus:ring-[#e6a27a]/10 transition-all placeholder-slate-300 shadow-sm" 
                                                        pattern="[^@\s]+@[^@\s]+\.[^@\s]+" 
                                                        title="Please enter a valid email address with @ and ." 
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[12px] font-bold text-[#3d3130] mb-1.5">Phone Number</label>
                                                    <input 
                                                        type="tel" 
                                                        name="phone"
                                                        value={formData.phone}
                                                        onChange={handleChange}
                                                        placeholder="9876543210" 
                                                        required
                                                        maxLength={10}
                                                        className="w-full bg-white border border-[#f3eee7] rounded-lg px-4 py-3 text-[13px] text-[#3d3130] focus:outline-none focus:border-[#e6a27a] focus:ring-4 focus:ring-[#e6a27a]/10 transition-all placeholder-slate-300 shadow-sm"
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div>
                                                <label className="block text-[12px] font-bold text-[#3d3130] mb-1.5">Message</label>
                                                <textarea 
                                                    name="message"
                                                    value={formData.message}
                                                    onChange={handleChange}
                                                    placeholder="How can we help you today?" 
                                                    rows="4"
                                                    required
                                                    className="w-full bg-white border border-[#f3eee7] rounded-lg px-4 py-3 text-[13px] text-[#3d3130] focus:outline-none focus:border-[#e6a27a] focus:ring-4 focus:ring-[#e6a27a]/10 transition-all placeholder-slate-300 resize-none shadow-sm"
                                                ></textarea>
                                            </div>
                                            
                                            <div className="pt-1">
                                                <button 
                                                    type="submit" 
                                                    disabled={isSubmitting}
                                                    className={`w-full sm:w-auto min-w-[160px] inline-flex items-center justify-center gap-2 text-white font-bold text-[14px] px-6 py-3 rounded-lg transition-all shadow-sm ${
                                                        isSubmitting ? "bg-[#d99268] opacity-80 cursor-not-allowed" : "bg-[#e6a27a] hover:bg-[#d99268] hover:shadow-md hover:-translate-y-0.5"
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
                                                            <Send className="w-4 h-4" />
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
                <div className="mt-16 relative">
                    {/* Decorative Background blob for Map */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-full bg-[#fef5e7] opacity-40 blur-3xl rounded-[100%] pointer-events-none"></div>
                    
                    <div className="relative bg-white p-4 md:p-6 lg:p-8 rounded-[2rem] border border-[#f3eee7] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                        <div className="mb-6 md:mb-8 text-center flex flex-col items-center">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#fcf3ea] to-white rounded-full flex items-center justify-center text-[#e6a27a] mb-3 shadow-sm border border-[#fae5d3]">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#3d3130] mb-2">Find Us Here</h2>
                            <p className="text-slate-500 text-[14px] max-w-[400px]">We're located in the heart of Surat. Come visit our store in person, we'd love to see you!</p>
                        </div>
                        <div className="w-full h-[350px] md:h-[450px] rounded-[1.5rem] overflow-hidden border border-[#f3eee7] shadow-inner relative group">
                            {/* Overlay that fades out on hover to make it feel interactive */}
                            <div className="absolute inset-0 bg-[#e6a27a]/5 pointer-events-none transition-opacity duration-300 group-hover:opacity-0"></div>
                            
                            <iframe 
                                src="https://maps.google.com/maps?q=Tulsi%20Arcade,%20Mota%20Varachha,%20Surat&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                                width="100%" 
                                height="100%" 
                                style={{ border: 0 }} 
                                allowFullScreen="" 
                                loading="lazy" 
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Google Maps Location of Tulsi Arcade, Surat"
                                className="w-full h-full grayscale-[20%] contrast-[95%] opacity-90 transition-all duration-500 group-hover:grayscale-0 group-hover:contrast-100 group-hover:opacity-100"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
