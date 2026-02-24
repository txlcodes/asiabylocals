import React from 'react';
import { ChevronRight } from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-[#001A33] text-white pt-20 pb-10 px-6 mt-12">
            <div className="max-w-[1200px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
                    <div className="col-span-1 lg:col-span-1">
                        <a href="/" className="inline-block mb-6">
                            <img src="/logo.png" alt="AsiaByLocals Logo" className="h-20 w-auto invert brightness-0" />
                        </a>
                        <p className="text-gray-400 text-[14px] leading-relaxed">
                            Empowering local experts across Asia to share their heritage directly with curious travelers.
                        </p>
                    </div>

                    <div className="flex flex-col gap-6">
                        <h5 className="font-black text-xs uppercase tracking-widest text-gray-500">Language</h5>
                        <div className="bg-white/5 border border-white/10 p-3 rounded-lg flex justify-between items-center text-sm font-bold text-gray-300">
                            English (International)
                        </div>
                        <h5 className="font-black text-xs uppercase tracking-widest text-gray-500 mt-4">Currency</h5>
                        <div className="bg-white/5 border border-white/10 p-3 rounded-lg flex justify-between items-center text-sm font-bold text-gray-300">
                            US Dollar ($)
                        </div>
                    </div>

                    <div>
                        <h5 className="font-black text-xs uppercase tracking-widest text-gray-500 mb-8">Support</h5>
                        <ul className="space-y-4 text-sm font-bold text-gray-400">
                            <li><a href="/support" className="hover:text-white transition-colors">Support</a></li>
                            <li><a href="/safety-guidelines" className="hover:text-white transition-colors">Safety Guidelines</a></li>
                            <li><a href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                            <li><a href="/terms-and-conditions" className="hover:text-white transition-colors">Terms & Conditions</a></li>
                        </ul>
                    </div>

                    <div>
                        <h5 className="font-black text-xs uppercase tracking-widest text-gray-500 mb-8">Company</h5>
                        <ul className="space-y-4 text-sm font-bold text-gray-400">
                            <li><a href="/about-us" className="hover:text-white transition-colors">About Us</a></li>
                            <li><a href="/supplier" className="hover:text-white transition-colors">Become a Supplier</a></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[11px] font-black uppercase tracking-widest text-gray-500">
                    <span>&copy; {new Date().getFullYear()} AsiaByLocals HQ • Authentic Experiences Only</span>
                    <div className="flex gap-4">
                        <span className="hover:text-white cursor-pointer">Instagram</span>
                        <span className="hover:text-white cursor-pointer">Facebook</span>
                        <span className="hover:text-white cursor-pointer">LinkedIn</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
