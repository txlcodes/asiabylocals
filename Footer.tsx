import React from 'react';
import { Instagram } from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-[#001A33] text-white pt-12 pb-6 px-6 mt-12">
            <div className="max-w-[1200px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
                    <div className="col-span-1 lg:col-span-1">
                        <a href="/" className="inline-block mb-4">
                            <img src="/logo.png" alt="AsiaByLocals Logo" className="h-20 w-auto invert brightness-0" />
                        </a>
                        <p className="text-gray-400 text-[13px] leading-relaxed">
                            Empowering local experts across Asia to share their heritage directly with curious travelers.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h5 className="font-black text-xs uppercase tracking-widest text-gray-500">Language</h5>
                        <div className="bg-white/5 border border-white/10 p-2.5 rounded-lg flex justify-between items-center text-sm font-bold text-gray-300">
                            English (International)
                        </div>
                        <h5 className="font-black text-xs uppercase tracking-widest text-gray-500 mt-2">Currency</h5>
                        <div className="bg-white/5 border border-white/10 p-2.5 rounded-lg flex justify-between items-center text-sm font-bold text-gray-300">
                            US Dollar ($)
                        </div>
                    </div>

                    <div>
                        <h5 className="font-black text-xs uppercase tracking-widest text-gray-500 mb-5">Support</h5>
                        <ul className="space-y-3 text-sm font-bold text-gray-400">
                            <li><a href="/support" className="hover:text-white transition-colors">Support</a></li>
                            <li><a href="/safety-guidelines" className="hover:text-white transition-colors">Safety Guidelines</a></li>
                            <li><a href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                            <li><a href="/terms-and-conditions" className="hover:text-white transition-colors">Terms &amp; Conditions</a></li>
                        </ul>
                    </div>

                    <div>
                        <h5 className="font-black text-xs uppercase tracking-widest text-gray-500 mb-5">Company</h5>
                        <ul className="space-y-3 text-sm font-bold text-gray-400">
                            <li><a href="/about-us" className="hover:text-white transition-colors">About Us</a></li>
                            <li><a href="/supplier" className="hover:text-white transition-colors">Become a Supplier</a></li>
                        </ul>
                    </div>
                </div>

                {/* Payment Methods */}
                <div className="pt-8 border-t border-white/5 mb-8">
                    <h5 className="font-black text-xs uppercase tracking-widest text-gray-500 mb-4 text-center">We Accept</h5>
                    <div className="flex flex-wrap justify-center items-center gap-4">
                        {/* Visa */}
                        <div className="bg-white rounded-md px-2.5 py-1.5 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow" title="Visa">
                            <img src="/visa-logo.png" alt="Visa" className="h-6 w-auto object-contain" />
                        </div>
                        {/* Mastercard */}
                        <div className="bg-white rounded-md px-2.5 py-1.5 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow" title="Mastercard">
                            <svg viewBox="0 0 131.39 86.9" className="h-6 w-auto" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="43.45" cy="43.45" r="43.45" fill="#EB001B" />
                                <circle cx="87.94" cy="43.45" r="43.45" fill="#F79E1B" />
                                <path d="M65.7 11.2a43.3 43.3 0 0 0-16.2 32.3A43.3 43.3 0 0 0 65.7 75.7 43.3 43.3 0 0 0 81.8 43.5 43.3 43.3 0 0 0 65.7 11.2z" fill="#FF5F00" />
                            </svg>
                        </div>
                        {/* Amex */}
                        <div className="bg-white rounded-md px-2.5 py-1.5 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow" title="American Express">
                            <span className="text-[#2E77BB] font-black text-sm tracking-tight">AMEX</span>
                        </div>
                        {/* PayPal */}
                        <div className="bg-white rounded-md px-2.5 py-1.5 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow" title="PayPal">
                            <span className="font-black text-sm"><span style={{ color: '#69b3e7' }}>Pay</span><span style={{ color: '#003087' }}>Pal</span></span>
                        </div>
                        {/* Razorpay */}
                        <div className="bg-white rounded-md px-2.5 py-1.5 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow" title="Razorpay">
                            <span className="font-black text-sm" style={{ color: '#528FF0' }}>Razorpay</span>
                        </div>

                        {/* Apple Pay */}
                        <div className="bg-white rounded-md px-2.5 py-1.5 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow" title="Apple Pay">
                            <span className="font-black text-sm text-black flex items-center gap-1">
                                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" /></svg>
                                Pay
                            </span>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] font-black uppercase tracking-widest text-gray-500">
                    <span>&copy; {new Date().getFullYear()} AsiaByLocals HQ • Authentic Experiences Only</span>
                    <div className="flex gap-6">
                        <a
                            href="https://www.instagram.com/asiabylocals/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-white transition-colors flex items-center gap-2 group"
                        >
                            <Instagram size={15} className="group-hover:scale-110 transition-transform" />
                            <span>Instagram</span>
                        </a>
                        <span className="hover:text-white cursor-pointer transition-colors">Facebook</span>
                        <span className="hover:text-white cursor-pointer transition-colors">LinkedIn</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
