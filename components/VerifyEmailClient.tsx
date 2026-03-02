'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Mail,
  ArrowRight,
  RefreshCw
} from 'lucide-react';

type VerificationState = 'loading' | 'success' | 'error';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [state, setState] = useState<VerificationState>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const hasAttempted = useRef(false);

  useEffect(() => {
    // Prevent double-invocation in React strict mode
    if (hasAttempted.current) return;
    hasAttempted.current = true;

    const token = searchParams.get('token');

    if (!token) {
      setState('error');
      setErrorMessage('No verification token found. Please check the link in your email and try again.');
      return;
    }

    verifyEmail(token);
  }, [searchParams]);

  const verifyEmail = async (token: string) => {
    setState('loading');
    setErrorMessage('');

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001');
      const response = await fetch(`${API_URL}/api/suppliers/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        setState('error');
        setErrorMessage('Server returned an unexpected response. Please try again later.');
        return;
      }

      if (!response.ok) {
        setState('error');
        setErrorMessage(data.message || data.error || 'Email verification failed. The link may have expired.');
        return;
      }

      if (data.success) {
        setState('success');
        // Store verified email so the supplier login can pre-fill it
        const email = data.email || data.supplier?.email || '';
        if (email) {
          setVerifiedEmail(email);
          sessionStorage.setItem('verifiedEmail', email);
        }
      } else {
        setState('error');
        setErrorMessage(data.message || data.error || 'Verification failed. Please try again or request a new verification email.');
      }
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : '';
      if (errMsg.includes('fetch') || errMsg.includes('Failed to fetch') || errMsg.includes('NetworkError')) {
        setErrorMessage('Cannot connect to the server. Please check your internet connection and try again.');
      } else {
        setErrorMessage('An unexpected error occurred during verification. Please try again.');
      }
      setState('error');
    }
  };

  const handleRetry = () => {
    hasAttempted.current = false;
    const token = searchParams.get('token');
    if (token) {
      verifyEmail(token);
    } else {
      setState('error');
      setErrorMessage('No verification token found. Please check the link in your email and try again.');
    }
  };

  const handleGoToSupplier = () => {
    router.push('/supplier?verified=true');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="bg-[#001A33] text-white py-3 px-8 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between h-16">
          <div className="flex items-center h-full">
            <span className="font-black tracking-tight text-lg">Email Verification</span>
          </div>
          <Mail size={24} className="opacity-60" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-8 bg-[#F8FAFC]">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-10 md:p-14 border border-gray-100">
          {/* Loading State */}
          {state === 'loading' && (
            <div className="flex flex-col items-center text-center space-y-6 py-8">
              <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center">
                <Loader2 className="animate-spin text-[#0071EB]" size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-[#001A33]">Verifying your email...</h3>
                <p className="text-[14px] text-gray-400 font-semibold">
                  Please wait while we confirm your email address.
                </p>
              </div>
              <div className="flex items-center gap-2 text-[12px] text-gray-300 font-semibold">
                <div className="w-2 h-2 rounded-full bg-[#0071EB] animate-pulse" />
                <span>This will only take a moment</span>
              </div>
            </div>
          )}

          {/* Success State */}
          {state === 'success' && (
            <div className="flex flex-col items-center text-center space-y-6 py-8">
              <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
                <CheckCircle2 className="text-[#10B981]" size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-[#001A33]">Email Verified!</h3>
                <p className="text-[14px] text-gray-400 font-semibold leading-relaxed">
                  Your email address has been successfully verified.
                  {verifiedEmail && (
                    <>
                      <br />
                      <span className="text-[#001A33] font-bold">{verifiedEmail}</span>
                    </>
                  )}
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 text-green-800 px-5 py-4 rounded-xl text-[13px] font-semibold w-full leading-relaxed">
                You can now log in to your partner dashboard. Click the button below to proceed.
              </div>

              <button
                onClick={handleGoToSupplier}
                className="w-full bg-[#0071EB] hover:bg-[#005bb8] text-white font-black py-5 rounded-full shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-2 text-[14px]"
              >
                Go to Partner Login
                <ArrowRight size={18} />
              </button>
            </div>
          )}

          {/* Error State */}
          {state === 'error' && (
            <div className="flex flex-col items-center text-center space-y-6 py-8">
              <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
                <XCircle className="text-red-500" size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-[#001A33]">Verification Failed</h3>
                <p className="text-[14px] text-gray-400 font-semibold leading-relaxed">
                  We were unable to verify your email address.
                </p>
              </div>

              <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl text-[13px] font-semibold w-full leading-relaxed">
                {errorMessage}
              </div>

              <div className="w-full space-y-3">
                {searchParams.get('token') && (
                  <button
                    onClick={handleRetry}
                    className="w-full bg-[#0071EB] hover:bg-[#005bb8] text-white font-black py-5 rounded-full shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-2 text-[14px]"
                  >
                    <RefreshCw size={18} />
                    Try Again
                  </button>
                )}
                <button
                  onClick={handleGoToSupplier}
                  className="w-full border-2 border-[#001A33] text-[#001A33] font-black py-5 rounded-full hover:bg-[#001A33] hover:text-white transition-all text-[14px]"
                >
                  Go to Partner Login
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 border-t border-gray-100 bg-white">
        &copy; 2025 AsiaByLocals Singapore Pte. Ltd. &bull; Professional Partner Program
      </footer>
    </div>
  );
}

export default function VerifyEmailClient() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex flex-col">
          <header className="bg-[#001A33] text-white py-3 px-8 sticky top-0 z-50">
            <div className="max-w-4xl mx-auto flex items-center justify-between h-16">
              <div className="flex items-center h-full">
                <span className="font-black tracking-tight text-lg">Email Verification</span>
              </div>
              <Mail size={24} className="opacity-60" />
            </div>
          </header>
          <main className="flex-1 flex items-center justify-center p-8 bg-[#F8FAFC]">
            <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-10 md:p-14 border border-gray-100">
              <div className="flex flex-col items-center text-center space-y-6 py-8">
                <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center">
                  <Loader2 className="animate-spin text-[#0071EB]" size={40} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-[#001A33]">Verifying your email...</h3>
                  <p className="text-[14px] text-gray-400 font-semibold">
                    Please wait while we confirm your email address.
                  </p>
                </div>
              </div>
            </div>
          </main>
          <footer className="py-8 text-center text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 border-t border-gray-100 bg-white">
            &copy; 2025 AsiaByLocals Singapore Pte. Ltd. &bull; Professional Partner Program
          </footer>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
