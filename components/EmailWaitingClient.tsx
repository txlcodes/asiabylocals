'use client';

import React, { Suspense, useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Mail,
  Loader2,
  RefreshCw,
  Check,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Clock,
  Search,
  AtSign
} from 'lucide-react';
import Link from 'next/link';

function EmailWaitingFallback() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="bg-[#001A33] text-white py-3 px-8 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between h-16">
          <span className="font-black tracking-tight text-lg">Email Verification</span>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-8 bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#10B981]" />
          <p className="text-[14px] text-gray-500 font-semibold">Loading...</p>
        </div>
      </main>
    </div>
  );
}

export default function EmailWaitingClient() {
  return (
    <Suspense fallback={<EmailWaitingFallback />}>
      <EmailWaitingContent />
    </Suspense>
  );
}

function EmailWaitingContent() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email') || '';
  const supplierIdParam = searchParams.get('supplierId') || '';

  const [supplierId, setSupplierId] = useState(supplierIdParam);
  const [isResending, setIsResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [resendMessage, setResendMessage] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001');

  // Try to recover supplierId from localStorage if not in URL
  useEffect(() => {
    if (!supplierId) {
      const storedSupplierId = localStorage.getItem('pendingSupplierId');
      if (storedSupplierId) {
        setSupplierId(storedSupplierId);
      }
    }
  }, [supplierId]);

  // Poll for email verification status
  const checkVerification = useCallback(async () => {
    if (!supplierId) return;

    try {
      const response = await fetch(`${API_URL}/api/suppliers/${supplierId}/verification-status`);
      const data = await response.json();

      if (data.success && data.emailVerified) {
        setIsVerified(true);
        if (pollingRef.current) {
          clearInterval(pollingRef.current);
          pollingRef.current = null;
        }
        // Store verified email for login page
        if (emailParam) {
          sessionStorage.setItem('verifiedEmail', emailParam);
        }
        // Redirect to supplier page after brief success display
        setTimeout(() => {
          window.location.href = `/supplier?verified=true&supplierId=${supplierId}&openRegistration=true`;
        }, 2000);
      }
    } catch {
      // Silently retry on network errors
    }
  }, [supplierId, emailParam, API_URL]);

  useEffect(() => {
    if (!supplierId) return;

    // Check immediately
    checkVerification();

    // Then poll every 3 seconds
    pollingRef.current = setInterval(checkVerification, 3000);

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [supplierId, checkVerification]);

  const handleResendEmail = async () => {
    if (!emailParam) {
      setResendStatus('error');
      setResendMessage('No email address available. Please register again.');
      return;
    }

    setIsResending(true);
    setResendStatus('idle');
    setResendMessage('');

    try {
      const response = await fetch(`${API_URL}/api/suppliers/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailParam }),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        setResendStatus('error');
        setResendMessage('Server error. Please try again later.');
        setIsResending(false);
        return;
      }

      if (response.ok && data.success) {
        setResendStatus('success');
        setResendMessage('Verification email resent! Please check your inbox.');
      } else {
        setResendStatus('error');
        setResendMessage(data.message || data.error || 'Failed to resend verification email.');
      }
    } catch {
      setResendStatus('error');
      setResendMessage('Could not connect to server. Please check your connection and try again.');
    } finally {
      setIsResending(false);
    }
  };

  // Clear resend status after 8 seconds
  useEffect(() => {
    if (resendStatus !== 'idle') {
      const timeout = setTimeout(() => {
        setResendStatus('idle');
        setResendMessage('');
      }, 8000);
      return () => clearTimeout(timeout);
    }
  }, [resendStatus]);

  const displayEmail = emailParam || 'your email address';

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="bg-[#001A33] text-white py-3 px-8 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between h-16">
          <div className="flex items-center h-full">
            <span className="font-black tracking-tight text-lg">Email Verification</span>
          </div>
          <Link
            href="/supplier"
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft size={24} />
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-8 bg-[#F8FAFC]">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-10 md:p-14 border border-gray-100">
          <div className="space-y-8">
            {/* Mail Icon */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center">
                  <Mail className="w-12 h-12 text-[#10B981]" />
                </div>
                <span className="absolute -top-1 -right-1 w-8 h-8 bg-[#10B981] rounded-full flex items-center justify-center shadow-lg shadow-emerald-200">
                  {isVerified ? (
                    <CheckCircle2 size={18} className="text-white" />
                  ) : (
                    <Check size={16} className="text-white" />
                  )}
                </span>
              </div>
            </div>

            {/* Heading */}
            {isVerified ? (
              <div className="text-center">
                <h3 className="text-2xl font-black text-[#001A33] mb-2">Email Verified!</h3>
                <p className="text-[14px] text-gray-400 font-semibold">
                  Redirecting you to the supplier portal...
                </p>
              </div>
            ) : (
              <div className="text-center">
                <h3 className="text-2xl font-black text-[#001A33] mb-2">Check Your Email</h3>
                <p className="text-[14px] text-gray-400 font-semibold">
                  We&apos;ve sent a verification link to{' '}
                  {emailParam ? (
                    <span className="text-[#001A33] font-bold">{emailParam}</span>
                  ) : (
                    'your email address'
                  )}
                </p>
              </div>
            )}

            {/* Verified Success Banner */}
            {isVerified && (
              <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2">
                <CheckCircle2 size={18} className="text-green-600 flex-shrink-0" />
                Email verified successfully! Redirecting...
              </div>
            )}

            {/* Instructions */}
            {!isVerified && (
              <>
                <div className="bg-gray-50 rounded-2xl p-6">
                  <p className="font-bold text-[#001A33] mb-4 text-[14px]">Before you log in:</p>
                  <ol className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-[#0071EB] text-white rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5">1</span>
                      <span className="text-[14px] text-gray-700 font-semibold">
                        Check your inbox{' '}
                        {emailParam && (
                          <span className="text-[#001A33] font-bold">{emailParam}</span>
                        )}
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-[#0071EB] text-white rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5">2</span>
                      <span className="text-[14px] text-gray-700 font-semibold">Click the verification link in the email</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-[#0071EB] text-white rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5">3</span>
                      <span className="text-[14px] text-gray-700 font-semibold">Log in to the Supplier Portal</span>
                    </li>
                  </ol>
                </div>

                {/* Expiry Notice */}
                <div className="flex items-center gap-2 justify-center text-gray-400">
                  <Clock size={14} />
                  <span className="text-[12px] font-semibold">The verification link expires in 24 hours</span>
                </div>

                {/* Polling Status */}
                <div className="flex items-center justify-center gap-2 text-[#10B981]">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-[13px] font-semibold">Waiting for email confirmation...</span>
                </div>

                {/* Resend Section */}
                <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                  <p className="text-[13px] text-gray-500 font-bold text-center">
                    Didn&apos;t receive the email?
                  </p>

                  <button
                    type="button"
                    onClick={handleResendEmail}
                    disabled={isResending || !emailParam}
                    className="w-full bg-[#0071EB] hover:bg-[#005bb8] text-white font-black py-4 rounded-full shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 text-[14px]"
                  >
                    {isResending ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        Sending...
                      </>
                    ) : (
                      <>
                        <RefreshCw size={16} />
                        Resend Verification Email
                      </>
                    )}
                  </button>

                  {/* Resend Status Messages */}
                  {resendStatus === 'success' && (
                    <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl text-[13px] font-semibold flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-green-600 flex-shrink-0" />
                      {resendMessage}
                    </div>
                  )}

                  {resendStatus === 'error' && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-[13px] font-semibold flex items-center gap-2">
                      <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
                      {resendMessage}
                    </div>
                  )}
                </div>

                {/* Tips */}
                <div className="space-y-3">
                  <p className="text-[12px] text-gray-400 font-bold uppercase tracking-widest text-center">
                    Helpful Tips
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-[13px] text-gray-500 font-semibold">
                      <Search size={14} className="text-gray-400 flex-shrink-0" />
                      <span>Check your spam or junk folder</span>
                    </div>
                    {emailParam && (
                      <div className="flex items-center gap-3 text-[13px] text-gray-500 font-semibold">
                        <AtSign size={14} className="text-gray-400 flex-shrink-0" />
                        <span>
                          Make sure{' '}
                          <span className="text-[#001A33] font-bold">{emailParam}</span>{' '}
                          is correct
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-[13px] text-gray-500 font-semibold">
                      <Clock size={14} className="text-gray-400 flex-shrink-0" />
                      <span>Allow a few minutes for delivery</span>
                    </div>
                  </div>
                </div>

                {/* Divider + Back Link */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-[13px]">
                    <span className="px-4 bg-white text-gray-400 font-semibold">or</span>
                  </div>
                </div>

                <Link
                  href="/supplier"
                  className="w-full border-2 border-[#001A33] text-[#001A33] font-black py-5 rounded-full hover:bg-[#001A33] hover:text-white transition-all text-[14px] flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={16} />
                  Back to Supplier Portal
                </Link>
              </>
            )}
          </div>
        </div>
      </main>

      <footer className="py-8 text-center text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 border-t border-gray-100 bg-white">
        &copy; 2025 AsiaByLocals Singapore Pte. Ltd. &bull; Professional Partner Program
      </footer>
    </div>
  );
}
