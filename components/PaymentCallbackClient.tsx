'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, X, Loader2 } from 'lucide-react';

export default function PaymentCallbackClient() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <Loader2 className="text-[#10B981] mx-auto mb-4 animate-spin" size={48} />
          <h2 className="text-2xl font-black text-[#001A33] mb-2">Processing Payment...</h2>
          <p className="text-gray-600 font-semibold">Please wait while we verify your payment</p>
        </div>
      </div>
    }>
      <PaymentCallbackContent />
    </Suspense>
  );
}

function PaymentCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [error, setError] = useState<string | null>(null);
  const [, setBookingId] = useState<string | null>(null);

  useEffect(() => {
    const processPayment = async () => {
      try {
        // Prevent about:blank redirects
        if (typeof window !== 'undefined' && (window.location.href === 'about:blank' || window.location.href === 'about:srcdoc')) {
          console.error('Detected about:blank redirect - this should not happen');
          const storedBookingId = sessionStorage.getItem('pending_booking_id') || localStorage.getItem('last_booking_id');
          if (storedBookingId) {
            console.log('Found stored booking ID, redirecting...');
            router.replace(`/booking-confirmation/${storedBookingId}`);
            return;
          }
          router.replace('/');
          return;
        }

        // Get payment details from URL params (Razorpay sends these)
        const razorpayPaymentId = searchParams.get('razorpay_payment_id');
        const razorpayOrderId = searchParams.get('razorpay_order_id');
        const razorpaySignature = searchParams.get('razorpay_signature');
        const bookingIdParam = searchParams.get('bookingId');
        const paymentStatus = searchParams.get('status');

        if (!bookingIdParam) {
          setError('Booking ID not found');
          setStatus('error');
          return;
        }

        setBookingId(bookingIdParam);

        // If payment was cancelled or failed
        if (paymentStatus !== 'authorized' && paymentStatus !== 'captured') {
          setError('Payment was not completed');
          setStatus('error');
          setTimeout(() => {
            router.push('/');
          }, 3000);
          return;
        }

        const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

        // If we have payment details, verify payment
        if (razorpayPaymentId && razorpayOrderId && razorpaySignature) {
          const verifyResponse = await fetch(`${API_URL}/api/verify-payment`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              razorpay_order_id: razorpayOrderId,
              razorpay_payment_id: razorpayPaymentId,
              razorpay_signature: razorpaySignature,
              bookingId: bookingIdParam
            }),
          });

          const verifyData = await verifyResponse.json();

          if (verifyData.success) {
            setStatus('success');
            router.replace(`/booking-confirmation/${bookingIdParam}`);
          } else {
            setError(verifyData.message || 'Payment verification failed');
            setStatus('error');
          }
        } else {
          // If no payment details in URL, check booking status
          const bookingResponse = await fetch(`${API_URL}/api/bookings/${bookingIdParam}/confirmation`);
          const bookingData = await bookingResponse.json();

          if (bookingData.success && bookingData.booking.paymentStatus === 'paid') {
            setStatus('success');
            router.replace(`/booking-confirmation/${bookingIdParam}`);
          } else {
            setError('Payment verification pending');
            setStatus('error');
          }
        }
      } catch (err) {
        console.error('Payment callback error:', err);
        setError('An error occurred while processing payment');
        setStatus('error');
      }
    };

    processPayment();
  }, [searchParams, router]);

  if (status === 'processing') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <Loader2 className="text-[#10B981] mx-auto mb-4 animate-spin" size={48} />
          <h2 className="text-2xl font-black text-[#001A33] mb-2">Processing Payment...</h2>
          <p className="text-gray-600 font-semibold">Please wait while we verify your payment</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <X className="text-red-500 mx-auto mb-4" size={48} />
          <h2 className="text-2xl font-black text-[#001A33] mb-2">Payment Failed</h2>
          <p className="text-gray-600 font-semibold mb-6">{error || 'There was an issue processing your payment'}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-[#10B981] text-white font-black rounded-xl hover:bg-[#059669] transition-colors"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <CheckCircle className="text-[#10B981] mx-auto mb-4" size={48} />
        <h2 className="text-2xl font-black text-[#001A33] mb-2">Payment Successful!</h2>
        <p className="text-gray-600 font-semibold mb-6">Redirecting to your booking confirmation...</p>
        <Loader2 className="text-[#10B981] mx-auto animate-spin" size={24} />
      </div>
    </div>
  );
}
