'use client';

import React, { useState } from 'react';
import { X, User, Mail, Phone, MapPin, MessageSquare, Loader2 } from 'lucide-react';
import { COUNTRIES_LIST } from '@/lib/countries_list';

interface BookingFormProps {
    tourTitle: string;
    bookingDate: Date;
    guests: number;
    totalAmount: number;
    currency: string;
    onSubmit: (data: any) => Promise<void>;
    onClose: () => void;
    isSubmitting?: boolean;
}

const BookingForm: React.FC<BookingFormProps> = ({
    tourTitle,
    bookingDate,
    guests,
    totalAmount,
    currency,
    onSubmit,
    onClose,
    isSubmitting = false
}) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        country: '',
        specialRequests: ''
    });
    const [emailError, setEmailError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Final email validation before submission
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(formData.email)) {
            setEmailError('Please enter a valid email address');
            return;
        }

        await onSubmit({
            ...formData,
            // map phone to phoneNumber and countryCode
            phoneNumber: formData.phone,
            countryCode: '' // User enters full number
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div>
                        <h2 className="text-2xl font-black text-[#001A33]">Confirm Booking</h2>
                        <p className="text-sm text-gray-500 font-semibold mt-1">{tourTitle}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X size={24} className="text-gray-500" />
                    </button>
                </div>

                {/* Summary Banner */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Amount</div>
                        <div className="text-xl font-black text-[#10B981]">
                            {currency === 'INR' ? '₹' : '$'}{totalAmount.toLocaleString()}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Guests</div>
                        <div className="font-black text-[#001A33]">{guests}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Date</div>
                        <div className="font-black text-[#001A33]">
                            {new Date(bookingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-[#001A33] mb-1.5">Full Name *</label>
                        <div className="relative">
                            <input
                                type="text"
                                required
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-[#001A33] focus:ring-2 focus:ring-[#10B981] focus:border-transparent outline-none transition-all"
                                placeholder="John Doe"
                            />
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-[#001A33] mb-1.5">Email Address *</label>
                        <div className="relative">
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => {
                                    setFormData({ ...formData, email: e.target.value });
                                    if (emailError) setEmailError('');
                                }}
                                onBlur={(e) => {
                                    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                                    if (!emailRegex.test(e.target.value)) {
                                        setEmailError('Please enter a valid email address (e.g., name@example.com)');
                                    }
                                }}
                                className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl font-semibold text-[#001A33] outline-none transition-all ${emailError
                                    ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                                    : 'border-gray-200 focus:ring-2 focus:ring-[#10B981] focus:border-transparent'
                                    }`}
                                placeholder="john@example.com"
                            />
                            <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 ${emailError ? 'text-red-500' : 'text-gray-400'}`} size={18} />
                        </div>
                        {emailError && (
                            <p className="text-red-500 text-xs font-bold mt-1.5 animate-in fade-in slide-in-from-top-1">
                                {emailError}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-[#001A33] mb-1.5">Country</label>
                            <div className="relative">
                                <select
                                    required
                                    value={formData.country}
                                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-[#001A33] focus:ring-2 focus:ring-[#10B981] focus:border-transparent outline-none transition-all appearance-none"
                                >
                                    <option value="" disabled>Select Country</option>
                                    {COUNTRIES_LIST.map((country) => (
                                        <option key={country} value={country}>{country}</option>
                                    ))}
                                </select>
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-[#001A33] mb-1.5">Phone *</label>
                            <div className="relative">
                                <input
                                    type="tel"
                                    required
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-[#001A33] focus:ring-2 focus:ring-[#10B981] focus:border-transparent outline-none transition-all"
                                    placeholder="+1 234 567 890"
                                />
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-[#001A33] mb-1.5">Special Requests</label>
                        <div className="relative">
                            <textarea
                                value={formData.specialRequests}
                                onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-[#001A33] focus:ring-2 focus:ring-[#10B981] focus:border-transparent outline-none transition-all min-h-[100px] resize-none"
                                placeholder="Dietary requirements, pickup details, etc."
                            />
                            <MessageSquare className="absolute left-3 top-4 text-gray-400" size={18} />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-black py-4 rounded-xl text-lg transition-all shadow-lg shadow-green-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Processing...
                            </>
                        ) : (
                            'Proceed to Payment'
                        )}
                    </button>

                    <p className="text-center text-xs text-gray-400 font-medium">
                        Secure payment via Razorpay. Your data is encrypted.
                    </p>
                </form>
            </div>
        </div>
    );
};

export default BookingForm;
