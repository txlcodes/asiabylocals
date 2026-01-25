import React, { useEffect, useState } from 'react';
import { Mail, Loader2, RefreshCw, Check } from 'lucide-react';

const EmailVerificationWaiting: React.FC = () => {
  const [email, setEmail] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [isResending, setIsResending] = useState(false);

  // Get params from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setEmail(params.get('email') || '');
    setSupplierId(params.get('supplierId') || '');
  }, []);

  // Poll for email verification status
  useEffect(() => {
    if (!supplierId) {
      console.log('⚠️ No supplierId in URL, cannot check verification status');
      // Try to get supplierId from localStorage (set during registration)
      const storedSupplierId = localStorage.getItem('pendingSupplierId');
      if (storedSupplierId) {
        console.log('   Found supplierId in localStorage:', storedSupplierId);
        setSupplierId(storedSupplierId);
      }
      return;
    }

    const checkVerification = async () => {
      try {
        // Use window.location.origin for unified deployment
        const API_URL = import.meta.env.VITE_API_URL || window.location.origin;
        const url = `${API_URL}/api/suppliers/${supplierId}/verification-status`;
        
        console.log('🔍 Checking verification status:', url);
        
        const response = await fetch(url);
        const data = await response.json();
        
        console.log('   Response:', data);
        
        if (data.success && data.emailVerified) {
          console.log('✅ Email verified! Redirecting...');
          // Clear polling
          clearInterval(interval);
          // Redirect to supplier page with registration open and verified
          window.location.href = `/supplier?verified=true&supplierId=${supplierId}&openRegistration=true`;
        } else if (data.success && !data.emailVerified) {
          console.log('   ⏳ Still waiting for verification...');
        } else {
          console.warn('   ⚠️ Unexpected response:', data);
        }
      } catch (error) {
        console.error('❌ Verification check error:', error);
        // Don't stop polling on network errors - might be temporary
      }
    };

    // Check immediately
    checkVerification();
    
    // Then check every 3 seconds
    const interval = setInterval(() => {
      checkVerification();
    }, 3000);

    return () => clearInterval(interval);
  }, [supplierId]);

  const handleResendEmail = async () => {
    setIsResending(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001');
      const response = await fetch(`${API_URL}/api/suppliers/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      
      if (data.success) {
        alert('Verification email resent! Please check your inbox.');
      } else {
        alert(data.message || 'Failed to resend email.');
      }
    } catch (error) {
      alert('Failed to resend email. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-10 text-center">
        {/* Heading */}
        <h3 className="text-2xl font-black text-[#001A33] mb-3">
          We're excited to have you onboard.
        </h3>
        
        {/* Envelope Icon with Badge */}
        <div className="relative w-24 h-24 mx-auto mb-6">
          <Mail className="w-full h-full text-[#10B981]" />
          <span className="absolute top-0 right-0 block w-5 h-5 bg-[#10B981] rounded-full text-white text-xs font-bold flex items-center justify-center">
            <Check size={12} />
          </span>
        </div>
        
        {/* Instructions */}
        <div className="text-left max-w-sm mx-auto">
          <p className="font-bold text-[#001A33] mb-4">Before you log in:</p>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 text-[14px]">
            <li>Check your inbox <strong className="text-[#001A33]">{email}</strong></li>
            <li>Confirm your email address</li>
            <li>Log in to the Supplier Portal</li>
          </ol>
        </div>
        
        {/* Status Indicator */}
        <div className="flex items-center justify-center gap-2 text-[#10B981] mt-6">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-[13px] font-semibold">Waiting for email confirmation...</span>
        </div>
        
        {/* Resend Link */}
        <div className="mt-8 p-4 bg-gray-50 rounded-xl">
          <p className="text-[12px] text-gray-500 font-semibold mb-2">Didn't receive the email?</p>
          <button
            type="button"
            onClick={handleResendEmail}
            disabled={isResending}
            className="text-[#10B981] hover:text-[#059669] font-bold text-[13px] flex items-center gap-2 mx-auto disabled:opacity-50"
          >
            <RefreshCw size={14} className={isResending ? 'animate-spin' : ''} />
            {isResending ? 'Sending...' : 'Resend Verification Email'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationWaiting;

