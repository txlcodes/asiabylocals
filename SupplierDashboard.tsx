import React, { useState, useEffect } from 'react';
import {
  User,
  LogOut,
  FileText,
  Plus,
  BarChart3,
  Settings,
  Bell,
  CheckCircle2,
  Clock,
  XCircle,
  Upload,
  Eye,
  Edit,
  Trash2,
  Calendar,
  DollarSign,
  Users,
  MapPin,
  Globe,
  Home,
  RefreshCw,
  Download,
  ShieldCheck,
  CreditCard,
  Building2,
  Wallet,
  Info
} from 'lucide-react';
import TourCreationForm from './TourCreationForm';

// Country to payment methods mapping
const COUNTRY_PAYMENT_METHODS: Record<string, string[]> = {
  'India': ['bank_transfer', 'upi', 'paypal', 'wise'],
  'Thailand': ['bank_transfer', 'paypal', 'credit_card', 'wise'],
  'Japan': ['bank_transfer', 'paypal', 'wise'],
  'Singapore': ['bank_transfer', 'paypal', 'credit_card', 'wise'],
  'Indonesia': ['bank_transfer', 'paypal', 'wise'],
  'Malaysia': ['bank_transfer', 'paypal', 'credit_card', 'wise'],
  'Vietnam': ['bank_transfer', 'paypal', 'wise'],
  'South Korea': ['bank_transfer', 'paypal', 'credit_card', 'wise'],
  'Philippines': ['bank_transfer', 'paypal', 'credit_card', 'wise'],
  'China': ['bank_transfer', 'paypal', 'wise'],
  'Taiwan': ['bank_transfer', 'paypal', 'credit_card', 'wise'],
  'Hong Kong': ['bank_transfer', 'paypal', 'credit_card', 'wise'],
  'Sri Lanka': ['bank_transfer', 'paypal', 'wise'],
  'Nepal': ['bank_transfer', 'paypal', 'wise'],
  'Cambodia': ['bank_transfer', 'paypal', 'wise'],
  'Myanmar': ['bank_transfer', 'paypal', 'wise'],
  'Laos': ['bank_transfer', 'paypal', 'wise'],
  'Bangladesh': ['bank_transfer', 'paypal', 'wise']
};

// Payment method labels
const PAYMENT_METHOD_LABELS: Record<string, string> = {
  'bank_transfer': 'Bank Transfer',
  'paypal': 'PayPal',
  'credit_card': 'Credit/Debit Card',
  'upi': 'UPI (India)',
  'wise': 'Wise (formerly TransferWise)'
};

// Tax ID types by country
const TAX_ID_TYPES: Record<string, string[]> = {
  'India': ['GSTIN', 'PAN'],
  'Thailand': ['VAT', 'Tax ID'],
  'Japan': ['Tax ID'],
  'Singapore': ['GST', 'UEN'],
  'Indonesia': ['NPWP'],
  'Malaysia': ['SST', 'Tax ID'],
  'Vietnam': ['Tax Code'],
  'South Korea': ['Business Registration Number'],
  'Philippines': ['TIN'],
  'China': ['Tax ID'],
  'Taiwan': ['Tax ID'],
  'Hong Kong': ['BRN'],
  'Sri Lanka': ['VAT', 'Tax ID'],
  'Nepal': ['PAN', 'VAT'],
  'Cambodia': ['Tax ID'],
  'Myanmar': ['Tax ID'],
  'Laos': ['Tax ID'],
  'Bangladesh': ['TIN', 'VAT']
};


// Payment Details Display Component
const PaymentDetailsDisplay: React.FC<{ paymentDetails: any }> = ({ paymentDetails }) => {
  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'bank_transfer':
        return <Building2 size={20} className="text-[#10B981]" />;
      case 'paypal':
        return <Wallet size={20} className="text-[#10B981]" />;
      case 'credit_card':
        return <CreditCard size={20} className="text-[#10B981]" />;
      case 'upi':
        return <Wallet size={20} className="text-[#10B981]" />;
      case 'wise':
        return <Wallet size={20} className="text-[#10B981]" />;
      default:
        return <DollarSign size={20} className="text-[#10B981]" />;
    }
  };

  const details = paymentDetails.paymentMethodDetails || {};

  return (
    <div className="space-y-4">
      {/* Payment Method */}
      <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          {getPaymentMethodIcon(paymentDetails.paymentMethod)}
          <div>
            <p className="text-[12px] font-bold text-gray-600">Payment Method</p>
            <p className="text-[16px] font-black text-[#001A33]">
              {PAYMENT_METHOD_LABELS[paymentDetails.paymentMethod] || paymentDetails.paymentMethod}
            </p>
          </div>
          {paymentDetails.paymentDetailsVerified && (
            <span className="ml-auto px-3 py-1 bg-[#10B981]/10 text-[#10B981] rounded-full text-[11px] font-bold flex items-center gap-1">
              <CheckCircle2 size={12} />
              Verified
            </span>
          )}
        </div>

        {/* Bank Transfer Details */}
        {paymentDetails.paymentMethod === 'bank_transfer' && details.bankName && (
          <div className="mt-4 space-y-2 text-[13px]">
            <div className="flex justify-between">
              <span className="font-bold text-gray-600">Bank Name:</span>
              <span className="text-[#001A33]">{details.bankName}</span>
            </div>
            {details.accountNumber && (
              <div className="flex justify-between">
                <span className="font-bold text-gray-600">Account Number:</span>
                <span className="text-[#001A33]">{details.accountNumber}</span>
              </div>
            )}
            {details.accountType && (
              <div className="flex justify-between">
                <span className="font-bold text-gray-600">Account Type:</span>
                <span className="text-[#001A33]">{details.accountType}</span>
              </div>
            )}
            {details.ifscCode && (
              <div className="flex justify-between">
                <span className="font-bold text-gray-600">IFSC Code:</span>
                <span className="text-[#001A33]">{details.ifscCode}</span>
              </div>
            )}
            {details.swiftCode && (
              <div className="flex justify-between">
                <span className="font-bold text-gray-600">SWIFT/BIC:</span>
                <span className="text-[#001A33]">{details.swiftCode}</span>
              </div>
            )}
            {details.beneficiaryName && (
              <div className="flex justify-between">
                <span className="font-bold text-gray-600">Beneficiary Name:</span>
                <span className="text-[#001A33]">{details.beneficiaryName}</span>
              </div>
            )}
          </div>
        )}

        {/* PayPal Details */}
        {paymentDetails.paymentMethod === 'paypal' && details.paypalEmail && (
          <div className="mt-4 space-y-2 text-[13px]">
            <div className="flex justify-between">
              <span className="font-bold text-gray-600">PayPal Email:</span>
              <span className="text-[#001A33]">{details.paypalEmail}</span>
            </div>
            {details.accountType && (
              <div className="flex justify-between">
                <span className="font-bold text-gray-600">Account Type:</span>
                <span className="text-[#001A33]">{details.accountType}</span>
              </div>
            )}
          </div>
        )}

        {/* Credit Card Details */}
        {paymentDetails.paymentMethod === 'credit_card' && details.cardHolderName && (
          <div className="mt-4 space-y-2 text-[13px]">
            <div className="flex justify-between">
              <span className="font-bold text-gray-600">Card Holder:</span>
              <span className="text-[#001A33]">{details.cardHolderName}</span>
            </div>
            {details.cardType && (
              <div className="flex justify-between">
                <span className="font-bold text-gray-600">Card Type:</span>
                <span className="text-[#001A33]">{details.cardType}</span>
              </div>
            )}
            {details.last4Digits && (
              <div className="flex justify-between">
                <span className="font-bold text-gray-600">Card Number:</span>
                <span className="text-[#001A33]">****{details.last4Digits}</span>
              </div>
            )}
          </div>
        )}

        {/* UPI Details */}
        {paymentDetails.paymentMethod === 'upi' && details.upiId && (
          <div className="mt-4 space-y-2 text-[13px]">
            <div className="flex justify-between">
              <span className="font-bold text-gray-600">UPI ID:</span>
              <span className="text-[#001A33]">{details.upiId}</span>
            </div>
          </div>
        )}

        {/* Wise Details */}
        {paymentDetails.paymentMethod === 'wise' && details.wiseEmail && (
          <div className="mt-4 space-y-2 text-[13px]">
            <div className="flex justify-between">
              <span className="font-bold text-gray-600">Wise Email:</span>
              <span className="text-[#001A33]">{details.wiseEmail}</span>
            </div>
            {details.accountHolderName && (
              <div className="flex justify-between">
                <span className="font-bold text-gray-600">Account Holder:</span>
                <span className="text-[#001A33]">{details.accountHolderName}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tax Details */}
      {paymentDetails.taxId && (
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="text-[#10B981]" size={20} />
            <div>
              <p className="text-[12px] font-bold text-gray-600">Tax Details</p>
              {paymentDetails.taxVerified && (
                <span className="text-[11px] text-[#10B981] font-bold flex items-center gap-1 mt-1">
                  <CheckCircle2 size={10} />
                  Verified
                </span>
              )}
            </div>
          </div>
          <div className="space-y-2 text-[13px]">
            {paymentDetails.taxIdType && (
              <div className="flex justify-between">
                <span className="font-bold text-gray-600">Tax ID Type:</span>
                <span className="text-[#001A33]">{paymentDetails.taxIdType}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="font-bold text-gray-600">Tax ID:</span>
              <span className="text-[#001A33]">{paymentDetails.taxId}</span>
            </div>
            {paymentDetails.taxCountry && (
              <div className="flex justify-between">
                <span className="font-bold text-gray-600">Country:</span>
                <span className="text-[#001A33]">{paymentDetails.taxCountry}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Payment Currency */}
      {paymentDetails.paymentCurrency && (
        <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
          <div className="flex justify-between items-center">
            <span className="text-[13px] font-bold text-gray-600">Payment Currency:</span>
            <span className="text-[16px] font-black text-[#001A33]">{paymentDetails.paymentCurrency}</span>
          </div>
        </div>
      )}
    </div>
  );
};

// Payment Details Form Component
interface PaymentDetailsFormProps {
  paymentFormData: any;
  setPaymentFormData: (data: any) => void;
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
}

const PaymentDetailsForm: React.FC<PaymentDetailsFormProps> = ({
  paymentFormData,
  setPaymentFormData,
  selectedCountry,
  setSelectedCountry,
  onSave,
  onCancel,
  isSaving
}) => {
  const availableMethods = COUNTRY_PAYMENT_METHODS[selectedCountry] || ['bank_transfer', 'paypal'];
  const availableTaxTypes = TAX_ID_TYPES[selectedCountry] || ['Tax ID'];

  const updatePaymentMethodDetails = (field: string, value: any) => {
    setPaymentFormData({
      ...paymentFormData,
      paymentMethodDetails: {
        ...paymentFormData.paymentMethodDetails,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Info className="text-blue-600 mt-0.5" size={20} />
          <div>
            <h4 className="text-[14px] font-black text-[#001A33] mb-1">Payment Details Required</h4>
            <p className="text-[13px] text-gray-700 font-semibold">
              Add your payment details to receive monthly payouts. All information is encrypted and secure. Payments are processed on the 5th of each month.
            </p>
          </div>
        </div>
      </div>

      {/* Country Selection */}
      <div>
        <label className="block text-[14px] font-bold text-[#001A33] mb-2">
          Country <span className="text-red-500">*</span>
        </label>
        <select
          value={selectedCountry}
          onChange={(e) => {
            setSelectedCountry(e.target.value);
            setPaymentFormData({
              ...paymentFormData,
              paymentMethod: '',
              paymentMethodDetails: {}
            });
          }}
          className="w-full bg-white border-2 border-gray-200 rounded-xl py-3 px-4 font-bold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] outline-none"
        >
          {Object.keys(COUNTRY_PAYMENT_METHODS).map(country => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
        <p className="text-[12px] text-gray-500 font-semibold mt-1.5">
          Select the country where your payment account is located
        </p>
      </div>

      {/* Payment Method Selection */}
      <div>
        <label className="block text-[14px] font-bold text-[#001A33] mb-2">Payment Method *</label>
        <select
          value={paymentFormData.paymentMethod}
          onChange={(e) => {
            setPaymentFormData({
              ...paymentFormData,
              paymentMethod: e.target.value,
              paymentMethodDetails: {}
            });
          }}
          className="w-full bg-white border-2 border-gray-200 rounded-xl py-3 px-4 font-bold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] outline-none"
        >
          <option value="">Select payment method</option>
          {availableMethods.map(method => (
            <option key={method} value={method}>{PAYMENT_METHOD_LABELS[method]}</option>
          ))}
        </select>
      </div>

      {/* Bank Transfer Form */}
      {paymentFormData.paymentMethod === 'bank_transfer' && (
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-300">
            <Building2 className="text-[#10B981]" size={20} />
            <h4 className="text-[16px] font-black text-[#001A33]">Bank Transfer Details</h4>
          </div>
          <div>
            <label className="block text-[13px] font-bold text-[#001A33] mb-2">
              Bank Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={paymentFormData.paymentMethodDetails.bankName || ''}
              onChange={(e) => updatePaymentMethodDetails('bankName', e.target.value)}
              placeholder="e.g., Axis Bank"
              className="w-full bg-white border-2 border-gray-200 rounded-xl py-3 px-4 font-semibold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] outline-none"
            />
          </div>
          <div>
            <label className="block text-[13px] font-bold text-[#001A33] mb-2">Account Number *</label>
            <input
              type="text"
              value={paymentFormData.paymentMethodDetails.accountNumber || ''}
              onChange={(e) => updatePaymentMethodDetails('accountNumber', e.target.value)}
              placeholder="Enter account number"
              className="w-full bg-white border-2 border-gray-200 rounded-xl py-3 px-4 font-semibold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-bold text-[#001A33] mb-2">Account Type *</label>
              <select
                value={paymentFormData.paymentMethodDetails.accountType || ''}
                onChange={(e) => updatePaymentMethodDetails('accountType', e.target.value)}
                className="w-full bg-white border-2 border-gray-200 rounded-xl py-3 px-4 font-semibold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] outline-none"
              >
                <option value="">Select type</option>
                <option value="Savings">Savings</option>
                <option value="Current">Current</option>
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-bold text-[#001A33] mb-2">Beneficiary Name *</label>
              <input
                type="text"
                value={paymentFormData.paymentMethodDetails.beneficiaryName || ''}
                onChange={(e) => updatePaymentMethodDetails('beneficiaryName', e.target.value)}
                placeholder="Account holder name"
                className="w-full bg-white border-2 border-gray-200 rounded-xl py-3 px-4 font-semibold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] outline-none"
              />
            </div>
          </div>
          {selectedCountry === 'India' ? (
            <div>
              <label className="block text-[13px] font-bold text-[#001A33] mb-2">IFSC Code *</label>
              <input
                type="text"
                value={paymentFormData.paymentMethodDetails.ifscCode || ''}
                onChange={(e) => updatePaymentMethodDetails('ifscCode', e.target.value.toUpperCase())}
                placeholder="e.g., UTIB0000643"
                maxLength={11}
                className="w-full bg-white border-2 border-gray-200 rounded-xl py-3 px-4 font-semibold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] outline-none"
              />
            </div>
          ) : (
            <div>
              <label className="block text-[13px] font-bold text-[#001A33] mb-2">SWIFT/BIC Code *</label>
              <input
                type="text"
                value={paymentFormData.paymentMethodDetails.swiftCode || ''}
                onChange={(e) => updatePaymentMethodDetails('swiftCode', e.target.value.toUpperCase())}
                placeholder="e.g., AXISINBB643"
                className="w-full bg-white border-2 border-gray-200 rounded-xl py-3 px-4 font-semibold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] outline-none"
              />
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-bold text-[#001A33] mb-2">Bank City *</label>
              <input
                type="text"
                value={paymentFormData.paymentMethodDetails.bankCity || ''}
                onChange={(e) => updatePaymentMethodDetails('bankCity', e.target.value)}
                placeholder="e.g., Agra"
                className="w-full bg-white border-2 border-gray-200 rounded-xl py-3 px-4 font-semibold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] outline-none"
              />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-[#001A33] mb-2">Bank Zip/Postal Code *</label>
              <input
                type="text"
                value={paymentFormData.paymentMethodDetails.bankZip || ''}
                onChange={(e) => updatePaymentMethodDetails('bankZip', e.target.value)}
                placeholder="e.g., 282001"
                className="w-full bg-white border-2 border-gray-200 rounded-xl py-3 px-4 font-semibold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-[13px] font-bold text-[#001A33] mb-2">Bank Address *</label>
            <input
              type="text"
              value={paymentFormData.paymentMethodDetails.bankAddress || ''}
              onChange={(e) => updatePaymentMethodDetails('bankAddress', e.target.value)}
              placeholder="Full bank address"
              className="w-full bg-white border-2 border-gray-200 rounded-xl py-3 px-4 font-semibold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] outline-none"
            />
          </div>
          <div>
            <label className="block text-[13px] font-bold text-[#001A33] mb-2">Bank Country *</label>
            <input
              type="text"
              value={paymentFormData.paymentMethodDetails.bankCountry || selectedCountry}
              onChange={(e) => updatePaymentMethodDetails('bankCountry', e.target.value)}
              className="w-full bg-white border-2 border-gray-200 rounded-xl py-3 px-4 font-semibold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] outline-none"
            />
          </div>
        </div>
      )}

      {/* PayPal Form */}
      {paymentFormData.paymentMethod === 'paypal' && (
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-300">
            <Wallet className="text-[#10B981]" size={20} />
            <h4 className="text-[16px] font-black text-[#001A33]">PayPal Details</h4>
          </div>
          <div>
            <label className="block text-[13px] font-bold text-[#001A33] mb-2">
              PayPal Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={paymentFormData.paymentMethodDetails.paypalEmail || ''}
              onChange={(e) => updatePaymentMethodDetails('paypalEmail', e.target.value)}
              placeholder="your.email@example.com"
              className="w-full bg-white border-2 border-gray-200 rounded-xl py-3 px-4 font-semibold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] outline-none"
            />
          </div>
          <div>
            <label className="block text-[13px] font-bold text-[#001A33] mb-2">Account Type *</label>
            <select
              value={paymentFormData.paymentMethodDetails.accountType || ''}
              onChange={(e) => updatePaymentMethodDetails('accountType', e.target.value)}
              className="w-full bg-white border-2 border-gray-200 rounded-xl py-3 px-4 font-semibold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] outline-none"
            >
              <option value="">Select type</option>
              <option value="Personal">Personal</option>
              <option value="Business">Business</option>
            </select>
          </div>
          <div>
            <label className="block text-[13px] font-bold text-[#001A33] mb-2">Country *</label>
            <input
              type="text"
              value={paymentFormData.paymentMethodDetails.country || selectedCountry}
              onChange={(e) => updatePaymentMethodDetails('country', e.target.value)}
              className="w-full bg-white border-2 border-gray-200 rounded-xl py-3 px-4 font-semibold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] outline-none"
            />
          </div>
        </div>
      )}

      {/* Credit Card Form */}
      {paymentFormData.paymentMethod === 'credit_card' && (
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-300">
            <CreditCard className="text-[#10B981]" size={20} />
            <h4 className="text-[16px] font-black text-[#001A33]">Credit/Debit Card Details</h4>
          </div>
          <div>
            <label className="block text-[13px] font-bold text-[#001A33] mb-2">
              Card Holder Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={paymentFormData.paymentMethodDetails.cardHolderName || ''}
              onChange={(e) => updatePaymentMethodDetails('cardHolderName', e.target.value)}
              placeholder="Name on card"
              className="w-full bg-white border-2 border-gray-200 rounded-xl py-3 px-4 font-semibold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-bold text-[#001A33] mb-2">Card Type *</label>
              <select
                value={paymentFormData.paymentMethodDetails.cardType || ''}
                onChange={(e) => updatePaymentMethodDetails('cardType', e.target.value)}
                className="w-full bg-white border-2 border-gray-200 rounded-xl py-3 px-4 font-semibold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] outline-none"
              >
                <option value="">Select type</option>
                <option value="Visa">Visa</option>
                <option value="Mastercard">Mastercard</option>
                <option value="Amex">American Express</option>
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-bold text-[#001A33] mb-2">Last 4 Digits *</label>
              <input
                type="text"
                value={paymentFormData.paymentMethodDetails.last4Digits || ''}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                  updatePaymentMethodDetails('last4Digits', value);
                }}
                placeholder="1234"
                maxLength={4}
                className="w-full bg-white border-2 border-gray-200 rounded-xl py-3 px-4 font-semibold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-[13px] font-bold text-[#001A33] mb-2">Expiry Date (MM/YY) *</label>
            <input
              type="text"
              value={paymentFormData.paymentMethodDetails.expiryDate || ''}
              onChange={(e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length >= 2) {
                  value = value.slice(0, 2) + '/' + value.slice(2, 4);
                }
                updatePaymentMethodDetails('expiryDate', value);
              }}
              placeholder="MM/YY"
              maxLength={5}
              className="w-full bg-white border-2 border-gray-200 rounded-xl py-3 px-4 font-semibold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] outline-none"
            />
          </div>
          <div>
            <label className="block text-[13px] font-bold text-[#001A33] mb-2">Billing Address *</label>
            <input
              type="text"
              value={paymentFormData.paymentMethodDetails.billingAddress || ''}
              onChange={(e) => updatePaymentMethodDetails('billingAddress', e.target.value)}
              placeholder="Billing address"
              className="w-full bg-white border-2 border-gray-200 rounded-xl py-3 px-4 font-semibold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] outline-none"
            />
          </div>
        </div>
      )}

      {/* UPI Form */}
      {paymentFormData.paymentMethod === 'upi' && (
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-300">
            <Wallet className="text-[#10B981]" size={20} />
            <h4 className="text-[16px] font-black text-[#001A33]">UPI Details</h4>
          </div>
          <div>
            <label className="block text-[13px] font-bold text-[#001A33] mb-2">
              UPI ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={paymentFormData.paymentMethodDetails.upiId || ''}
              onChange={(e) => updatePaymentMethodDetails('upiId', e.target.value.toLowerCase())}
              placeholder="yourname@paytm or yourname@phonepe"
              className="w-full bg-white border-2 border-gray-200 rounded-xl py-3 px-4 font-semibold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] outline-none"
            />
            <p className="text-[11px] text-gray-500 font-semibold mt-2">
              Format: name@paytm, name@phonepe, name@googlepay, etc.
            </p>
          </div>
        </div>
      )}

      {/* Wise Form */}
      {paymentFormData.paymentMethod === 'wise' && (
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-300">
            <Wallet className="text-[#10B981]" size={20} />
            <h4 className="text-[16px] font-black text-[#001A33]">Wise Details</h4>
          </div>
          <div>
            <label className="block text-[13px] font-bold text-[#001A33] mb-2">
              Wise Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={paymentFormData.paymentMethodDetails.wiseEmail || ''}
              onChange={(e) => updatePaymentMethodDetails('wiseEmail', e.target.value)}
              placeholder="your.email@example.com"
              className="w-full bg-white border-2 border-gray-200 rounded-xl py-3 px-4 font-semibold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] outline-none"
            />
            <p className="text-[11px] text-gray-500 font-semibold mt-2">
              Enter the email address associated with your Wise account
            </p>
          </div>
          <div>
            <label className="block text-[13px] font-bold text-[#001A33] mb-2">
              Account Holder Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={paymentFormData.paymentMethodDetails.accountHolderName || ''}
              onChange={(e) => updatePaymentMethodDetails('accountHolderName', e.target.value)}
              placeholder="Name as it appears on your Wise account"
              className="w-full bg-white border-2 border-gray-200 rounded-xl py-3 px-4 font-semibold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] outline-none"
            />
          </div>
        </div>
      )}

      {/* Payment Currency */}
      <div>
        <label className="block text-[14px] font-bold text-[#001A33] mb-2">Payment Currency *</label>
        <select
          value={paymentFormData.paymentCurrency}
          onChange={(e) => setPaymentFormData({ ...paymentFormData, paymentCurrency: e.target.value })}
          className="w-full bg-white border-2 border-gray-200 rounded-xl py-3 px-4 font-bold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] outline-none"
        >
          <option value="INR">Indian Rupee (₹)</option>
          <option value="USD">US Dollar ($)</option>
          <option value="THB">Thai Baht (฿)</option>
          <option value="JPY">Japanese Yen (¥)</option>
          <option value="SGD">Singapore Dollar (S$)</option>
          <option value="IDR">Indonesian Rupiah (Rp)</option>
          <option value="MYR">Malaysian Ringgit (RM)</option>
          <option value="VND">Vietnamese Dong (₫)</option>
          <option value="KRW">South Korean Won (₩)</option>
          <option value="PHP">Philippine Peso (₱)</option>
          <option value="CNY">Chinese Yuan (¥)</option>
          <option value="TWD">Taiwan Dollar (NT$)</option>
          <option value="HKD">Hong Kong Dollar (HK$)</option>
          <option value="LKR">Sri Lankan Rupee (Rs)</option>
          <option value="NPR">Nepalese Rupee (Rs)</option>
        </select>
      </div>

      {/* Payment Frequency */}
      <div>
        <label className="block text-[14px] font-bold text-[#001A33] mb-2">Payment Frequency</label>
        <div className="space-y-2">
          <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer">
            <input
              type="radio"
              name="paymentFrequency"
              value="monthly"
              checked={paymentFormData.paymentFrequency === 'monthly'}
              onChange={(e) => setPaymentFormData({ ...paymentFormData, paymentFrequency: e.target.value })}
              className="w-4 h-4 text-[#10B981] focus:ring-[#10B981]"
            />
            <div>
              <p className="text-[14px] font-black text-[#001A33]">Once per month</p>
              <p className="text-[12px] text-gray-500 font-semibold">Payment will occur on the 5th business working day of the month</p>
            </div>
          </label>
        </div>
      </div>

      {/* Tax Details Section (Optional) */}
      <div className="pt-6 border-t border-gray-200">
        <h4 className="text-[16px] font-black text-[#001A33] mb-4">Tax Details (Optional)</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-[13px] font-bold text-[#001A33] mb-2">Tax ID Type</label>
            <select
              value={paymentFormData.taxIdType}
              onChange={(e) => setPaymentFormData({ ...paymentFormData, taxIdType: e.target.value })}
              className="w-full bg-white border-2 border-gray-200 rounded-xl py-3 px-4 font-semibold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] outline-none"
            >
              <option value="">Select tax ID type</option>
              {availableTaxTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[13px] font-bold text-[#001A33] mb-2">Tax ID Number</label>
            <input
              type="text"
              value={paymentFormData.taxId}
              onChange={(e) => setPaymentFormData({ ...paymentFormData, taxId: e.target.value })}
              placeholder="Enter tax identification number"
              className="w-full bg-white border-2 border-gray-200 rounded-xl py-3 px-4 font-semibold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] outline-none"
            />
          </div>
          <div>
            <label className="block text-[13px] font-bold text-[#001A33] mb-2">Country of Tax Registration</label>
            <select
              value={paymentFormData.taxCountry || ''}
              onChange={(e) => setPaymentFormData({ ...paymentFormData, taxCountry: e.target.value })}
              className="w-full bg-white border-2 border-gray-200 rounded-xl py-3 px-4 font-semibold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] outline-none"
            >
              <option value="">Select country</option>
              {Object.keys(COUNTRY_PAYMENT_METHODS).map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Save/Cancel Buttons */}
      <div className="flex gap-4 pt-4 border-t border-gray-200">
        <button
          onClick={onSave}
          disabled={isSaving || !paymentFormData.paymentMethod}
          className="flex-1 bg-[#10B981] hover:bg-[#059669] text-white font-black py-4 rounded-xl text-[16px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Saving...' : 'Save Payment Details'}
        </button>
        <button
          onClick={onCancel}
          disabled={isSaving}
          className="px-6 py-4 bg-gray-100 hover:bg-gray-200 text-[#001A33] font-bold rounded-xl text-[16px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

interface SupplierDashboardProps {
  supplier: {
    id: string;
    email: string;
    fullName: string;
    status: string;
    emailVerified: boolean;
    phone?: string;
    whatsapp?: string;
    verificationDocumentUrl?: string;
    certificates?: string; // JSON string array
  };
  onLogout: () => void;
}

const SupplierDashboard: React.FC<SupplierDashboardProps> = ({ supplier, onLogout }) => {
  const [currentSupplier, setCurrentSupplier] = React.useState(supplier);
  // Guard: Check if supplier exists BEFORE any state initialization
  if (!supplier || !supplier.id) {
    console.error('SupplierDashboard: supplier is not defined or missing id');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-black text-[#001A33] mb-4">Error Loading Dashboard</h2>
          <p className="text-gray-500 font-semibold mb-6">Supplier information is missing. Please log in again.</p>
          <button
            onClick={() => {
              localStorage.removeItem('supplier');
              window.location.href = '/supplier';
            }}
            className="px-6 py-2 bg-[#10B981] text-white font-bold rounded-lg hover:bg-[#059669] transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState<'overview' | 'activities' | 'bookings' | 'earnings' | 'profile'>('overview');
  const [tours, setTours] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [showTourForm, setShowTourForm] = useState(false);
  const [editingTour, setEditingTour] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  // Now supplier is guaranteed to exist, safe to access
  const [profileData, setProfileData] = useState({
    fullName: currentSupplier?.fullName || '',
    phone: currentSupplier?.phone || '',
    whatsapp: currentSupplier?.whatsapp || ''
  });

  // Update profileData when supplier changes
  React.useEffect(() => {
    if (currentSupplier) {
      setProfileData({
        fullName: currentSupplier.fullName || '',
        phone: currentSupplier.phone || '',
        whatsapp: currentSupplier.whatsapp || ''
      });
    }
  }, [currentSupplier]);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [documents, setDocuments] = useState<{
    license: string | null;
    certificates: string[];
  }>({
    license: null,
    certificates: []
  });
  const [isUploadingLicense, setIsUploadingLicense] = useState(false);
  const [isUploadingCertificates, setIsUploadingCertificates] = useState(false);
  const [certificateFiles, setCertificateFiles] = useState<File[]>([]);

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Upload license document
  const handleLicenseUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !supplier?.id) return;

    // Validate file type
    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a PDF, JPEG, or PNG file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setIsUploadingLicense(true);
    try {
      const base64Url = await fileToBase64(file);
      const API_URL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001');

      const response = await fetch(`${API_URL}/api/suppliers/${supplier.id}/update-document`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          verificationDocumentUrl: base64Url,
          certificates: documents.certificates.length > 0 ? JSON.stringify(documents.certificates) : null
        }),
      });

      const data = await response.json();
      if (data.success) {
        setDocuments(prev => ({ ...prev, license: data.supplier.verificationDocumentUrl }));
        alert('License document uploaded successfully!');
        // Refresh supplier data
        fetchSupplierStatus();
      } else {
        alert(data.message || 'Failed to upload license document');
      }
    } catch (error) {
      console.error('Error uploading license:', error);
      alert('Failed to upload license document. Please try again.');
    } finally {
      setIsUploadingLicense(false);
      // Reset input
      event.target.value = '';
    }
  };

  // Upload certificates
  const handleCertificatesUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0 || !supplier?.id) return;

    // Validate file types and sizes
    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    const invalidFiles = files.filter(f => !validTypes.includes(f.type));
    if (invalidFiles.length > 0) {
      alert('Please upload only PDF, JPEG, or PNG files');
      return;
    }

    const oversizedFiles = files.filter(f => f.size > 10 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      alert('All files must be less than 10MB');
      return;
    }

    // Check total count (max 5 certificates)
    const totalCount = documents.certificates.length + files.length;
    if (totalCount > 5) {
      alert('Maximum 5 certificates allowed. Please select fewer files.');
      return;
    }

    setIsUploadingCertificates(true);
    try {
      const base64Urls = await Promise.all(files.map(fileToBase64));
      const updatedCertificates = [...documents.certificates, ...base64Urls];

      const API_URL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001');

      const response = await fetch(`${API_URL}/api/suppliers/${supplier.id}/update-document`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          verificationDocumentUrl: documents.license || '',
          certificates: JSON.stringify(updatedCertificates)
        }),
      });

      const data = await response.json();
      if (data.success) {
        const certUrls = data.supplier.certificates
          ? (typeof data.supplier.certificates === 'string' ? JSON.parse(data.supplier.certificates) : data.supplier.certificates)
          : [];
        setDocuments(prev => ({ ...prev, certificates: certUrls }));
        alert('Certificates uploaded successfully!');
        // Refresh supplier data
        fetchSupplierStatus();
      } else {
        alert(data.message || 'Failed to upload certificates');
      }
    } catch (error) {
      console.error('Error uploading certificates:', error);
      alert('Failed to upload certificates. Please try again.');
    } finally {
      setIsUploadingCertificates(false);
      // Reset input
      event.target.value = '';
    }
  };

  // Delete certificate
  const handleDeleteCertificate = async (index: number) => {
    if (!supplier?.id || !confirm('Are you sure you want to delete this certificate?')) return;

    const updatedCertificates = documents.certificates.filter((_, i) => i !== index);

    try {
      const API_URL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001');

      const response = await fetch(`${API_URL}/api/suppliers/${supplier.id}/update-document`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          verificationDocumentUrl: documents.license || '',
          certificates: updatedCertificates.length > 0 ? JSON.stringify(updatedCertificates) : null
        }),
      });

      const data = await response.json();
      if (data.success) {
        setDocuments(prev => ({ ...prev, certificates: updatedCertificates }));
        alert('Certificate deleted successfully!');
        fetchSupplierStatus();
      } else {
        alert(data.message || 'Failed to delete certificate');
      }
    } catch (error) {
      console.error('Error deleting certificate:', error);
      alert('Failed to delete certificate. Please try again.');
    }
  };

  // Payment Details State
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [earnings, setEarnings] = useState<any>(null);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const [isSavingPayment, setIsSavingPayment] = useState(false);
  const [isEditingPayment, setIsEditingPayment] = useState(false);
  const [paymentFormData, setPaymentFormData] = useState({
    paymentMethod: '',
    paymentCurrency: 'INR',
    paymentFrequency: 'monthly',
    paymentMethodDetails: {} as any,
    taxId: '',
    taxIdType: '',
    taxCountry: ''
  });
  const [selectedCountry, setSelectedCountry] = useState('India');

  // Fetch latest supplier data to check for status updates
  const fetchSupplierStatus = async () => {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('📥 FETCHING SUPPLIER STATUS');
    console.log('═══════════════════════════════════════════════════════════');

    if (!supplier?.id) {
      console.error('❌ SUPPLIER FETCH FAILED: supplier or supplier.id is missing');
      console.error('   supplier:', supplier);
      console.error('   supplier.id:', supplier?.id);
      return;
    }

    const supplierId = supplier.id;
    console.log('📥 Supplier ID:', supplierId);

    try {
      // Determine API URL
      const API_URL = (import.meta as any).env?.VITE_API_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001');
      const url = `${API_URL}/api/suppliers/${supplierId}`;

      console.log('🔗 Request URL:', url);
      console.log('   API_URL:', API_URL);
      console.log('   Window origin:', typeof window !== 'undefined' ? window.location.origin : 'N/A (SSR)');
      console.log('   Environment VITE_API_URL:', (import.meta as any).env?.VITE_API_URL || 'not set');

      // Verify backend availability first
      console.log('🔍 Checking backend availability...');
      const healthCheckUrl = `${API_URL}/api/health`;
      try {
        const healthResponse = await fetch(healthCheckUrl, {
          method: 'GET',
          signal: AbortSignal.timeout(3000) // 3 second timeout
        });
        if (healthResponse.ok) {
          console.log('✅ Backend server is running and accessible');
        } else {
          console.warn('⚠️ Backend health check returned non-OK status:', healthResponse.status);
        }
      } catch (healthError: any) {
        console.error('❌ SUPPLIER FETCH FAILED: Backend server not accessible');
        console.error('   Health check error:', healthError);
        console.error('   Possible causes:');
        console.error('   - Backend server not running on port 3001');
        console.error('   - Wrong port (expected: 3001)');
        console.error('   - Network connectivity issue');
        console.error('   - Firewall blocking connection');
        throw new Error(`Backend server not accessible: ${healthError.message}`);
      }

      console.log('📤 Making supplier fetch request...');
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });

      console.log('📥 Response received');
      console.log('   Response status:', response.status);
      console.log('   Response OK:', response.ok);
      console.log('   Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ SUPPLIER FETCH FAILED: HTTP error response');
        console.error('   Status:', response.status);
        console.error('   Status text:', response.statusText);
        console.error('   Response body:', errorText);
        console.error('   Possible causes:');
        console.error('   - Supplier ID not found (404)');
        console.error('   - Invalid supplier ID format (400)');
        console.error('   - Server error (500)');
        console.error('   - Authentication required (401/403)');
        throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Response data received:', {
        hasSupplier: !!data.supplier,
        hasSuccess: !!data.success,
        keys: Object.keys(data)
      });

      // Handle both response formats: { supplier } or { success: true, supplier }
      const supplierData = data.supplier || data;

      if (supplierData && supplierData.id) {
        console.log('✅ Supplier data valid:', {
          id: supplierData.id,
          status: supplierData.status,
          emailVerified: supplierData.emailVerified
        });

        const updatedSupplier = {
          ...supplierData,
          id: String(supplierData.id),
          emailVerified: supplierData.emailVerified !== undefined ? supplierData.emailVerified : currentSupplier?.emailVerified
        };

        // Update documents state
        if (supplierData.verificationDocumentUrl || supplierData.certificates) {
          try {
            const certs = supplierData.certificates
              ? (typeof supplierData.certificates === 'string' ? JSON.parse(supplierData.certificates) : supplierData.certificates)
              : [];
            setDocuments({
              license: supplierData.verificationDocumentUrl || null,
              certificates: Array.isArray(certs) ? certs : []
            });
          } catch (e) {
            console.error('Error parsing certificates:', e);
            setDocuments({
              license: supplierData.verificationDocumentUrl || null,
              certificates: []
            });
          }
        }

        // Only update if status actually changed to avoid unnecessary re-renders
        if (updatedSupplier.status !== currentSupplier?.status) {
          console.log('🔄 Supplier status changed:', {
            old: currentSupplier?.status,
            new: updatedSupplier.status
          });
          // Update localStorage
          localStorage.setItem('supplier', JSON.stringify(updatedSupplier));
          // Update state
          setCurrentSupplier(updatedSupplier);
        } else {
          console.log('ℹ️ Supplier status unchanged:', updatedSupplier.status);
        }
        console.log('═══════════════════════════════════════════════════════════');
      } else {
        console.error('❌ SUPPLIER FETCH FAILED: Invalid response data');
        console.error('   Response data:', data);
        console.error('   supplierData:', supplierData);
        console.error('   Possible causes:');
        console.error('   - API returned unexpected format');
        console.error('   - Supplier data missing from response');
        console.error('═══════════════════════════════════════════════════════════');
      }
    } catch (error: any) {
      console.error('═══════════════════════════════════════════════════════════');
      console.error('❌ SUPPLIER FETCH FAILED');
      console.error('═══════════════════════════════════════════════════════════');
      console.error('Error object:', error);
      console.error('Error name:', error?.name);
      console.error('Error message:', error?.message);
      console.error('Error stack:', error?.stack);

      // Determine error type
      if (error?.name === 'AbortError' || error?.message?.includes('timeout')) {
        console.error('   Error type: TIMEOUT');
        console.error('   Possible causes:');
        console.error('   - Backend server not responding');
        console.error('   - Network latency too high');
        console.error('   - Backend server overloaded');
      } else if (error?.message?.includes('Failed to fetch') || error?.message?.includes('ERR_CONNECTION_REFUSED')) {
        console.error('   Error type: CONNECTION REFUSED');
        console.error('   Possible causes:');
        console.error('   - Backend server not running on port 3001');
        console.error('   - Wrong port (check if backend is on different port)');
        console.error('   - CORS misconfiguration (check backend CORS settings)');
        console.error('   - Firewall blocking connection');
        console.error('   - Backend crashed or not started');
      } else if (error?.message?.includes('CORS')) {
        console.error('   Error type: CORS ERROR');
        console.error('   Possible causes:');
        console.error('   - Backend CORS not configured for localhost:3000');
        console.error('   - Origin not in allowedOrigins list');
      } else {
        console.error('   Error type: UNKNOWN');
        console.error('   Possible causes:');
        console.error('   - Network error');
        console.error('   - Invalid API response');
        console.error('   - JSON parsing error');
      }
      console.error('═══════════════════════════════════════════════════════════');
    }
  };

  // Initialize documents from supplier prop
  useEffect(() => {
    if (supplier) {
      try {
        const certs = supplier.certificates
          ? (typeof supplier.certificates === 'string' ? JSON.parse(supplier.certificates) : supplier.certificates)
          : [];
        setDocuments({
          license: supplier.verificationDocumentUrl || null,
          certificates: Array.isArray(certs) ? certs : []
        });
      } catch (e) {
        console.error('Error parsing certificates:', e);
        setDocuments({
          license: supplier.verificationDocumentUrl || null,
          certificates: []
        });
      }
    }
  }, [supplier]);

  // Fetch tours
  useEffect(() => {
    if (supplier && supplier.id && !showTourForm) {
      fetchTours();
      // Also refresh supplier status to check for approval updates
      fetchSupplierStatus();
    }
  }, [supplier?.id, showTourForm]);


  // Periodically check for supplier status updates (every 10 seconds)
  useEffect(() => {
    if (!supplier?.id) return;

    const interval = setInterval(() => {
      fetchSupplierStatus();
    }, 10000); // Check every 10 seconds for faster status updates

    return () => clearInterval(interval);
  }, [supplier?.id]);

  // Fetch bookings when bookings tab is active
  useEffect(() => {
    if (supplier && supplier.id && activeTab === 'bookings') {
      fetchBookings();
    }
  }, [supplier?.id, activeTab]);

  // Fetch payment details and earnings when earnings tab is active
  useEffect(() => {
    if (supplier && supplier.id && activeTab === 'earnings') {
      fetchPaymentDetails();
      fetchEarnings();
    }
  }, [supplier?.id, activeTab]);

  // Fetch payment details
  const fetchPaymentDetails = async () => {
    if (!supplier?.id) return;
    setIsLoadingPayment(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001');
      const response = await fetch(`${API_URL}/api/suppliers/${supplier.id}/payment-details`);
      const data = await response.json();
      if (data.success && data.paymentDetails) {
        setPaymentDetails(data.paymentDetails);
        // Initialize form data
        setPaymentFormData({
          paymentMethod: data.paymentDetails.paymentMethod || '',
          paymentCurrency: data.paymentDetails.paymentCurrency || 'INR',
          paymentFrequency: data.paymentDetails.paymentFrequency || 'monthly',
          paymentMethodDetails: data.paymentDetails.paymentMethodDetails || {},
          taxId: data.paymentDetails.taxId || '',
          taxIdType: data.paymentDetails.taxIdType || '',
          taxCountry: data.paymentDetails.taxCountry || ''
        });
        // Set selected country from tax country or default to India
        if (data.paymentDetails.taxCountry) {
          setSelectedCountry(data.paymentDetails.taxCountry);
        } else if (data.paymentDetails.paymentMethodDetails?.bankCountry) {
          setSelectedCountry(data.paymentDetails.paymentMethodDetails.bankCountry);
        }
      }
    } catch (error) {
      console.error('Error fetching payment details:', error);
    } finally {
      setIsLoadingPayment(false);
    }
  };

  // Fetch earnings
  const fetchEarnings = async () => {
    if (!supplier?.id) return;
    try {
      const API_URL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001');
      const response = await fetch(`${API_URL}/api/suppliers/${supplier.id}/earnings`);
      const data = await response.json();
      if (data.success) {
        setEarnings(data.earnings);
      }
    } catch (error) {
      console.error('Error fetching earnings:', error);
    }
  };

  // Validate payment form
  const validatePaymentForm = (): string | null => {
    if (!paymentFormData.paymentMethod) {
      return 'Please select a payment method';
    }

    const details = paymentFormData.paymentMethodDetails || {};

    if (paymentFormData.paymentMethod === 'bank_transfer') {
      if (!details.bankName) return 'Bank name is required';
      if (!details.accountNumber) return 'Account number is required';
      if (!details.accountType) return 'Account type is required';
      if (!details.beneficiaryName) return 'Beneficiary name is required';
      if (selectedCountry === 'India' && !details.ifscCode) return 'IFSC code is required for India';
      if (selectedCountry !== 'India' && !details.swiftCode) return 'SWIFT/BIC code is required';
      if (!details.bankCity) return 'Bank city is required';
      if (!details.bankZip) return 'Bank zip/postal code is required';
      if (!details.bankAddress) return 'Bank address is required';
    } else if (paymentFormData.paymentMethod === 'paypal') {
      if (!details.paypalEmail) return 'PayPal email is required';
      if (!details.accountType) return 'Account type is required';
    } else if (paymentFormData.paymentMethod === 'credit_card') {
      if (!details.cardHolderName) return 'Card holder name is required';
      if (!details.cardType) return 'Card type is required';
      if (!details.last4Digits || details.last4Digits.length !== 4) return 'Last 4 digits of card are required';
      if (!details.expiryDate) return 'Card expiry date is required';
      if (!details.billingAddress) return 'Billing address is required';
    } else if (paymentFormData.paymentMethod === 'upi') {
      if (!details.upiId) return 'UPI ID is required';
      if (!details.upiId.includes('@')) return 'UPI ID must be in format: name@provider';
    } else if (paymentFormData.paymentMethod === 'wise') {
      if (!details.wiseEmail) return 'Wise email address is required';
      if (!details.wiseEmail.includes('@')) return 'Please enter a valid email address';
      if (!details.accountHolderName) return 'Account holder name is required';
    }

    return null;
  };

  // Save payment details
  const handleSavePaymentDetails = async () => {
    if (!supplier?.id) return;

    // Validate form
    const validationError = validatePaymentForm();
    if (validationError) {
      alert(validationError);
      return;
    }

    setIsSavingPayment(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001');
      const response = await fetch(`${API_URL}/api/suppliers/${supplier.id}/payment-details`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethod: paymentFormData.paymentMethod,
          paymentMethodDetails: paymentFormData.paymentMethodDetails,
          paymentCurrency: paymentFormData.paymentCurrency,
          paymentFrequency: paymentFormData.paymentFrequency,
          taxId: paymentFormData.taxId || null,
          taxIdType: paymentFormData.taxIdType || null,
          taxCountry: paymentFormData.taxCountry || null
        })
      });
      const data = await response.json();
      if (data.success) {
        setPaymentDetails(data.paymentDetails);
        setIsEditingPayment(false);
        // Show success message
        const successMsg = document.createElement('div');
        successMsg.className = 'fixed top-4 right-4 bg-[#10B981] text-white px-6 py-4 rounded-xl shadow-lg z-50 font-bold text-[14px] flex items-center gap-2';
        successMsg.innerHTML = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Payment details saved successfully!';
        document.body.appendChild(successMsg);
        setTimeout(() => {
          successMsg.remove();
        }, 3000);
      } else {
        alert(data.message || 'Failed to save payment details');
      }
    } catch (error) {
      console.error('Error saving payment details:', error);
      alert('Failed to save payment details. Please check your connection and try again.');
    } finally {
      setIsSavingPayment(false);
    }
  };

  const fetchBookings = async () => {
    if (!supplier?.id) return;

    setIsLoadingBookings(true);
    try {
      const API_URL = (import.meta as any).env?.VITE_API_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001');
      const response = await fetch(`${API_URL}/api/suppliers/${supplier.id}/bookings`);
      const data = await response.json();
      if (data.success) {
        setBookings(data.bookings || []);
      } else {
        console.error('Error fetching bookings:', data.error);
        setBookings([]);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookings([]);
    } finally {
      setIsLoadingBookings(false);
    }
  };

  const fetchTours = async () => {
    if (!supplier || !supplier.id) {
      console.error('Cannot fetch tours: supplier or supplier.id is missing');
      return;
    }

    setIsLoading(true);
    try {
      const API_URL = (import.meta as any).env?.VITE_API_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001');

      // Add timeout handling - increased to 60 seconds for slow database connections
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

      let response;
      try {
        response = await fetch(`${API_URL}/api/tours?supplierId=${supplier.id}`, {
          signal: controller.signal
        });
        clearTimeout(timeoutId);
      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        if (fetchError.name === 'AbortError') {
          console.error('❌ Fetch tours timed out');
          alert('Loading tours timed out. Please refresh the page.');
          return;
        }
        throw fetchError;
      }

      const data = await response.json();
      if (data.success) {
        setTours(data.tours || []);
      } else {
        console.error('Error fetching tours:', data.error || data.message);
        setTours([]);
      }
    } catch (error) {
      console.error('Error fetching tours:', error);
      setTours([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTour = async (tourId: string) => {
    if (!confirm('Are you sure you want to delete this tour? This action cannot be undone.')) {
      return;
    }

    try {
      const API_URL = (import.meta as any).env?.VITE_API_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001');
      const response = await fetch(`${API_URL}/api/tours/${tourId}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        fetchTours();
        alert('Tour deleted successfully');
      } else {
        alert(data.message || 'Failed to delete tour');
      }
    } catch (error) {
      console.error('Error deleting tour:', error);
      alert('Failed to delete tour. Please try again.');
    }
  };

  const handleEditTour = async (tour: any) => {
    // Fetch full tour data including images when editing
    // The list view doesn't include images for performance, so we need to fetch them separately
    try {
      setIsLoading(true);
      const API_URL = (import.meta as any).env?.VITE_API_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001');
      const response = await fetch(`${API_URL}/api/tours/${tour.id}`);
      const data = await response.json();

      if (data.success && data.tour) {
        setEditingTour(data.tour);
        setShowTourForm(true);
      } else {
        // Fallback to tour from list if fetch fails
        console.warn('Failed to fetch full tour data, using list data');
        setEditingTour(tour);
        setShowTourForm(true);
      }
    } catch (error) {
      console.error('Error fetching tour for edit:', error);
      // Fallback to tour from list if fetch fails
      setEditingTour(tour);
      setShowTourForm(true);
    } finally {
      setIsLoading(false);
    }
  };


  const handleSaveProfile = async () => {
    if (!supplier?.id) return;

    setIsSavingProfile(true);
    try {
      const API_URL = (import.meta as any).env?.VITE_API_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001');
      const response = await fetch(`${API_URL}/api/suppliers/${currentSupplier.id}/profile`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: profileData.fullName,
        })
      });

      const data = await response.json();
      if (data.success) {
        // Update supplier in localStorage
        const updatedSupplier = { ...currentSupplier, ...data.supplier };
        localStorage.setItem('supplier', JSON.stringify(updatedSupplier));
        // Update local state
        setCurrentSupplier(updatedSupplier);
        // Explicitly update profileData to reflect the saved changes
        setProfileData({
          fullName: data.supplier.fullName || '',
          phone: data.supplier.phone || '',
          whatsapp: data.supplier.whatsapp || ''
        });
        alert('Profile updated successfully!');
      } else {
        alert(data.message || 'Failed to save contact information');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save contact information');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSubmitTour = async (tourId: string) => {
    try {
      const API_URL = (import.meta as any).env?.VITE_API_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001');

      console.log(`📤 Submitting tour ${tourId} for review...`);

      // Add timeout handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      let response;
      try {
        response = await fetch(`${API_URL}/api/tours/${tourId}/submit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal
        });
        clearTimeout(timeoutId);
      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        if (fetchError.name === 'AbortError') {
          console.error('❌ Submit tour timed out');
          alert('Request timed out. The server is taking too long to respond. Please try again.');
          return;
        }
        throw fetchError;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to submit tour' }));
        console.error('❌ Submit tour failed:', errorData);
        alert(errorData.message || errorData.error || `Failed to submit tour (${response.status})`);
        return;
      }

      const data = await response.json();
      console.log('✅ Submit tour response:', data);

      if (data.success) {
        // Refresh tours list to show updated status
        await fetchTours();
        alert('Tour submitted for review! We\'ll review it within 24-48 hours.');
      } else {
        console.error('❌ Submit tour failed:', data);
        alert(data.message || data.error || 'Failed to submit tour');
      }
    } catch (error: any) {
      console.error('❌ Error submitting tour:', error);
      alert(`Failed to submit tour: ${error.message || 'Please try again.'}`);
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="px-3 py-1 bg-[#10B981]/10 text-[#10B981] rounded-full text-[12px] font-bold flex items-center gap-1">
            <CheckCircle2 size={12} />
            Approved
          </span>
        );
      case 'pending':
        return (
          <span className="px-3 py-1 bg-yellow-50 text-yellow-600 rounded-full text-[12px] font-bold flex items-center gap-1">
            <Clock size={12} />
            Pending Review
          </span>
        );
      case 'rejected':
        return (
          <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-[12px] font-bold flex items-center gap-1">
            <XCircle size={12} />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  // Filter tours by status
  const filteredTours = filterStatus === 'all'
    ? tours
    : tours.filter(tour => tour.status === filterStatus);

  // Calculate stats
  const stats = {
    total: tours.length,
    live: tours.filter(t => t.status === 'approved').length,
    pending: tours.filter(t => t.status === 'pending').length,
    draft: tours.filter(t => t.status === 'draft').length
  };

  // Show tour creation form
  if (showTourForm) {
    if (!supplier || !supplier.id) {
      alert('Error: Supplier information not available. Please log in again.');
      setShowTourForm(false);
      return null;
    }

    return (
      <TourCreationForm
        supplierId={supplier.id}
        supplierEmail={supplier.email || ''}
        supplierPhone={supplier.phone || ''}
        supplierWhatsApp={supplier.whatsapp || ''}
        tour={editingTour}
        onClose={() => {
          setShowTourForm(false);
          setEditingTour(null);
        }}
        onSuccess={() => {
          setShowTourForm(false);
          setEditingTour(null);
          fetchTours();
        }}
        onProfileRequired={() => {
          setShowTourForm(false);
          setActiveTab('profile');
          alert('Please complete your profile details before creating a tour.');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 pt-6 pb-0">
          <div className="flex items-center justify-between">
            {/* Left side - Logo */}
            <div
              className="flex items-center flex-1 cursor-pointer"
              onClick={() => window.location.href = '/'}
            >
              <img
                src="/logo.png"
                alt="Asia By Locals"
                className="h-[90px] sm:h-[85px] md:h-[95px] lg:h-[105px] xl:h-[115px] w-auto object-contain"
                style={{ transform: 'translateY(3px)' }}
              />
            </div>

            {/* Center - Supplier Portal */}
            <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
              <h1 className="text-xl font-black text-[#001A33]">Supplier Portal</h1>
              <p className="text-[12px] text-gray-500 font-semibold">Welcome back, {currentSupplier?.fullName || supplier.fullName}</p>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center gap-4 flex-1 justify-end">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
                <Bell size={20} className="text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#10B981] rounded-full"></span>
              </button>
              <a
                href="/"
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-[#001A33] font-semibold text-[14px] transition-colors"
              >
                <Home size={18} />
                Homepage
              </a>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-[#001A33] font-semibold text-[14px] transition-colors"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Status Banner */}
        {(currentSupplier?.status === 'pending' || supplier.status === 'pending') && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <Clock className="text-yellow-600 shrink-0 mt-1" size={24} />
              <div className="flex-1">
                <h3 className="font-black text-[#001A33] mb-2">Account Under Review</h3>
                <p className="text-[14px] text-gray-600 font-semibold">
                  Your account is currently being reviewed by our team. We'll notify you once your account is approved.
                  This usually takes 24-48 hours.
                </p>
              </div>
              <button
                onClick={fetchSupplierStatus}
                className="p-2 hover:bg-yellow-100 rounded-lg transition-colors"
                title="Refresh status"
              >
                <RefreshCw size={20} className="text-yellow-600" />
              </button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-white rounded-2xl p-2 mb-8 border border-gray-200">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'activities', label: 'Activities', icon: FileText },
            { id: 'bookings', label: 'Bookings', icon: Calendar },
            { id: 'earnings', label: 'Earnings', icon: DollarSign },
            { id: 'profile', label: 'Profile', icon: User }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-[14px] transition-all ${activeTab === tab.id
                  ? 'bg-[#10B981] text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Stats Cards */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[14px] font-bold text-gray-500 uppercase">Total Tours</h3>
                  <FileText className="text-[#10B981]" size={20} />
                </div>
                <p className="text-3xl font-black text-[#001A33]">{stats.total}</p>
                <button
                  onClick={() => {
                    if (currentSupplier?.status !== 'approved') {
                      alert('Your account is under review. You can create tours only after your account is approved by admin. Please wait for approval notification via email.');
                      return;
                    }
                    setShowTourForm(true);
                  }}
                  disabled={currentSupplier?.status !== 'approved'}
                  className={`mt-4 text-[13px] font-bold flex items-center gap-1 ${currentSupplier?.status === 'approved'
                    ? 'text-[#10B981] hover:underline'
                    : 'text-gray-400 cursor-not-allowed'
                    }`}
                >
                  <Plus size={14} />
                  {currentSupplier?.status === 'approved' ? 'Create Tour' : 'Awaiting Approval'}
                </button>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[14px] font-bold text-gray-500 uppercase">Live Tours</h3>
                  <CheckCircle2 className="text-[#10B981]" size={20} />
                </div>
                <p className="text-3xl font-black text-[#001A33]">{stats.live}</p>
                <p className="mt-2 text-[12px] text-gray-500 font-semibold">Approved & live</p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[14px] font-bold text-gray-500 uppercase">Pending Review</h3>
                  <Clock className="text-yellow-600" size={20} />
                </div>
                <p className="text-3xl font-black text-[#001A33]">{stats.pending}</p>
                <p className="mt-2 text-[12px] text-gray-500 font-semibold">Awaiting approval</p>
              </div>

              {/* Account Status */}
              <div className="md:col-span-3 bg-white rounded-2xl p-6 border border-gray-200">
                <h3 className="text-lg font-black text-[#001A33] mb-4">Account Status</h3>
                <div className="flex items-center gap-4">
                  {getStatusBadge(currentSupplier?.status || supplier.status)}
                  {supplier.emailVerified && (
                    <span className="px-3 py-1 bg-[#10B981]/10 text-[#10B981] rounded-full text-[12px] font-bold flex items-center gap-1">
                      <CheckCircle2 size={12} />
                      Email Verified
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activities' && (
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-[#001A33]">My Tours</h2>
                <button
                  onClick={() => {
                    if (currentSupplier?.status !== 'approved') {
                      alert('Your account is under review. You can create tours only after your account is approved by admin. Please wait for approval notification via email.');
                      return;
                    }
                    setShowTourForm(true);
                  }}
                  disabled={currentSupplier?.status !== 'approved'}
                  className={`font-black py-3 px-6 rounded-full text-[14px] flex items-center gap-2 transition-colors ${currentSupplier?.status === 'approved'
                    ? 'bg-[#10B981] hover:bg-[#059669] text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                  <Plus size={18} />
                  {supplier.status === 'approved' ? 'Create New Tour' : 'Awaiting Approval'}
                </button>
              </div>

              {/* Filter */}
              <div className="flex items-center gap-2 mb-6">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-4 py-2 rounded-full text-[13px] font-bold transition-all ${filterStatus === 'all'
                    ? 'bg-[#10B981] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  All ({stats.total})
                </button>
                <button
                  onClick={() => setFilterStatus('draft')}
                  className={`px-4 py-2 rounded-full text-[13px] font-bold transition-all ${filterStatus === 'draft'
                    ? 'bg-[#10B981] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  Draft ({stats.draft})
                </button>
                <button
                  onClick={() => setFilterStatus('pending')}
                  className={`px-4 py-2 rounded-full text-[13px] font-bold transition-all ${filterStatus === 'pending'
                    ? 'bg-[#10B981] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  Pending ({stats.pending})
                </button>
                <button
                  onClick={() => setFilterStatus('approved')}
                  className={`px-4 py-2 rounded-full text-[13px] font-bold transition-all ${filterStatus === 'approved'
                    ? 'bg-[#10B981] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  Live ({stats.live})
                </button>
              </div>

              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10B981] mx-auto"></div>
                  <p className="text-[14px] text-gray-500 font-semibold mt-4">Loading tours...</p>
                </div>
              ) : filteredTours.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="mx-auto text-gray-300 mb-4" size={48} />
                  <h3 className="text-lg font-black text-[#001A33] mb-2">
                    {filterStatus === 'all' ? 'No tours yet' : `No ${filterStatus} tours`}
                  </h3>
                  <p className="text-[14px] text-gray-500 font-semibold mb-6">
                    {filterStatus === 'all'
                      ? 'Start creating amazing experiences for travelers!'
                      : `You don't have any ${filterStatus} tours yet.`
                    }
                  </p>
                  {filterStatus === 'all' && (
                    <button
                      onClick={() => {
                        if (currentSupplier?.status !== 'approved') {
                          alert('Your account is under review. You can create tours only after your account is approved by admin. Please wait for approval notification via email.');
                          return;
                        }
                        setShowTourForm(true);
                      }}
                      disabled={currentSupplier?.status !== 'approved'}
                      className={`font-black py-3 px-6 rounded-full text-[14px] flex items-center gap-2 mx-auto transition-colors ${currentSupplier?.status === 'approved'
                        ? 'bg-[#10B981] hover:bg-[#059669] text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                      <Plus size={18} />
                      {supplier.status === 'approved' ? 'Create Your First Tour' : 'Awaiting Approval'}
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTours.map((tour) => (
                    <div key={tour.id} className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
                      {tour.images && tour.images.length > 0 && (
                        <img
                          src={tour.images[0]}
                          alt={tour.title}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-[16px] font-black text-[#001A33] line-clamp-2 flex-1">
                            {tour.title}
                          </h3>
                          {getStatusBadge(tour.status)}
                        </div>
                        <div className="flex items-center gap-2 text-[12px] text-gray-500 font-semibold mb-3">
                          <MapPin size={14} />
                          <span>{tour.city}</span>
                          <span>•</span>
                          <span>{tour.category}</span>
                        </div>
                        <div className="flex items-center justify-between text-[14px] font-black text-[#001A33] mb-4">
                          <span>
                            {(() => {
                              let startingPrice = 0;
                              let foundValidPrice = false;

                              // PRIORITY 1: Check ALL tour options for groupPricingTiers - find the first tier (1 person price)
                              // The first tier is always for 1 person - this is the "starting from" price
                              if (tour.options && Array.isArray(tour.options) && tour.options.length > 0) {
                                // First, try main tour option (sortOrder: -1 or 0)
                                const mainTourOption = tour.options.find((opt: any) => opt.sortOrder === -1) || tour.options.find((opt: any) => opt.sortOrder === 0) || tour.options[0];
                                if (mainTourOption && mainTourOption.groupPricingTiers) {
                                  try {
                                    const tiers = typeof mainTourOption.groupPricingTiers === 'string'
                                      ? JSON.parse(mainTourOption.groupPricingTiers)
                                      : mainTourOption.groupPricingTiers;
                                    if (Array.isArray(tiers) && tiers.length > 0 && tiers[0] && tiers[0].price) {
                                      const firstTierPrice = parseFloat(tiers[0].price);
                                      if (!isNaN(firstTierPrice) && firstTierPrice > 0) {
                                        startingPrice = firstTierPrice;
                                        foundValidPrice = true;
                                      }
                                    }
                                  } catch (e) {
                                    console.error('Error parsing main tour option groupPricingTiers:', e);
                                  }
                                }

                                // If not found in main option, check ALL other options
                                if (!foundValidPrice) {
                                  // Sort options by sortOrder to check in order
                                  const sortedOptions = [...tour.options].sort((a: any, b: any) => (a.sortOrder || 999) - (b.sortOrder || 999));
                                  for (const opt of sortedOptions) {
                                    if (opt.groupPricingTiers) {
                                      try {
                                        const tiers = typeof opt.groupPricingTiers === 'string'
                                          ? JSON.parse(opt.groupPricingTiers)
                                          : opt.groupPricingTiers;
                                        if (Array.isArray(tiers) && tiers.length > 0 && tiers[0] && tiers[0].price) {
                                          const firstTierPrice = parseFloat(tiers[0].price);
                                          if (!isNaN(firstTierPrice) && firstTierPrice > 0) {
                                            startingPrice = firstTierPrice;
                                            foundValidPrice = true;
                                            break; // Use the first option we find with valid pricing
                                          }
                                        }
                                      } catch (e) {
                                        console.error('Error parsing option groupPricingTiers:', e);
                                      }
                                    }
                                  }
                                }
                              }

                              // PRIORITY 2: Check pricePerPerson (should be set from first tier by backend)
                              // Only use if it's reasonable (not the last tier price like ₹8,200)
                              if (!foundValidPrice && tour.pricePerPerson) {
                                const pricePerPerson = parseFloat(tour.pricePerPerson);
                                // Only use pricePerPerson if it's reasonable (not the max tier price)
                                // Max tier price would be much higher, so if pricePerPerson is reasonable (< ₹5000 for INR), use it
                                const maxReasonablePrice = tour.currency === 'INR' ? 5000 : 100;
                                if (!isNaN(pricePerPerson) && pricePerPerson > 0 && pricePerPerson < maxReasonablePrice) {
                                  startingPrice = pricePerPerson;
                                  foundValidPrice = true;
                                }
                              }

                              // DO NOT use groupPrice - it's the LAST tier price (wrong for "starting from")
                              // groupPrice is ₹8,200 (10 people), not ₹1,000 (1 person)

                              // If still no valid price, show 0
                              if (startingPrice === 0 || isNaN(startingPrice)) {
                                startingPrice = 0;
                              }

                              return `Starting from ${tour.currency === 'INR' ? '₹' : '$'}${startingPrice.toLocaleString()}`;
                            })()}
                          </span>
                          <span className="text-gray-500 font-semibold">{tour.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {(tour.status === 'draft' || tour.status === 'pending' || tour.status === 'approved') && (
                            <>
                              <button
                                onClick={() => handleEditTour(tour)}
                                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-black py-2 px-4 rounded-full text-[12px] transition-colors flex items-center justify-center gap-2"
                              >
                                <Edit size={14} />
                                Edit
                              </button>
                              {tour.status === 'draft' && (
                                <>
                                  <button
                                    onClick={() => handleSubmitTour(tour.id)}
                                    className="flex-1 bg-[#10B981] hover:bg-[#059669] text-white font-black py-2 px-4 rounded-full text-[12px] transition-colors"
                                  >
                                    Submit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteTour(tour.id)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </>
                              )}
                            </>
                          )}
                          {tour.status === 'approved' && (
                            <a
                              href={`/${tour.country?.toLowerCase().replace(/\s+/g, '-')}/${tour.city?.toLowerCase().replace(/\s+/g, '-')}/${tour.slug || tour.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 bg-[#10B981] hover:bg-[#059669] text-white font-black py-2 px-4 rounded-full text-[12px] transition-colors flex items-center justify-center gap-2"
                            >
                              <Globe size={14} />
                              View on Site
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h2 className="text-2xl font-black text-[#001A33] mb-6">Bookings</h2>
              {isLoadingBookings ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10B981] mx-auto"></div>
                  <p className="text-[14px] text-gray-500 font-semibold mt-4">Loading bookings...</p>
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="mx-auto text-gray-300 mb-4" size={48} />
                  <h3 className="text-lg font-black text-[#001A33] mb-2">No bookings yet</h3>
                  <p className="text-[14px] text-gray-500 font-semibold">
                    Bookings will appear here once travelers start booking your activities.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => {
                    const bookingDate = new Date(booking.bookingDate);
                    const formattedDate = bookingDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    });

                    return (
                      <div key={booking.id} className="border-2 border-gray-200 rounded-xl p-5 hover:border-[#10B981]/50 transition-all">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-black text-[#001A33]">{booking.tour?.title || 'Tour'}</h3>
                              <span className={`px-3 py-1 rounded-full text-[11px] font-black ${booking.status === 'confirmed' ? 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20' :
                                booking.status === 'pending' ? 'bg-yellow-500/10 text-yellow-700 border border-yellow-500/20' :
                                  booking.status === 'completed' ? 'bg-blue-500/10 text-blue-700 border border-blue-500/20' :
                                    'bg-gray-500/10 text-gray-700 border border-gray-500/20'
                                }`}>
                                {booking.status?.toUpperCase() || 'PENDING'}
                              </span>
                            </div>
                            {booking.bookingReference && (
                              <p className="text-[12px] text-gray-500 font-semibold mb-2">
                                Booking Reference: <span className="font-black text-[#001A33]">{booking.bookingReference}</span>
                              </p>
                            )}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[14px]">
                              <div>
                                <p className="text-gray-500 font-semibold mb-1">Date</p>
                                <p className="font-black text-[#001A33]">{formattedDate}</p>
                              </div>
                              <div>
                                <p className="text-gray-500 font-semibold mb-1">Guests</p>
                                <p className="font-black text-[#001A33]">{booking.numberOfGuests} {booking.numberOfGuests === 1 ? 'person' : 'people'}</p>
                              </div>
                              <div>
                                <p className="text-gray-500 font-semibold mb-1">Customer</p>
                                <p className="font-black text-[#001A33]">{booking.customerName}</p>
                              </div>
                              <div>
                                <p className="text-gray-500 font-semibold mb-1">Total Amount</p>
                                <p className="font-black text-[#10B981] text-lg">
                                  {booking.currency === 'INR' ? '₹' : '$'}{booking.totalAmount.toLocaleString()}
                                </p>
                              </div>
                            </div>
                            {booking.specialRequests && (
                              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                <p className="text-[12px] text-gray-500 font-semibold mb-1">Special Requests:</p>
                                <p className="text-[14px] text-[#001A33]">{booking.specialRequests}</p>
                              </div>
                            )}
                            <div className="mt-3 flex items-center gap-2 text-[12px] text-gray-500">
                              <span>Customer Email: <a href={`mailto:${booking.customerEmail}`} className="text-[#0071EB] hover:underline">{booking.customerEmail}</a></span>

                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'earnings' && (
            <div className="space-y-6">
              {/* Earnings Overview */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h2 className="text-2xl font-black text-[#001A33] mb-6">Earnings</h2>

                {isLoadingPayment ? (
                  <div className="text-center py-12">
                    <RefreshCw className="mx-auto text-[#10B981] mb-4 animate-spin" size={48} />
                    <p className="text-[14px] text-gray-500 font-semibold">Loading earnings...</p>
                  </div>
                ) : earnings ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="bg-[#10B981]/10 rounded-xl p-4 border border-[#10B981]/20">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="text-[#10B981]" size={20} />
                          <span className="text-[12px] font-bold text-gray-600">Gross Earnings</span>
                        </div>
                        <p className="text-2xl font-black text-[#001A33]">
                          {earnings.currency || '₹'}{(earnings.grossEarnings || earnings.totalEarnings || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="text-blue-600" size={20} />
                          <span className="text-[12px] font-bold text-gray-600">Net Payout</span>
                        </div>
                        <p className="text-2xl font-black text-[#001A33]">
                          {earnings.currency || '₹'}{(earnings.netEarnings || earnings.totalEarnings || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        {earnings.tdsDeducted !== undefined && earnings.tdsDeducted > 0 && (
                          <p className="text-[11px] text-orange-600 font-semibold mt-1">
                            (TDS: {earnings.currency || '₹'}{earnings.tdsDeducted.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="text-purple-600" size={20} />
                          <span className="text-[12px] font-bold text-gray-600">This Month</span>
                        </div>
                        <p className="text-2xl font-black text-[#001A33]">
                          {earnings.currency || '₹'}{earnings.thisMonthEarnings.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        {earnings.thisMonthTDS !== undefined && earnings.thisMonthTDS > 0 && (
                          <p className="text-[11px] text-gray-500 font-semibold mt-1">
                            (TDS: {earnings.currency || '₹'}{earnings.thisMonthTDS.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                          </p>
                        )}
                      </div>
                      <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="text-yellow-600" size={20} />
                          <span className="text-[12px] font-bold text-gray-600">Pending</span>
                        </div>
                        <p className="text-2xl font-black text-[#001A33]">
                          {earnings.currency || '₹'}{earnings.pendingEarnings.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <DollarSign className="mx-auto text-gray-300 mb-4" size={48} />
                    <h3 className="text-lg font-black text-[#001A33] mb-2">No earnings yet</h3>
                    <p className="text-[14px] text-gray-500 font-semibold">
                      Your earnings will be displayed here once you start receiving bookings.
                    </p>
                  </div>
                )}

                {earnings && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[12px] font-bold text-gray-600 mb-1">Next Payout Date</p>
                        <p className="text-lg font-black text-[#001A33]">
                          {new Date(earnings.nextPayoutDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[12px] font-bold text-gray-600 mb-1">Payment Frequency</p>
                        <p className="text-lg font-black text-[#001A33] capitalize">{earnings.paymentFrequency}</p>
                      </div>
                    </div>
                    <p className="text-[11px] text-gray-500 font-semibold mt-3">
                      Payments are processed on the 5th of each month (or next business day if the 5th falls on a weekend).
                    </p>
                  </div>
                )}
              </div>

              {/* Payment Details Section */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-black text-[#001A33] mb-1">Payment & Tax Details</h3>
                    <p className="text-[13px] text-gray-500 font-semibold">
                      Add your payment details to receive payouts. All payments are processed once per month.
                    </p>
                  </div>
                  {!isEditingPayment && paymentDetails && (
                    <button
                      onClick={() => setIsEditingPayment(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-[#10B981] hover:bg-[#059669] text-white font-bold rounded-lg transition-colors text-[14px]"
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                  )}
                </div>

                {isEditingPayment ? (
                  <PaymentDetailsForm
                    paymentFormData={paymentFormData}
                    setPaymentFormData={setPaymentFormData}
                    selectedCountry={selectedCountry}
                    setSelectedCountry={setSelectedCountry}
                    onSave={handleSavePaymentDetails}
                    onCancel={() => {
                      setIsEditingPayment(false);
                      // Reset form data
                      if (paymentDetails) {
                        setPaymentFormData({
                          paymentMethod: paymentDetails.paymentMethod || '',
                          paymentCurrency: paymentDetails.paymentCurrency || 'INR',
                          paymentFrequency: paymentDetails.paymentFrequency || 'monthly',
                          paymentMethodDetails: paymentDetails.paymentMethodDetails || {},
                          taxId: paymentDetails.taxId || '',
                          taxIdType: paymentDetails.taxIdType || '',
                          taxCountry: paymentDetails.taxCountry || ''
                        });
                        if (paymentDetails.taxCountry) {
                          setSelectedCountry(paymentDetails.taxCountry);
                        }
                      }
                    }}
                    isSaving={isSavingPayment}
                  />
                ) : paymentDetails && paymentDetails.paymentMethod ? (
                  <PaymentDetailsDisplay paymentDetails={paymentDetails} />
                ) : (
                  <div className="text-center py-8">
                    <Wallet className="mx-auto text-gray-300 mb-4" size={48} />
                    <h4 className="text-lg font-black text-[#001A33] mb-2">No Payment Details Added</h4>
                    <p className="text-[14px] text-gray-500 font-semibold mb-4">
                      Add your payment details to start receiving payouts.
                    </p>
                    <button
                      onClick={() => setIsEditingPayment(true)}
                      className="px-6 py-3 bg-[#10B981] hover:bg-[#059669] text-white font-bold rounded-lg transition-colors"
                    >
                      Add Payment Details
                    </button>
                  </div>
                )}

                {/* Terms and Conditions */}
                <div className="mt-6 bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <h4 className="text-[14px] font-black text-[#001A33] mb-3">Terms & Conditions</h4>
                  <div className="text-[12px] text-gray-600 font-semibold space-y-2">
                    <p>• Commission Structure: 70% of booking amount goes to supplier, 30% platform fee.</p>
                    <p>• TDS (Tax Deducted at Source): 5% TDS applies for Indian suppliers without verified GSTIN. No TDS for non-Indian suppliers or Indian suppliers with verified GSTIN.</p>
                    <p>• Payment Schedule: Payments are processed monthly on the 5th of each month (or next business day if weekend).</p>
                    <p>• Payment Method: Ensure your payment details are verified and up-to-date to receive payouts without delay.</p>
                    <p>• Tax Compliance: Suppliers are responsible for their own tax obligations in their respective countries.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h2 className="text-2xl font-black text-[#001A33] mb-6">Profile Settings</h2>
              <p className="text-[14px] text-gray-600 font-semibold mb-6">
                Your contact information will be shared with customers when they book your tours. Keep it updated!
              </p>
              <div className="space-y-6">
                <div>
                  <label className="block text-[14px] font-bold text-[#001A33] mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={profileData.fullName}
                    onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full bg-white border-2 border-gray-200 rounded-2xl py-4 px-4 font-bold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] outline-none"
                  />
                  <p className="text-[12px] text-gray-500 font-semibold mt-2">
                    Your name as it will appear to customers
                  </p>
                </div>
                <div>
                  <label className="block text-[14px] font-bold text-[#001A33] mb-2">Email Address *</label>
                  <input
                    type="email"
                    value={supplier.email}
                    readOnly
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 font-bold text-[#001A33] text-[14px]"
                  />
                  <p className="text-[12px] text-gray-500 font-semibold mt-2">
                    This email will be shared with customers for tour bookings
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSavingProfile}
                    className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-black py-4 rounded-2xl text-[16px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSavingProfile ? 'Saving...' : 'Save Contact Information'}
                  </button>
                </div>
                <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                  {getStatusBadge(currentSupplier?.status || supplier.status)}
                  {supplier.emailVerified && (
                    <span className="px-3 py-1 bg-[#10B981]/10 text-[#10B981] rounded-full text-[12px] font-bold flex items-center gap-1">
                      <CheckCircle2 size={12} />
                      Email Verified
                    </span>
                  )}
                </div>

                {/* Documents Section */}
                <div className="pt-6 border-t border-gray-200 mt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <ShieldCheck className="text-[#10B981]" size={20} />
                    <h3 className="text-lg font-black text-[#001A33]">Uploaded Documents</h3>
                  </div>
                  <p className="text-[12px] text-gray-500 font-semibold mb-4">
                    View all documents you've uploaded during registration
                  </p>

                  {/* License Document */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-[13px] font-bold text-[#001A33]">License / Verification Document</label>
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleLicenseUpload}
                          disabled={isUploadingLicense}
                          className="hidden"
                        />
                        <button
                          type="button"
                          disabled={isUploadingLicense}
                          className="flex items-center gap-2 px-3 py-1.5 bg-[#10B981] hover:bg-[#059669] text-white rounded-lg text-[12px] font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isUploadingLicense ? (
                            <>
                              <RefreshCw size={14} className="animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload size={14} />
                              {documents.license ? 'Replace' : 'Upload'}
                            </>
                          )}
                        </button>
                      </label>
                    </div>
                    {documents.license ? (
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="flex items-center gap-3">
                          <FileText className="text-[#10B981]" size={20} />
                          <span className="text-[13px] font-bold text-[#001A33]">License Document</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <a
                            href={documents.license}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-[#10B981] hover:bg-[#10B981]/10 rounded-lg transition-colors"
                            title="View document"
                          >
                            <Eye size={18} />
                          </a>
                          <a
                            href={documents.license}
                            download
                            className="p-2 text-[#10B981] hover:bg-[#10B981]/10 rounded-lg transition-colors"
                            title="Download document"
                          >
                            <Download size={18} />
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                        <p className="text-[12px] text-gray-500 font-semibold">No license document uploaded</p>
                      </div>
                    )}
                  </div>

                  {/* Certificates */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-[13px] font-bold text-[#001A33]">
                        Additional Certificates ({documents.certificates.length}/5)
                      </label>
                      {documents.certificates.length < 5 && (
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            multiple
                            onChange={handleCertificatesUpload}
                            disabled={isUploadingCertificates}
                            className="hidden"
                          />
                          <button
                            type="button"
                            disabled={isUploadingCertificates}
                            className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-[12px] font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isUploadingCertificates ? (
                              <>
                                <RefreshCw size={14} className="animate-spin" />
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Plus size={14} />
                                Add Certificates
                              </>
                            )}
                          </button>
                        </label>
                      )}
                    </div>
                    {documents.certificates.length > 0 ? (
                      <div className="space-y-2">
                        {documents.certificates.map((cert, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                            <div className="flex items-center gap-3">
                              <FileText className="text-blue-500" size={20} />
                              <span className="text-[13px] font-bold text-[#001A33]">Certificate {index + 1}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <a
                                href={cert}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                title="View certificate"
                              >
                                <Eye size={18} />
                              </a>
                              <a
                                href={cert}
                                download
                                className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Download certificate"
                              >
                                <Download size={18} />
                              </a>
                              <button
                                onClick={() => handleDeleteCertificate(index)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete certificate"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                        <p className="text-[12px] text-gray-500 font-semibold">No additional certificates uploaded</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupplierDashboard;

