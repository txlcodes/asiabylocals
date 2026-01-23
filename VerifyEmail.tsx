import React, { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Loader2, Mail } from 'lucide-react';
import { API_URL } from '@/src/config';

const VerifyEmail: React.FC = () => {
  // Get token from URL query parameter
  // Handle email client modifications (Gmail/Outlook add tracking params)
  const getTokenFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    let token = urlParams.get('token');
    
    // If token not found in params, try extracting from full URL
    // Email clients sometimes modify URLs
    if (!token) {
      const fullUrl = window.location.href;
      const tokenMatch = fullUrl.match(/[?&]token=([a-f0-9]{64})/i);
      if (tokenMatch) {
        token = tokenMatch[1];
      }
    }
    
    // Clean token: remove any email client tracking parameters
    if (token) {
      // Remove common email client additions
      token = token.split('&')[0].split('#')[0].split('?')[0];
      token = decodeURIComponent(token).trim();
    }
    
    console.log('🔍 Extracted token from URL:');
    console.log('   Full URL:', window.location.href);
    console.log('   Token:', token ? `${token.substring(0, 20)}...` : 'NOT FOUND');
    console.log('   Token length:', token?.length || 0);
    
    return token;
  };

  const [token] = useState<string | null>(getTokenFromUrl());
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided. Please check your email for the complete verification link.');
      return;
    }

    // Call verification API
    const verifyEmail = async () => {
      try {
        // Use production API URL, fallback to current origin
        const apiUrl = API_URL || window.location.origin;
        const tokenParam = encodeURIComponent(token);
        const verifyUrl = `${apiUrl}/api/suppliers/verify-email?token=${tokenParam}`;
        
        console.log('🔍 Verifying email...');
        console.log('   API URL:', apiUrl);
        console.log('   Token length:', token?.length);
        console.log('   Token (first 20 chars):', token?.substring(0, 20));
        console.log('   Full URL:', verifyUrl);
        
        const response = await fetch(verifyUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log('   Response status:', response.status);
        console.log('   Response OK:', response.ok);
        
        const data = await response.json();
        console.log('   Response data:', data);

        if (response.ok && data.success) {
          setStatus('success');
          setMessage(data.message || 'Email verified successfully! Your account is now active.');
          
          // Store verification success in localStorage for SupplierRegistration to detect
          localStorage.setItem('emailVerified', 'true');
          localStorage.setItem('verifiedSupplierId', data.supplier.id);
          
          // Redirect back to registration form at step 5 (license upload)
          // This ensures users upload their license document before they can login
          const redirectUrl = data.redirectUrl || `${window.location.origin}/supplier?register=true&verified=true&email=${encodeURIComponent(data.supplier.email)}&supplierId=${data.supplier.id}`;
          
          console.log('✅ Email verified successfully, redirecting to license upload:', redirectUrl);
          console.log('   Supplier ID:', data.supplier.id);
          console.log('   Email verified:', data.supplier.emailVerified);
          console.log('   Next step: License document upload');
          
          // Redirect after a short delay to show success message
          setTimeout(() => {
            window.location.replace(redirectUrl);
          }, 1500);
        } else {
          setStatus('error');
          const errorMessage = data.message || data.error || 'Failed to verify email. Please try again.';
          const errorDetails = data.details ? ` (${data.details})` : '';
          const errorHint = data.hint ? ` ${data.hint}` : '';
          setMessage(errorMessage + errorDetails + errorHint);
          console.error('❌ Verification failed:', data);
        }
      } catch (error) {
        setStatus('error');
        const errorMsg = error instanceof Error ? error.message : 'Network error';
        setMessage(`An error occurred while verifying your email: ${errorMsg}. Please check your connection and try again.`);
        console.error('❌ Verification error:', error);
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 md:p-10 text-center">
        {status === 'loading' && (
          <>
            <div className="w-20 h-20 bg-[#10B981]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-10 h-10 text-[#10B981] animate-spin" />
            </div>
            <h1 className="text-2xl font-black text-[#001A33] mb-3">Verifying Your Email</h1>
            <p className="text-gray-500 font-semibold">Please wait while we verify your email address...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-20 h-20 bg-[#10B981]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-[#10B981]" />
            </div>
            <h1 className="text-2xl font-black text-[#001A33] mb-3">Email Verified! 🎉</h1>
            <p className="text-gray-600 font-semibold mb-6 leading-relaxed">{message}</p>
            <div className="bg-[#10B981]/5 border border-[#10B981]/20 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                <div className="text-left">
                  <p className="text-sm font-bold text-[#001A33] mb-1">Welcome Email Sent</p>
                  <p className="text-xs text-gray-600">Check your inbox for a welcome email with next steps.</p>
                </div>
              </div>
            </div>
            <a
              href="/"
              className="inline-block w-full bg-[#10B981] hover:bg-[#059669] text-white font-black py-4 rounded-full transition-all text-[14px]"
            >
              Continue to Homepage
            </a>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-2xl font-black text-[#001A33] mb-3">Verification Failed</h1>
            <p className="text-gray-600 font-semibold mb-6 leading-relaxed">{message}</p>
            <div className="space-y-3">
              <a
                href="/supplier"
                className="inline-block w-full bg-[#10B981] hover:bg-[#059669] text-white font-black py-4 rounded-full transition-all text-[14px]"
              >
                Go to Supplier Page
              </a>
              <a
                href="/"
                className="inline-block w-full bg-gray-100 hover:bg-gray-200 text-[#001A33] font-black py-4 rounded-full transition-all text-[14px]"
              >
                Back to Homepage
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;

