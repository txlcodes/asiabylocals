'use client';

import { useState, useEffect, Fragment } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  EyeOff,
  MapPin,
  Calendar,
  Phone,
  MessageCircle,
  Mail,
  Info,
  User,
  Building2,
  X,
  LogOut,
  Trash2,
  DollarSign,
  CreditCard,
  Building,
  Wallet,
  Search,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Lock,
  Loader2,
  Shield,
} from 'lucide-react';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001');

// ---------------------------------------------------------------------------
// Notification helper (replaces native alert / confirm)
// ---------------------------------------------------------------------------
function showNotification(message: string, type: 'success' | 'error' = 'success') {
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 px-6 py-4 rounded-xl shadow-lg z-50 font-bold text-[14px] flex items-center gap-2 transform transition-all duration-300 translate-y-0 opacity-100 ${
    type === 'success' ? 'bg-[#10B981] text-white' : 'bg-red-500 text-white'
  }`;
  notification.innerHTML = `
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      ${
        type === 'success'
          ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>'
          : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>'
      }
    </svg>
    <span>${message}</span>
  `;
  document.body.appendChild(notification);

  requestAnimationFrame(() => {
    notification.style.transform = 'translateY(10px)';
  });

  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(-20px)';
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 5000);
}

// ---------------------------------------------------------------------------
// Auth headers
// ---------------------------------------------------------------------------
function getAuthHeaders() {
  return {
    'Content-Type': 'application/json',
    'x-admin-auth': 'authenticated',
  };
}

// ---------------------------------------------------------------------------
// Duration formatter
// ---------------------------------------------------------------------------
function formatDurationDisplay(durationStr: string | null | undefined) {
  if (!durationStr) return null;

  const match = durationStr.match(/(\d+(?:\.\d+)?)\s*(days?|hours?|hrs?)/i);
  if (!match) return durationStr;

  const num = parseFloat(match[1]);
  const unit = match[2].toLowerCase();

  if (unit.startsWith('h') && num === 6) return '6 days';
  if (unit.startsWith('h') && num >= 24 && num % 24 === 0) {
    const d = num / 24;
    return `${d} ${d === 1 ? 'day' : 'days'}`;
  }

  return durationStr;
}

// ---------------------------------------------------------------------------
// Price display helper
// ---------------------------------------------------------------------------
function getDisplayPrice(tour: any): string {
  let displayPrice = tour.pricePerPerson || 0;

  if (tour.groupPricingTiers) {
    try {
      const tiers =
        typeof tour.groupPricingTiers === 'string'
          ? JSON.parse(tour.groupPricingTiers)
          : tour.groupPricingTiers;
      if (Array.isArray(tiers) && tiers.length > 0 && tiers[0]?.price) {
        displayPrice = parseFloat(tiers[0].price) || 0;
      }
    } catch (_) {
      /* ignore */
    }
  }

  if (displayPrice === 0 && tour.options && Array.isArray(tour.options) && tour.options.length > 0) {
    for (const opt of tour.options) {
      if (opt.groupPricingTiers) {
        try {
          const tiers =
            typeof opt.groupPricingTiers === 'string'
              ? JSON.parse(opt.groupPricingTiers)
              : opt.groupPricingTiers;
          if (Array.isArray(tiers) && tiers.length > 0 && tiers[0]?.price) {
            const firstTierPrice = parseFloat(tiers[0].price) || 0;
            if (firstTierPrice > 0) {
              displayPrice = displayPrice === 0 ? firstTierPrice : Math.min(displayPrice, firstTierPrice);
            }
          }
        } catch (_) {
          /* ignore */
        }
      }
    }
  }

  return `${tour.currency} ${displayPrice.toLocaleString()}`;
}

// ---------------------------------------------------------------------------
// Login sub-component (inlined)
// ---------------------------------------------------------------------------
function AdminLoginView({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setErrorMessage('Please enter both username and password');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const loginUrl = `${API_URL}/api/admin/login`;

      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        setErrorMessage('Server error. Please try again later.');
        setIsSubmitting(false);
        return;
      }

      if (!response.ok) {
        setErrorMessage(data.message || data.error || 'Login failed. Please check your credentials.');
        setIsSubmitting(false);
        return;
      }

      if (data.success) {
        localStorage.setItem(
          'admin',
          JSON.stringify({
            authenticated: true,
            username: data.username,
            loginTime: new Date().toISOString(),
          }),
        );
        onLoginSuccess();
      } else {
        setErrorMessage(data.error || data.message || 'Login failed. Please check your credentials.');
        setIsSubmitting(false);
      }
    } catch (error: any) {
      if (error.message?.includes('fetch') || error.message?.includes('Failed to fetch')) {
        setErrorMessage('Cannot connect to server. Please make sure the backend server is running.');
      } else {
        setErrorMessage('Failed to login. Please check your connection and try again.');
      }
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001A33] via-[#003366] to-[#001A33] flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-10 md:p-14 border border-gray-100">
        <div className="space-y-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#001A33] rounded-full mb-4">
              <Shield className="text-white" size={32} />
            </div>
            <h3 className="text-2xl font-black text-[#001A33] mb-2">Admin Portal</h3>
            <p className="text-[14px] text-gray-400 font-semibold">Sign in to access the admin dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Admin Username"
                className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 font-bold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#0071EB] transition-all outline-none"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-12 font-bold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#0071EB] transition-all outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-semibold">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#001A33] hover:bg-[#003366] text-white font-black py-5 rounded-full shadow-lg shadow-gray-200 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 text-[14px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Signing in...
                </>
              ) : (
                <>
                  <Shield size={18} />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-center text-gray-400 font-semibold">Secure Admin Access</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===========================================================================
// Main Admin Client component
// ===========================================================================
export default function AdminClient() {
  // Auth
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Tabs
  const [activeTab, setActiveTab] = useState<'tours' | 'suppliers' | 'bookings' | 'payments'>('suppliers');

  // Tours
  const [pendingTours, setPendingTours] = useState<any[]>([]);
  const [toursCount, setToursCount] = useState({ pending: 0, approved: 0, all: 0 });
  const [tourFilter, setTourFilter] = useState<'pending' | 'approved' | 'all'>('pending');
  const [selectedTour, setSelectedTour] = useState<any>(null);

  // Suppliers
  const [pendingSuppliers, setPendingSuppliers] = useState<any[]>([]);
  const [approvedSuppliers, setApprovedSuppliers] = useState<any[]>([]);
  const [supplierFilter, setSupplierFilter] = useState<'pending' | 'approved' | 'all'>('pending');
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);

  // Bookings
  const [bookings, setBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  // Shared
  const [loading, setLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // License modal
  const [showLicenseModal, setShowLicenseModal] = useState(false);
  const [licenseUrl, setLicenseUrl] = useState<string | null>(null);

  // Payment Details
  const [suppliersWithPayments, setSuppliersWithPayments] = useState<any[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [paymentSearchQuery, setPaymentSearchQuery] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'verified' | 'unverified' | 'no_details'>('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>('all');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);

  // -------------------------------------------------------------------------
  // Auth check on mount
  // -------------------------------------------------------------------------
  useEffect(() => {
    const adminData = localStorage.getItem('admin');
    if (adminData) {
      try {
        const admin = JSON.parse(adminData);
        if (admin.authenticated) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('admin');
        }
      } catch {
        localStorage.removeItem('admin');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin');
    setIsAuthenticated(false);
  };

  // -------------------------------------------------------------------------
  // Fetch helpers
  // -------------------------------------------------------------------------
  const fetchToursCounts = async () => {
    try {
      const [pendingRes, allRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/tours/pending`, { headers: getAuthHeaders() }),
        fetch(`${API_URL}/api/admin/tours?status=all`, { headers: getAuthHeaders() }),
      ]);

      const pendingData = await pendingRes.json();
      const allData = await allRes.json();

      if (pendingData.success && allData.success) {
        const approved = allData.tours.filter((t: any) => t.status === 'approved').length;
        setToursCount({
          pending: pendingData.tours.length,
          approved,
          all: allData.tours.length,
        });
      }
    } catch {
      // silently fail – counts are non-critical
    }
  };

  const fetchPendingTours = async () => {
    setLoading(true);
    try {
      let url: string;
      if (tourFilter === 'pending') {
        url = `${API_URL}/api/admin/tours/pending`;
      } else {
        url = `${API_URL}/api/admin/tours${tourFilter !== 'all' ? `?status=${tourFilter}` : ''}`;
      }

      const response = await fetch(url, { headers: getAuthHeaders() });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('admin');
          setIsAuthenticated(false);
          throw new Error('Authentication failed. Please log in again.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && Array.isArray(data.tours)) {
        setPendingTours(data.tours);
      } else {
        if (!data.tours) {
          setPendingTours([]);
        }
      }
    } catch (error: any) {
      if (
        error.message?.includes('401') ||
        error.message?.includes('403') ||
        error.message?.includes('Authentication')
      ) {
        localStorage.removeItem('admin');
        setIsAuthenticated(false);
      }
      if (
        error.name === 'AbortError' ||
        error.message?.includes('fetch') ||
        error.message?.includes('Failed to fetch')
      ) {
        setPendingTours([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    setLoadingBookings(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/bookings`, { headers: getAuthHeaders() });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (data.success && Array.isArray(data.bookings)) {
        setBookings(data.bookings);
      } else {
        setBookings([]);
      }
    } catch {
      setBookings([]);
    } finally {
      setLoadingBookings(false);
    }
  };

  const fetchPendingSuppliers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/suppliers/pending`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('admin');
          setIsAuthenticated(false);
          throw new Error('Authentication failed. Please log in again.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && Array.isArray(data.suppliers)) {
        setPendingSuppliers(data.suppliers);
      } else {
        setPendingSuppliers([]);
      }
    } catch (error: any) {
      let errorMessage = 'Failed to load pending suppliers.';
      if (error.name === 'AbortError') {
        errorMessage = 'Request timed out. Please check your connection and try again.';
      } else if (error.message?.includes('401') || error.message?.includes('403') || error.message?.includes('Authentication')) {
        errorMessage = 'Authentication failed. Please log in again.';
        localStorage.removeItem('admin');
        setIsAuthenticated(false);
      } else if (error.message?.includes('fetch') || error.message?.includes('Failed to fetch')) {
        errorMessage = 'Cannot connect to server. Please check your connection and try again.';
      } else if (error.message?.includes('500')) {
        errorMessage = 'Server error. Please try again in a few moments.';
      }
      showNotification(errorMessage, 'error');
      setPendingSuppliers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchApprovedSuppliers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/suppliers?status=approved&limit=200`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('admin');
          setIsAuthenticated(false);
          throw new Error('Authentication failed. Please log in again.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.suppliers && Array.isArray(data.suppliers)) {
        setApprovedSuppliers(data.suppliers);
      } else {
        setApprovedSuppliers([]);
      }
    } catch (error: any) {
      let errorMessage = 'Failed to load approved suppliers.';
      if (error.name === 'AbortError') {
        errorMessage = 'Request timed out. Please check your connection and try again.';
      } else if (error.message?.includes('401') || error.message?.includes('403')) {
        errorMessage = 'Authentication failed. Please log in again.';
        localStorage.removeItem('admin');
        setIsAuthenticated(false);
      } else if (error.message?.includes('fetch')) {
        errorMessage = 'Cannot connect to server. Please check your connection and try again.';
      }
      showNotification(errorMessage, 'error');
      setApprovedSuppliers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllSuppliers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/suppliers?limit=200`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('admin');
          setIsAuthenticated(false);
          throw new Error('Authentication failed. Please log in again.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.suppliers && Array.isArray(data.suppliers)) {
        const pending = data.suppliers.filter((s: any) => s.status === 'pending');
        const approved = data.suppliers.filter((s: any) => s.status === 'approved');
        setPendingSuppliers(pending);
        setApprovedSuppliers(approved);
      } else {
        setPendingSuppliers([]);
        setApprovedSuppliers([]);
      }
    } catch {
      showNotification('Failed to load suppliers.', 'error');
      setPendingSuppliers([]);
      setApprovedSuppliers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliersWithPayments = async () => {
    setLoadingPayments(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/suppliers/payment-details`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('admin');
          setIsAuthenticated(false);
          throw new Error('Authentication failed');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setSuppliersWithPayments(data.suppliers || []);
      } else {
        setSuppliersWithPayments([]);
      }
    } catch {
      setSuppliersWithPayments([]);
    } finally {
      setLoadingPayments(false);
    }
  };

  // -------------------------------------------------------------------------
  // Actions
  // -------------------------------------------------------------------------
  const handleVerifyPaymentDetails = async (supplierId: string) => {
    setIsProcessing(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/suppliers/${supplierId}/verify-payment`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      if (data.success) {
        showNotification('Payment details verified successfully!', 'success');
        fetchSuppliersWithPayments();
      } else {
        showNotification(data.message || 'Failed to verify payment details', 'error');
      }
    } catch {
      showNotification('Failed to verify payment details. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApprove = async (tourId: string) => {
    if (!tourId) {
      showNotification('Error: Tour ID is missing. Please select a tour again.', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/tours/${tourId}/approve`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (data.success) {
        showNotification('Tour approved successfully! It is now live on the site.', 'success');
        fetchPendingTours();
        setSelectedTour(null);
      } else {
        showNotification(data.message || data.error || 'Failed to approve tour', 'error');
      }
    } catch (error: any) {
      showNotification(`Failed to approve tour: ${error.message || 'Please try again.'}`, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApproveSupplier = async (supplierId: string) => {
    if (!supplierId) {
      showNotification('Error: Supplier ID is missing. Please select a supplier again.', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/suppliers/${supplierId}/approve`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (data.success) {
        showNotification('Supplier approved successfully! They can now create tours.', 'success');
        if (supplierFilter === 'pending') fetchPendingSuppliers();
        else if (supplierFilter === 'approved') fetchApprovedSuppliers();
        else fetchAllSuppliers();
        setSelectedSupplier(null);
      } else {
        showNotification(data.message || data.error || 'Failed to approve supplier', 'error');
      }
    } catch (error: any) {
      showNotification(`Failed to approve supplier: ${error.message || 'Please try again.'}`, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectSupplier = async (supplierId: string) => {
    if (!supplierId) {
      showNotification('Error: Supplier ID is missing. Please select a supplier again.', 'error');
      return;
    }
    if (!rejectionReason.trim()) {
      showNotification('Please provide a reason for rejection', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/suppliers/${supplierId}/reject`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ rejectionReason }),
      });

      const data = await response.json();

      if (data.success) {
        showNotification('Supplier rejected successfully.', 'success');
        if (supplierFilter === 'pending') fetchPendingSuppliers();
        else if (supplierFilter === 'approved') fetchApprovedSuppliers();
        else fetchAllSuppliers();
        setSelectedSupplier(null);
        setRejectionReason('');
      } else {
        showNotification(data.message || data.error || 'Failed to reject supplier', 'error');
      }
    } catch (error: any) {
      showNotification(`Failed to reject supplier: ${error.message || 'Please try again.'}`, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (tourId: string) => {
    if (!tourId) {
      showNotification('Error: Tour ID is missing. Please select a tour again.', 'error');
      return;
    }
    if (!rejectionReason.trim()) {
      showNotification('Please provide a reason for rejection', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/tours/${tourId}/reject`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ rejectionReason }),
      });

      const data = await response.json();

      if (data.success) {
        showNotification('Tour rejected successfully. The guide will be notified.', 'success');
        fetchPendingTours();
        setSelectedTour(null);
        setRejectionReason('');
      } else {
        showNotification(data.message || data.error || 'Failed to reject tour', 'error');
      }
    } catch (error: any) {
      showNotification(`Failed to reject tour: ${error.message || 'Please try again.'}`, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteTour = async (tourId: string) => {
    if (!tourId) {
      showNotification('Error: Tour ID is missing. Please select a tour again.', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/tours/${tourId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (data.success) {
        showNotification('Tour deleted successfully.', 'success');
        fetchPendingTours();
        setSelectedTour(null);
      } else {
        showNotification(data.message || data.error || 'Failed to delete tour', 'error');
      }
    } catch (error: any) {
      showNotification(`Failed to delete tour: ${error.message || 'Please try again.'}`, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // -------------------------------------------------------------------------
  // Data fetching effects
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (isAuthenticated) {
      fetchToursCounts();
      fetchAllSuppliers();
      fetchBookings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      if (activeTab === 'tours') {
        fetchPendingTours();
        fetchToursCounts();
      } else if (activeTab === 'suppliers') {
        if (supplierFilter === 'pending') fetchPendingSuppliers();
        else if (supplierFilter === 'approved') fetchApprovedSuppliers();
        else fetchAllSuppliers();
      } else if (activeTab === 'bookings') {
        fetchBookings();
      } else if (activeTab === 'payments') {
        fetchSuppliersWithPayments();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, isAuthenticated, tourFilter, supplierFilter]);

  // -------------------------------------------------------------------------
  // Not authenticated => show login
  // -------------------------------------------------------------------------
  if (!isAuthenticated) {
    return <AdminLoginView onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  // -------------------------------------------------------------------------
  // Loading state
  // -------------------------------------------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10B981] mb-4"></div>
        <p className="text-[14px] text-gray-500 font-semibold">Loading admin dashboard...</p>
        <p className="text-[12px] text-gray-400 mt-2">If this takes too long, check your connection</p>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Payment method helpers (used inside payments tab)
  // -------------------------------------------------------------------------
  const paymentMethodLabels: Record<string, string> = {
    bank_transfer: 'Bank Transfer',
    paypal: 'PayPal',
    credit_card: 'Credit/Debit Card',
    upi: 'UPI (India)',
    wise: 'Wise (formerly TransferWise)',
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'bank_transfer':
        return <Building size={18} className="text-blue-600" />;
      case 'paypal':
        return <Wallet size={18} className="text-blue-500" />;
      case 'credit_card':
        return <CreditCard size={18} className="text-purple-600" />;
      case 'upi':
        return <Wallet size={18} className="text-green-600" />;
      case 'wise':
        return <Wallet size={18} className="text-teal-600" />;
      default:
        return <DollarSign size={18} className="text-gray-400" />;
    }
  };

  // -------------------------------------------------------------------------
  // Supplier list to display based on filter
  // -------------------------------------------------------------------------
  const suppliersToShow =
    supplierFilter === 'pending'
      ? pendingSuppliers
      : supplierFilter === 'approved'
        ? approvedSuppliers
        : [...pendingSuppliers, ...approvedSuppliers];

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-black text-[#001A33]">Admin Dashboard</h1>
              <p className="text-[14px] text-gray-500 font-semibold mt-1">Review &amp; Approve Suppliers &amp; Tours</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-[#10B981] text-white px-4 py-2 rounded-full text-[14px] font-black">
                {activeTab === 'tours' && `${toursCount.pending} Tours Pending`}
                {activeTab === 'suppliers' && `${pendingSuppliers.length} Suppliers Pending`}
                {activeTab === 'bookings' &&
                  `${bookings.filter((b) => b.paymentStatus === 'pending').length} Bookings Pending`}
                {activeTab === 'payments' && 'Admin Dashboard'}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-lg transition-colors text-sm"
              >
                <LogOut size={18} />
                Logout
              </button>
              <Link
                href="/"
                className="text-[#001A33] font-semibold hover:text-[#10B981] text-[14px] transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-gray-200">
            {(['suppliers', 'tours', 'bookings', 'payments'] as const).map((tab) => {
              let label = '';
              if (tab === 'suppliers') label = `Suppliers (${pendingSuppliers.length})`;
              if (tab === 'tours') label = `Tours (${toursCount.all})`;
              if (tab === 'bookings') label = `Bookings (${bookings.filter((b) => b.paymentStatus === 'paid').length})`;
              if (tab === 'payments')
                label = `Payment Details (${suppliersWithPayments.filter((s) => s.paymentDetailsVerified).length}/${suppliersWithPayments.length})`;

              return (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setSelectedTour(null);
                    setSelectedSupplier(null);
                  }}
                  className={`px-6 py-3 font-black text-[14px] border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'border-[#10B981] text-[#10B981]'
                      : 'border-transparent text-gray-500 hover:text-[#001A33]'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* =============================================================== */}
        {/* SUPPLIERS TAB                                                    */}
        {/* =============================================================== */}
        {activeTab === 'suppliers' && (
          <div className="space-y-6">
            {/* Filter buttons */}
            <div className="flex gap-4 bg-white rounded-2xl p-2 border border-gray-200">
              <button
                onClick={() => { setSupplierFilter('pending'); setSelectedSupplier(null); }}
                className={`flex-1 px-4 py-3 font-black text-[14px] rounded-xl transition-colors ${
                  supplierFilter === 'pending' ? 'bg-[#10B981] text-white' : 'bg-transparent text-gray-500 hover:text-[#001A33]'
                }`}
              >
                Pending ({pendingSuppliers.length})
              </button>
              <button
                onClick={() => { setSupplierFilter('approved'); setSelectedSupplier(null); }}
                className={`flex-1 px-4 py-3 font-black text-[14px] rounded-xl transition-colors ${
                  supplierFilter === 'approved' ? 'bg-[#10B981] text-white' : 'bg-transparent text-gray-500 hover:text-[#001A33]'
                }`}
              >
                Approved ({approvedSuppliers.length})
              </button>
              <button
                onClick={() => { setSupplierFilter('all'); setSelectedSupplier(null); }}
                className={`flex-1 px-4 py-3 font-black text-[14px] rounded-xl transition-colors ${
                  supplierFilter === 'all' ? 'bg-[#10B981] text-white' : 'bg-transparent text-gray-500 hover:text-[#001A33]'
                }`}
              >
                All ({pendingSuppliers.length + approvedSuppliers.length})
              </button>
            </div>

            {suppliersToShow.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
                <CheckCircle2 className="mx-auto text-gray-300 mb-4" size={64} />
                <h2 className="text-2xl font-black text-[#001A33] mb-2">
                  {supplierFilter === 'pending' ? 'All caught up!' : supplierFilter === 'approved' ? 'No approved suppliers' : 'No suppliers found'}
                </h2>
                <p className="text-[14px] text-gray-500 font-semibold">
                  {supplierFilter === 'pending'
                    ? 'No suppliers pending review at the moment.'
                    : supplierFilter === 'approved'
                      ? 'No suppliers have been approved yet.'
                      : 'No suppliers found in the system.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* List */}
                <div className="lg:col-span-2 space-y-4">
                  <h2 className="text-xl font-black text-[#001A33] mb-4">
                    {supplierFilter === 'pending'
                      ? `Pending Suppliers (${pendingSuppliers.length})`
                      : supplierFilter === 'approved'
                        ? `Approved Suppliers (${approvedSuppliers.length})`
                        : `All Suppliers (${suppliersToShow.length})`}
                  </h2>
                  {suppliersToShow.map((supplier) => (
                    <div
                      key={supplier.id}
                      className={`bg-white rounded-2xl p-6 border-2 cursor-pointer transition-all ${
                        selectedSupplier?.id === supplier.id
                          ? 'border-[#10B981] shadow-lg ring-2 ring-[#10B981]/20'
                          : 'border-gray-200 hover:border-[#10B981]/30'
                      }`}
                      onClick={() => setSelectedSupplier(supplier)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-[#10B981]/10 rounded-xl flex items-center justify-center">
                          {supplier.businessType === 'company' ? (
                            <Building2 className="text-[#10B981]" size={24} />
                          ) : (
                            <User className="text-[#10B981]" size={24} />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-black text-[#001A33]">
                              {supplier.fullName}
                              {supplier.companyName && ` - ${supplier.companyName}`}
                            </h3>
                            <span className="text-[10px] font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                              ID: {supplier.id}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-[12px] text-gray-500 font-semibold mb-2">
                            <div className="flex items-center gap-1">
                              <Mail size={14} />
                              <span>{supplier.email}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar size={14} />
                              <span>{new Date(supplier.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-3 py-1 bg-blue-500/10 text-blue-700 text-[11px] font-black rounded-full border border-blue-500/20">
                              {supplier.businessType}
                            </span>
                            {supplier.emailVerified ? (
                              <span className="px-3 py-1 bg-[#10B981]/10 text-[#10B981] text-[11px] font-black rounded-full border border-[#10B981]/20">
                                Email Verified
                              </span>
                            ) : (
                              <span className="px-3 py-1 bg-yellow-500/10 text-yellow-700 text-[11px] font-black rounded-full border border-yellow-500/20">
                                Email Not Verified
                              </span>
                            )}
                          </div>
                          {supplier.city && supplier.mainHub && (
                            <div className="text-[12px] text-gray-500 font-semibold">
                              <MapPin size={12} className="inline mr-1" />
                              {supplier.city}, {supplier.mainHub}
                            </div>
                          )}
                        </div>
                        <div
                          className={`flex items-center gap-2 px-3 py-2 rounded-full ${
                            supplier.status === 'approved' ? 'bg-[#10B981]/10' : 'bg-yellow-50'
                          }`}
                        >
                          {supplier.status === 'approved' ? (
                            <>
                              <CheckCircle2 className="text-[#10B981]" size={18} />
                              <span className="text-[12px] font-black text-[#10B981]">Approved</span>
                            </>
                          ) : (
                            <>
                              <Clock className="text-yellow-600" size={18} />
                              <span className="text-[12px] font-black text-yellow-700">Pending</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Detail sidebar */}
                <div className="lg:col-span-1">
                  {selectedSupplier ? (
                    <div className="bg-white rounded-2xl p-6 border border-gray-200 sticky top-24">
                      <h3 className="text-xl font-black text-[#001A33] mb-4">Supplier Details</h3>

                      <div className="space-y-3 mb-6">
                        <div>
                          <div className="text-[11px] font-bold text-gray-500 uppercase mb-1">Supplier ID</div>
                          <div className="text-[14px] font-mono font-bold text-[#001A33] bg-gray-100 px-3 py-1.5 rounded-lg inline-block">
                            {selectedSupplier.id}
                          </div>
                        </div>
                        <div>
                          <div className="text-[11px] font-bold text-gray-500 uppercase mb-1">Name</div>
                          <div className="text-[16px] font-black text-[#001A33]">{selectedSupplier.fullName}</div>
                        </div>
                        {selectedSupplier.companyName && (
                          <div>
                            <div className="text-[11px] font-bold text-gray-500 uppercase mb-1">Company Name</div>
                            <div className="text-[14px] font-bold text-[#001A33]">{selectedSupplier.companyName}</div>
                          </div>
                        )}
                        <div>
                          <div className="text-[11px] font-bold text-gray-500 uppercase mb-1">Email</div>
                          <div className="text-[14px] font-semibold text-[#001A33]">{selectedSupplier.email}</div>
                          <div className="text-[12px] text-gray-500 font-semibold mt-1">
                            Verified: {selectedSupplier.emailVerified ? 'Yes' : 'No'}
                          </div>
                        </div>
                        {selectedSupplier.phone && (
                          <div>
                            <div className="text-[11px] font-bold text-gray-500 uppercase mb-1">Phone</div>
                            <div className="text-[14px] font-semibold text-[#001A33] flex items-center gap-2">
                              <Phone size={14} />
                              {selectedSupplier.phone}
                            </div>
                          </div>
                        )}
                        {selectedSupplier.whatsapp && (
                          <div>
                            <div className="text-[11px] font-bold text-gray-500 uppercase mb-1">WhatsApp</div>
                            <div className="text-[14px] font-semibold text-[#001A33] flex items-center gap-2">
                              <MessageCircle size={14} />
                              {selectedSupplier.whatsapp}
                            </div>
                          </div>
                        )}
                        {!selectedSupplier.phone && !selectedSupplier.whatsapp && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                            <div className="text-[12px] text-yellow-700 font-semibold flex items-center gap-2">
                              <Info size={14} />
                              No phone/WhatsApp provided
                            </div>
                          </div>
                        )}
                        {selectedSupplier.city && (
                          <div>
                            <div className="text-[11px] font-bold text-gray-500 uppercase mb-1">Location</div>
                            <div className="text-[14px] font-semibold text-[#001A33]">
                              {selectedSupplier.city}, {selectedSupplier.mainHub || 'N/A'}
                            </div>
                          </div>
                        )}
                        {selectedSupplier.tourLanguages && (
                          <div>
                            <div className="text-[11px] font-bold text-gray-500 uppercase mb-1">Tour Languages</div>
                            <div className="text-[14px] font-semibold text-[#001A33]">{selectedSupplier.tourLanguages}</div>
                          </div>
                        )}
                        {selectedSupplier.businessType && (
                          <div>
                            <div className="text-[11px] font-bold text-gray-500 uppercase mb-1">Business Type</div>
                            <div className="text-[14px] font-semibold text-[#001A33] capitalize">{selectedSupplier.businessType}</div>
                          </div>
                        )}
                        {selectedSupplier.verificationDocumentUrl ? (
                          <div>
                            <div className="text-[11px] font-bold text-gray-500 uppercase mb-1">Guiding License</div>
                            <button
                              onClick={() => {
                                setLicenseUrl(selectedSupplier.verificationDocumentUrl);
                                setShowLicenseModal(true);
                              }}
                              className="text-[#0071EB] text-[14px] font-semibold hover:underline flex items-center gap-2 cursor-pointer"
                            >
                              <Eye size={14} />
                              View License Document
                            </button>
                          </div>
                        ) : (
                          <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                            <div className="text-[12px] text-red-700 font-semibold flex items-center gap-2">
                              <Info size={14} />
                              No license document uploaded
                            </div>
                          </div>
                        )}
                        {/* Certificates */}
                        <div>
                          <div className="text-[11px] font-bold text-gray-500 uppercase mb-2">Additional Certificates</div>
                          {selectedSupplier.certificates ? (
                            (() => {
                              try {
                                const certs =
                                  typeof selectedSupplier.certificates === 'string'
                                    ? JSON.parse(selectedSupplier.certificates)
                                    : selectedSupplier.certificates;
                                if (Array.isArray(certs) && certs.length > 0) {
                                  return (
                                    <div className="space-y-2">
                                      {certs.map((cert: string, index: number) => (
                                        <button
                                          key={index}
                                          onClick={() => {
                                            setLicenseUrl(cert);
                                            setShowLicenseModal(true);
                                          }}
                                          className="w-full text-left text-[#0071EB] text-[13px] font-semibold hover:underline flex items-center gap-2 cursor-pointer p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                          <Eye size={14} />
                                          Certificate {index + 1}
                                        </button>
                                      ))}
                                    </div>
                                  );
                                }
                              } catch {
                                /* ignore */
                              }
                              return <div className="text-[12px] text-gray-500 font-semibold">No certificates uploaded</div>;
                            })()
                          ) : (
                            <div className="text-[12px] text-gray-500 font-semibold">No certificates uploaded</div>
                          )}
                        </div>
                        <div>
                          <div className="text-[11px] font-bold text-gray-500 uppercase mb-1">Registration Date</div>
                          <div className="text-[14px] font-semibold text-[#001A33]">
                            {new Date(selectedSupplier.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Actions for pending */}
                      {selectedSupplier.status === 'pending' && (
                        <div className="space-y-4">
                          <button
                            onClick={() => handleApproveSupplier(selectedSupplier.id)}
                            disabled={isProcessing || !selectedSupplier.verificationDocumentUrl}
                            className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-black py-5 rounded-full text-[16px] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg"
                          >
                            <CheckCircle2 size={20} />
                            Approve Supplier
                          </button>
                          {!selectedSupplier.verificationDocumentUrl && (
                            <p className="text-[12px] text-red-600 font-semibold text-center">
                              Cannot approve: No license document uploaded
                            </p>
                          )}

                          <div className="border-t border-gray-200 pt-4">
                            <label className="block text-[14px] font-bold text-[#001A33] mb-2">
                              Rejection Reason (if rejecting)
                            </label>
                            <textarea
                              value={rejectionReason}
                              onChange={(e) => setRejectionReason(e.target.value)}
                              placeholder="Enter reason for rejection..."
                              className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl p-3 text-[14px] font-semibold text-[#001A33] focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-none mb-3"
                              rows={3}
                            />
                            <button
                              onClick={() => handleRejectSupplier(selectedSupplier.id)}
                              disabled={isProcessing || !rejectionReason.trim()}
                              className="w-full bg-red-500 hover:bg-red-600 text-white font-black py-5 rounded-full text-[16px] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg"
                            >
                              <XCircle size={20} />
                              Reject Supplier
                            </button>
                          </div>
                        </div>
                      )}
                      {selectedSupplier.status === 'approved' && (
                        <div className="bg-[#10B981]/10 border border-[#10B981]/20 rounded-xl p-4">
                          <div className="flex items-center gap-2 text-[#10B981] font-black text-[14px]">
                            <CheckCircle2 size={18} />
                            Supplier Approved
                          </div>
                          <p className="text-[12px] text-gray-600 font-semibold mt-2">
                            This supplier has been approved and can create tours.
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl p-6 border border-gray-200 text-center">
                      <Eye className="mx-auto text-gray-300 mb-4" size={48} />
                      <p className="text-[14px] text-gray-500 font-semibold">Select a supplier to review</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* =============================================================== */}
        {/* TOURS TAB                                                        */}
        {/* =============================================================== */}
        {activeTab === 'tours' && (
          <div className="space-y-6">
            {/* Filter buttons */}
            <div className="flex gap-4 bg-white rounded-2xl p-2 border border-gray-200">
              <button
                onClick={() => { setTourFilter('pending'); setSelectedTour(null); }}
                className={`flex-1 px-4 py-3 font-black text-[14px] rounded-xl transition-colors ${
                  tourFilter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-transparent text-gray-500 hover:text-[#001A33]'
                }`}
              >
                Pending Review ({toursCount.pending})
              </button>
              <button
                onClick={() => { setTourFilter('approved'); setSelectedTour(null); }}
                className={`flex-1 px-4 py-3 font-black text-[14px] rounded-xl transition-colors ${
                  tourFilter === 'approved' ? 'bg-[#10B981] text-white' : 'bg-transparent text-gray-500 hover:text-[#001A33]'
                }`}
              >
                Approved ({toursCount.approved})
              </button>
              <button
                onClick={() => { setTourFilter('all'); setSelectedTour(null); }}
                className={`flex-1 px-4 py-3 font-black text-[14px] rounded-xl transition-colors ${
                  tourFilter === 'all' ? 'bg-[#001A33] text-white' : 'bg-transparent text-gray-500 hover:text-[#001A33]'
                }`}
              >
                All ({toursCount.all})
              </button>
            </div>

            {pendingTours.length === 0 && !loading ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
                <CheckCircle2 className="mx-auto text-gray-300 mb-4" size={64} />
                <h2 className="text-2xl font-black text-[#001A33] mb-2">
                  {tourFilter === 'pending' ? 'All caught up!' : tourFilter === 'approved' ? 'No approved tours' : 'No tours found'}
                </h2>
                <p className="text-[14px] text-gray-500 font-semibold">
                  {tourFilter === 'pending'
                    ? 'No tours pending review at the moment.'
                    : tourFilter === 'approved'
                      ? 'No approved tours found.'
                      : 'No tours found in the system.'}
                </p>
                <div className="mt-4 text-[12px] text-gray-400">Filter: {tourFilter}</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* List */}
                <div className="lg:col-span-2 space-y-4">
                  <h2 className="text-xl font-black text-[#001A33] mb-4">
                    {tourFilter === 'pending'
                      ? `Pending Review (${pendingTours.length})`
                      : tourFilter === 'approved'
                        ? `Approved Tours (${pendingTours.length})`
                        : `All Tours (${pendingTours.length})`}
                  </h2>

                  {pendingTours.map((tour) => (
                    <div
                      key={tour.id}
                      className={`bg-white rounded-2xl p-6 border-2 cursor-pointer transition-all ${
                        selectedTour?.id === tour.id
                          ? 'border-[#10B981] shadow-lg ring-2 ring-[#10B981]/20'
                          : 'border-gray-200 hover:border-[#10B981]/30'
                      }`}
                      onClick={() => setSelectedTour(tour)}
                    >
                      <div className="flex items-start gap-4">
                        {tour.images && tour.images.length > 0 && (
                          <img src={tour.images[0]} alt={tour.title} className="w-24 h-24 object-cover rounded-xl" />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-black text-[#001A33]">{tour.title}</h3>
                            <span className="text-[10px] font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                              ID: {tour.id}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-[12px] text-gray-500 font-semibold mb-2">
                            <div className="flex items-center gap-1">
                              <MapPin size={14} />
                              <span>
                                {tour.city}, {tour.country}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar size={14} />
                              <span>{new Date(tour.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-3 py-1 bg-[#10B981]/10 text-[#10B981] text-[11px] font-black rounded-full border border-[#10B981]/20">
                              {tour.category}
                            </span>
                            <span className="px-3 py-1 bg-[#001A33] text-white text-[11px] font-black rounded-full">
                              {getDisplayPrice(tour)}
                            </span>
                          </div>
                          <div className="text-[12px] text-gray-500 font-semibold">
                            By: {tour.supplier?.fullName || tour.supplier?.companyName || 'Unknown'}
                          </div>
                        </div>
                        {tour.status === 'pending' ? (
                          <div className="flex items-center gap-2 bg-yellow-50 px-3 py-2 rounded-full">
                            <Clock className="text-yellow-600" size={18} />
                            <span className="text-[12px] font-black text-yellow-700">Pending</span>
                          </div>
                        ) : tour.status === 'draft' ? (
                          <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-full">
                            <Info className="text-blue-600" size={18} />
                            <span className="text-[12px] font-black text-blue-700">Draft</span>
                          </div>
                        ) : tour.status === 'approved' ? (
                          <div className="flex items-center gap-2 bg-[#10B981]/10 px-3 py-2 rounded-full border border-[#10B981]/20">
                            <CheckCircle2 className="text-[#10B981]" size={18} />
                            <span className="text-[12px] font-black text-[#10B981]">Approved</span>
                          </div>
                        ) : tour.status === 'rejected' ? (
                          <div className="flex items-center gap-2 bg-red-50 px-3 py-2 rounded-full">
                            <XCircle className="text-red-600" size={18} />
                            <span className="text-[12px] font-black text-red-700">Rejected</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-full">
                            <Info className="text-gray-600" size={18} />
                            <span className="text-[12px] font-black text-gray-700 capitalize">{tour.status || 'Draft'}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Detail sidebar */}
                <div className="lg:col-span-1">
                  {selectedTour ? (
                    <div className="bg-white rounded-2xl p-6 border border-gray-200 sticky top-24">
                      <h3 className="text-xl font-black text-[#001A33] mb-4">Tour Details</h3>

                      {/* Images */}
                      {selectedTour.images && selectedTour.images.length > 0 && (
                        <div className="mb-6">
                          <div className="text-[11px] font-bold text-gray-500 uppercase mb-3">
                            Images ({selectedTour.images.length})
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            {selectedTour.images.map((image: string, index: number) => (
                              <div key={index} className="relative group">
                                <img
                                  src={image}
                                  alt={`${selectedTour.title} ${index + 1}`}
                                  className="w-full h-32 object-cover rounded-xl border-2 border-gray-200 hover:border-[#10B981] transition-colors cursor-pointer"
                                  onClick={() => window.open(image, '_blank')}
                                />
                                {index === 0 && (
                                  <span className="absolute top-2 left-2 bg-[#10B981] text-white text-[10px] font-black px-2 py-1 rounded">
                                    COVER
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Details */}
                      <div className="space-y-3 mb-6">
                        <div>
                          <div className="text-[11px] font-bold text-gray-500 uppercase mb-1">Tour ID</div>
                          <div className="text-[14px] font-mono font-bold text-[#001A33] bg-gray-100 px-3 py-1.5 rounded-lg inline-block">
                            {selectedTour.id}
                          </div>
                        </div>
                        <div>
                          <div className="text-[11px] font-bold text-gray-500 uppercase mb-1">Title</div>
                          <div className="text-[16px] font-black text-[#001A33]">{selectedTour.title}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <div className="text-[11px] font-bold text-gray-500 uppercase mb-1">City</div>
                            <div className="text-[14px] font-bold text-[#001A33]">{selectedTour.city}</div>
                          </div>
                          <div>
                            <div className="text-[11px] font-bold text-gray-500 uppercase mb-1">Country</div>
                            <div className="text-[14px] font-bold text-[#001A33]">{selectedTour.country}</div>
                          </div>
                        </div>
                        <div>
                          <div className="text-[11px] font-bold text-gray-500 uppercase mb-1">Category</div>
                          <div className="text-[14px] font-bold text-[#001A33]">{selectedTour.category}</div>
                        </div>
                        <div>
                          <div className="text-[11px] font-bold text-gray-500 uppercase mb-1">Price</div>
                          <div className="text-[14px] font-bold text-[#001A33]">
                            Starting from {getDisplayPrice(selectedTour)}
                          </div>
                        </div>
                        <div>
                          <div className="text-[11px] font-bold text-gray-500 uppercase mb-1">Duration</div>
                          <div className="text-[14px] font-bold text-[#001A33]">{formatDurationDisplay(selectedTour.duration)}</div>
                        </div>
                        {selectedTour.locations && selectedTour.locations.length > 0 && (
                          <div>
                            <div className="text-[11px] font-bold text-gray-500 uppercase mb-1">Locations</div>
                            <div className="text-[14px] font-semibold text-[#001A33]">
                              {selectedTour.locations.join(', ')}
                            </div>
                          </div>
                        )}
                        {selectedTour.languages && selectedTour.languages.length > 0 && (
                          <div>
                            <div className="text-[11px] font-bold text-gray-500 uppercase mb-1">Languages</div>
                            <div className="text-[14px] font-semibold text-[#001A33]">
                              {selectedTour.languages.join(', ')}
                            </div>
                          </div>
                        )}
                        {selectedTour.highlights && (
                          <div>
                            <div className="text-[11px] font-bold text-gray-500 uppercase mb-2">Highlights</div>
                            <ul className="space-y-2">
                              {(typeof selectedTour.highlights === 'string'
                                ? JSON.parse(selectedTour.highlights)
                                : selectedTour.highlights
                              ).map((highlight: string, index: number) => (
                                <li key={index} className="flex items-start gap-2">
                                  <span className="text-[#10B981] font-black mt-1">&bull;</span>
                                  <span className="text-[14px] font-semibold text-[#001A33]">{highlight}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {selectedTour.shortDescription && (
                          <div>
                            <div className="text-[11px] font-bold text-gray-500 uppercase mb-1">Description</div>
                            <div className="text-[14px] text-gray-700 font-semibold">{selectedTour.shortDescription}</div>
                          </div>
                        )}
                        {selectedTour.fullDescription && (
                          <div>
                            <div className="text-[11px] font-bold text-gray-500 uppercase mb-1">Full Description</div>
                            <div className="text-[14px] text-gray-700 font-semibold leading-relaxed">
                              {selectedTour.fullDescription}
                            </div>
                          </div>
                        )}
                        <div>
                          <div className="text-[11px] font-bold text-gray-500 uppercase mb-1">Supplier Information</div>
                          <div className="space-y-2">
                            <div className="text-[14px] font-semibold text-[#001A33]">
                              {selectedTour.supplier?.fullName || selectedTour.supplier?.companyName || 'Unknown'}
                            </div>
                            {selectedTour.supplier?.id && (
                              <div className="text-[12px] text-gray-600 font-semibold">
                                <span className="font-bold">Supplier ID:</span>
                                <span className="font-mono ml-2 bg-gray-100 px-2 py-0.5 rounded">{selectedTour.supplier.id}</span>
                              </div>
                            )}
                            <div className="text-[12px] text-gray-600 font-semibold">
                              <span className="font-bold">Email:</span> {selectedTour.supplier?.email || 'Not provided'}
                            </div>
                            {selectedTour.supplier?.phone && (
                              <div className="text-[12px] text-gray-600 font-semibold">
                                <span className="font-bold">Phone:</span> {selectedTour.supplier.phone}
                              </div>
                            )}
                            {selectedTour.supplier?.whatsapp && (
                              <div className="text-[12px] text-gray-600 font-semibold">
                                <span className="font-bold">WhatsApp:</span> {selectedTour.supplier.whatsapp}
                              </div>
                            )}
                            {!selectedTour.supplier?.phone && !selectedTour.supplier?.whatsapp && (
                              <div className="text-[12px] text-yellow-600 font-semibold">No phone/WhatsApp provided</div>
                            )}
                            <div className="text-[12px] text-gray-600 font-semibold">
                              <span className="font-bold">Email Verified:</span>{' '}
                              {selectedTour.supplier?.emailVerified ? 'Yes' : 'No'}
                            </div>
                            {selectedTour.supplier?.verificationDocumentUrl && (
                              <div className="text-[12px] text-gray-600 font-semibold">
                                <span className="font-bold">License:</span>
                                <button
                                  onClick={() => {
                                    setLicenseUrl(selectedTour.supplier.verificationDocumentUrl);
                                    setShowLicenseModal(true);
                                  }}
                                  className="text-[#0071EB] ml-2 hover:underline cursor-pointer"
                                >
                                  View Document
                                </button>
                              </div>
                            )}
                            {!selectedTour.supplier?.verificationDocumentUrl && (
                              <div className="text-[12px] text-yellow-600 font-semibold">No license/document uploaded</div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="space-y-4">
                        <button
                          onClick={() => handleApprove(selectedTour.id)}
                          disabled={isProcessing}
                          className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-black py-5 rounded-full text-[16px] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg"
                        >
                          <CheckCircle2 size={20} />
                          Approve Tour
                        </button>

                        <div className="border-t border-gray-200 pt-4">
                          <label className="block text-[14px] font-bold text-[#001A33] mb-2">
                            Rejection Reason (if rejecting)
                          </label>
                          <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Enter reason for rejection..."
                            className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl p-3 text-[14px] font-semibold text-[#001A33] focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-none mb-3"
                            rows={3}
                          />
                          <button
                            onClick={() => handleReject(selectedTour.id)}
                            disabled={isProcessing || !rejectionReason.trim()}
                            className="w-full bg-red-500 hover:bg-red-600 text-white font-black py-5 rounded-full text-[16px] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg"
                          >
                            <XCircle size={20} />
                            Reject Tour
                          </button>
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                          <button
                            onClick={() => handleDeleteTour(selectedTour.id)}
                            disabled={isProcessing}
                            className="w-full bg-gray-800 hover:bg-gray-900 text-white font-black py-5 rounded-full text-[16px] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg"
                          >
                            <Trash2 size={20} />
                            Delete Tour Permanently
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl p-6 border border-gray-200 text-center">
                      <Eye className="mx-auto text-gray-300 mb-4" size={48} />
                      <p className="text-[14px] text-gray-500 font-semibold">Select a tour to review</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* =============================================================== */}
        {/* PAYMENTS TAB                                                     */}
        {/* =============================================================== */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-black text-[#001A33] mb-2">Supplier Payment Details</h2>
                  <p className="text-[14px] text-gray-500 font-semibold">
                    Manage payment details for all suppliers. Verify payment information before processing payouts.
                  </p>
                </div>
                <div className="flex items-center gap-4 text-[14px]">
                  <div className="px-4 py-2 bg-[#10B981]/10 rounded-lg">
                    <span className="text-gray-600 font-semibold">Verified: </span>
                    <span className="font-black text-[#10B981]">
                      {suppliersWithPayments.filter((s) => s.paymentDetailsVerified).length}
                    </span>
                  </div>
                  <div className="px-4 py-2 bg-yellow-50 rounded-lg">
                    <span className="text-gray-600 font-semibold">Pending: </span>
                    <span className="font-black text-yellow-700">
                      {suppliersWithPayments.filter((s) => !s.paymentDetailsVerified && s.paymentMethod).length}
                    </span>
                  </div>
                  <div className="px-4 py-2 bg-gray-100 rounded-lg">
                    <span className="text-gray-600 font-semibold">No Details: </span>
                    <span className="font-black text-gray-700">
                      {suppliersWithPayments.filter((s) => !s.paymentMethod).length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Search & Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search by name, email, or ID..."
                    value={paymentSearchQuery}
                    onChange={(e) => {
                      setPaymentSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] outline-none text-[14px] font-semibold"
                  />
                </div>
                <select
                  value={paymentFilter}
                  onChange={(e) => {
                    setPaymentFilter(e.target.value as any);
                    setCurrentPage(1);
                  }}
                  className="px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] outline-none text-[14px] font-bold text-[#001A33]"
                >
                  <option value="all">All Suppliers</option>
                  <option value="verified">Verified Only</option>
                  <option value="unverified">Pending Verification</option>
                  <option value="no_details">No Payment Details</option>
                </select>
                <select
                  value={paymentMethodFilter}
                  onChange={(e) => {
                    setPaymentMethodFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] outline-none text-[14px] font-bold text-[#001A33]"
                >
                  <option value="all">All Payment Methods</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="paypal">PayPal</option>
                  <option value="credit_card">Credit/Debit Card</option>
                  <option value="upi">UPI</option>
                  <option value="wise">Wise</option>
                </select>
              </div>
            </div>

            {/* Table */}
            {loadingPayments ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10B981] mx-auto"></div>
                <p className="text-[14px] text-gray-500 font-semibold mt-4">Loading payment details...</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-[12px] font-black text-gray-600 uppercase tracking-wider">Supplier</th>
                        <th className="px-6 py-4 text-left text-[12px] font-black text-gray-600 uppercase tracking-wider">Payment Method</th>
                        <th className="px-6 py-4 text-left text-[12px] font-black text-gray-600 uppercase tracking-wider">Currency</th>
                        <th className="px-6 py-4 text-left text-[12px] font-black text-gray-600 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-left text-[12px] font-black text-gray-600 uppercase tracking-wider">Earnings</th>
                        <th className="px-6 py-4 text-left text-[12px] font-black text-gray-600 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {(() => {
                        let filtered = suppliersWithPayments.filter((supplier) => {
                          if (paymentSearchQuery) {
                            const query = paymentSearchQuery.toLowerCase();
                            const matchesSearch =
                              supplier.fullName?.toLowerCase().includes(query) ||
                              supplier.email?.toLowerCase().includes(query) ||
                              supplier.id?.toString().includes(query) ||
                              supplier.companyName?.toLowerCase().includes(query);
                            if (!matchesSearch) return false;
                          }

                          if (paymentFilter === 'verified' && !supplier.paymentDetailsVerified) return false;
                          if (paymentFilter === 'unverified' && (!supplier.paymentMethod || supplier.paymentDetailsVerified)) return false;
                          if (paymentFilter === 'no_details' && supplier.paymentMethod) return false;

                          if (paymentMethodFilter !== 'all' && supplier.paymentMethod !== paymentMethodFilter) return false;

                          return true;
                        });

                        if (filtered.length === 0) {
                          return (
                            <tr>
                              <td colSpan={6} className="px-6 py-12 text-center">
                                <DollarSign className="mx-auto text-gray-300 mb-4" size={48} />
                                <h3 className="text-lg font-black text-[#001A33] mb-2">No suppliers found</h3>
                                <p className="text-[14px] text-gray-500 font-semibold">
                                  {paymentSearchQuery || paymentFilter !== 'all' || paymentMethodFilter !== 'all'
                                    ? 'Try adjusting your filters'
                                    : 'No suppliers have payment details yet'}
                                </p>
                              </td>
                            </tr>
                          );
                        }

                        const totalPages = Math.ceil(filtered.length / itemsPerPage);
                        const startIndex = (currentPage - 1) * itemsPerPage;
                        const endIndex = startIndex + itemsPerPage;
                        const paginatedSuppliers = filtered.slice(startIndex, endIndex);

                        return (
                          <>
                            {paginatedSuppliers.map((supplier) => {
                              const paymentDetails = supplier.paymentMethodDetails
                                ? typeof supplier.paymentMethodDetails === 'string'
                                  ? JSON.parse(supplier.paymentMethodDetails)
                                  : supplier.paymentMethodDetails
                                : {};

                              const isExpanded = expandedRows.has(supplier.id);

                              return (
                                <Fragment key={supplier.id}>
                                  <tr className={`hover:bg-gray-50 transition-colors ${isExpanded ? 'bg-gray-50' : ''}`}>
                                    <td className="px-6 py-4">
                                      <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-[#10B981]/10 rounded-lg flex items-center justify-center">
                                          {supplier.businessType === 'company' ? (
                                            <Building2 size={18} className="text-[#10B981]" />
                                          ) : (
                                            <User size={18} className="text-[#10B981]" />
                                          )}
                                        </div>
                                        <div>
                                          <div className="text-[14px] font-black text-[#001A33]">
                                            {supplier.fullName}
                                            {supplier.companyName && ` - ${supplier.companyName}`}
                                          </div>
                                          <div className="text-[12px] text-gray-500 font-semibold">{supplier.email}</div>
                                          <div className="text-[10px] font-mono text-gray-400">ID: {supplier.id}</div>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4">
                                      {supplier.paymentMethod ? (
                                        <div className="flex items-center gap-2">
                                          {getPaymentMethodIcon(supplier.paymentMethod)}
                                          <span className="text-[14px] font-bold text-[#001A33]">
                                            {paymentMethodLabels[supplier.paymentMethod] || supplier.paymentMethod}
                                          </span>
                                        </div>
                                      ) : (
                                        <span className="text-[13px] text-gray-400 font-semibold">Not set</span>
                                      )}
                                    </td>
                                    <td className="px-6 py-4">
                                      <span className="text-[14px] font-bold text-[#001A33]">
                                        {supplier.paymentCurrency || 'N/A'}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4">
                                      {supplier.paymentDetailsVerified ? (
                                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#10B981]/10 text-[#10B981] rounded-full text-[12px] font-black">
                                          <CheckCircle2 size={14} />
                                          Verified
                                        </span>
                                      ) : supplier.paymentMethod ? (
                                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-[12px] font-black">
                                          <Clock size={14} />
                                          Pending
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[12px] font-black">
                                          <XCircle size={14} />
                                          Not Set
                                        </span>
                                      )}
                                    </td>
                                    <td className="px-6 py-4">
                                      <div className="space-y-1">
                                        <div className="text-[14px] font-black text-[#001A33]">
                                          Net:{' '}
                                          {supplier.netEarnings !== undefined
                                            ? `${supplier.paymentCurrency || '\u20B9'}${supplier.netEarnings.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
                                            : supplier.totalEarnings
                                              ? `${supplier.paymentCurrency || '\u20B9'}${supplier.totalEarnings.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
                                              : '\u20B90.00'}
                                        </div>
                                        {supplier.grossEarnings !== undefined && supplier.grossEarnings > 0 && (
                                          <div className="text-[11px] text-gray-500 font-semibold">
                                            Gross: {supplier.paymentCurrency || '\u20B9'}
                                            {supplier.grossEarnings.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                          </div>
                                        )}
                                        {supplier.tdsDeducted !== undefined && supplier.tdsDeducted > 0 && (
                                          <div className="text-[11px] text-orange-600 font-semibold">
                                            TDS: {supplier.paymentCurrency || '\u20B9'}
                                            {supplier.tdsDeducted.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                          </div>
                                        )}
                                        {supplier.pendingEarnings > 0 && (
                                          <div className="text-[12px] text-yellow-600 font-semibold mt-1">
                                            Pending: {supplier.paymentCurrency || '\u20B9'}
                                            {supplier.pendingEarnings.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                          </div>
                                        )}
                                      </div>
                                    </td>
                                    <td className="px-6 py-4">
                                      <div className="flex items-center gap-2">
                                        <button
                                          onClick={() => {
                                            const newExpanded = new Set(expandedRows);
                                            if (isExpanded) newExpanded.delete(supplier.id);
                                            else newExpanded.add(supplier.id);
                                            setExpandedRows(newExpanded);
                                          }}
                                          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-[#001A33] rounded-lg text-[12px] font-bold transition-colors flex items-center gap-1"
                                        >
                                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                          {isExpanded ? 'Hide' : 'View'}
                                        </button>
                                        {supplier.paymentMethod && !supplier.paymentDetailsVerified && (
                                          <button
                                            onClick={() => handleVerifyPaymentDetails(supplier.id)}
                                            disabled={isProcessing}
                                            className="px-3 py-1.5 bg-[#10B981] hover:bg-[#059669] text-white rounded-lg text-[12px] font-bold transition-colors flex items-center gap-1 disabled:opacity-50"
                                          >
                                            <ShieldCheck size={14} />
                                            Verify
                                          </button>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                  {isExpanded && (
                                    <tr>
                                      <td colSpan={6} className="px-6 py-4 bg-gray-50">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                          {/* Payment Details */}
                                          <div className="space-y-4">
                                            <h4 className="text-[16px] font-black text-[#001A33] border-b border-gray-200 pb-2">
                                              Payment Details
                                            </h4>
                                            {supplier.paymentMethod === 'bank_transfer' && (
                                              <div className="space-y-2 text-[13px]">
                                                {paymentDetails.bankName && (
                                                  <div className="flex justify-between">
                                                    <span className="font-bold text-gray-600">Bank Name:</span>
                                                    <span className="text-[#001A33]">{paymentDetails.bankName}</span>
                                                  </div>
                                                )}
                                                {paymentDetails.accountNumber && (
                                                  <div className="flex justify-between">
                                                    <span className="font-bold text-gray-600">Account Number:</span>
                                                    <span className="text-[#001A33] font-mono">{paymentDetails.accountNumber}</span>
                                                  </div>
                                                )}
                                                {paymentDetails.ifscCode && (
                                                  <div className="flex justify-between">
                                                    <span className="font-bold text-gray-600">IFSC Code:</span>
                                                    <span className="text-[#001A33] font-mono">{paymentDetails.ifscCode}</span>
                                                  </div>
                                                )}
                                                {paymentDetails.swiftCode && (
                                                  <div className="flex justify-between">
                                                    <span className="font-bold text-gray-600">SWIFT/BIC:</span>
                                                    <span className="text-[#001A33] font-mono">{paymentDetails.swiftCode}</span>
                                                  </div>
                                                )}
                                                {paymentDetails.beneficiaryName && (
                                                  <div className="flex justify-between">
                                                    <span className="font-bold text-gray-600">Beneficiary:</span>
                                                    <span className="text-[#001A33]">{paymentDetails.beneficiaryName}</span>
                                                  </div>
                                                )}
                                              </div>
                                            )}
                                            {supplier.paymentMethod === 'paypal' && paymentDetails.paypalEmail && (
                                              <div className="space-y-2 text-[13px]">
                                                <div className="flex justify-between">
                                                  <span className="font-bold text-gray-600">PayPal Email:</span>
                                                  <span className="text-[#001A33]">{paymentDetails.paypalEmail}</span>
                                                </div>
                                                {paymentDetails.accountType && (
                                                  <div className="flex justify-between">
                                                    <span className="font-bold text-gray-600">Account Type:</span>
                                                    <span className="text-[#001A33]">{paymentDetails.accountType}</span>
                                                  </div>
                                                )}
                                              </div>
                                            )}
                                            {supplier.paymentMethod === 'credit_card' && paymentDetails.cardHolderName && (
                                              <div className="space-y-2 text-[13px]">
                                                <div className="flex justify-between">
                                                  <span className="font-bold text-gray-600">Card Holder:</span>
                                                  <span className="text-[#001A33]">{paymentDetails.cardHolderName}</span>
                                                </div>
                                                {paymentDetails.last4Digits && (
                                                  <div className="flex justify-between">
                                                    <span className="font-bold text-gray-600">Card Number:</span>
                                                    <span className="text-[#001A33] font-mono">****{paymentDetails.last4Digits}</span>
                                                  </div>
                                                )}
                                              </div>
                                            )}
                                            {supplier.paymentMethod === 'upi' && paymentDetails.upiId && (
                                              <div className="space-y-2 text-[13px]">
                                                <div className="flex justify-between">
                                                  <span className="font-bold text-gray-600">UPI ID:</span>
                                                  <span className="text-[#001A33]">{paymentDetails.upiId}</span>
                                                </div>
                                              </div>
                                            )}
                                            {supplier.paymentMethod === 'wise' && paymentDetails.wiseEmail && (
                                              <div className="space-y-2 text-[13px]">
                                                <div className="flex justify-between">
                                                  <span className="font-bold text-gray-600">Wise Email:</span>
                                                  <span className="text-[#001A33]">{paymentDetails.wiseEmail}</span>
                                                </div>
                                                {paymentDetails.accountHolderName && (
                                                  <div className="flex justify-between">
                                                    <span className="font-bold text-gray-600">Account Holder:</span>
                                                    <span className="text-[#001A33]">{paymentDetails.accountHolderName}</span>
                                                  </div>
                                                )}
                                              </div>
                                            )}
                                            {!supplier.paymentMethod && (
                                              <p className="text-[13px] text-gray-500 font-semibold">No payment details added yet.</p>
                                            )}
                                          </div>

                                          {/* Tax Details */}
                                          <div className="space-y-4">
                                            <h4 className="text-[16px] font-black text-[#001A33] border-b border-gray-200 pb-2">
                                              Tax Details
                                            </h4>
                                            {supplier.taxId ? (
                                              <div className="space-y-2 text-[13px]">
                                                {supplier.taxIdType && (
                                                  <div className="flex justify-between">
                                                    <span className="font-bold text-gray-600">Tax ID Type:</span>
                                                    <span className="text-[#001A33]">{supplier.taxIdType}</span>
                                                  </div>
                                                )}
                                                <div className="flex justify-between">
                                                  <span className="font-bold text-gray-600">Tax ID:</span>
                                                  <span className="text-[#001A33] font-mono">{supplier.taxId}</span>
                                                </div>
                                                {supplier.taxCountry && (
                                                  <div className="flex justify-between">
                                                    <span className="font-bold text-gray-600">Country:</span>
                                                    <span className="text-[#001A33]">{supplier.taxCountry}</span>
                                                  </div>
                                                )}
                                                {supplier.taxVerified && (
                                                  <div className="flex justify-between">
                                                    <span className="font-bold text-gray-600">Status:</span>
                                                    <span className="text-[#10B981] font-bold">Verified</span>
                                                  </div>
                                                )}
                                              </div>
                                            ) : (
                                              <p className="text-[13px] text-gray-500 font-semibold">No tax details provided.</p>
                                            )}
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                  )}
                                </Fragment>
                              );
                            })}

                            {/* Pagination */}
                            {filtered.length > itemsPerPage && (
                              <tr>
                                <td colSpan={6} className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                      <span className="text-[13px] font-semibold text-gray-600">
                                        Showing {startIndex + 1} - {Math.min(endIndex, filtered.length)} of {filtered.length}{' '}
                                        suppliers
                                      </span>
                                      <select
                                        value={itemsPerPage}
                                        onChange={(e) => {
                                          setItemsPerPage(Number(e.target.value));
                                          setCurrentPage(1);
                                        }}
                                        className="px-3 py-1.5 border border-gray-300 rounded-lg text-[13px] font-bold text-[#001A33] focus:ring-2 focus:ring-[#10B981] outline-none"
                                      >
                                        <option value={25}>25 per page</option>
                                        <option value={50}>50 per page</option>
                                        <option value={100}>100 per page</option>
                                        <option value={200}>200 per page</option>
                                      </select>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={() => setCurrentPage(1)}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-[13px] font-bold text-[#001A33] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                                      >
                                        First
                                      </button>
                                      <button
                                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-[13px] font-bold text-[#001A33] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                                      >
                                        Previous
                                      </button>
                                      <span className="px-4 py-1.5 text-[13px] font-bold text-[#001A33]">
                                        Page {currentPage} of {totalPages}
                                      </span>
                                      <button
                                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-[13px] font-bold text-[#001A33] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                                      >
                                        Next
                                      </button>
                                      <button
                                        onClick={() => setCurrentPage(totalPages)}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-[13px] font-bold text-[#001A33] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                                      >
                                        Last
                                      </button>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </>
                        );
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =============================================================== */}
        {/* BOOKINGS TAB                                                     */}
        {/* =============================================================== */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-[#001A33]">All Bookings</h2>
                <div className="flex items-center gap-4 text-[14px]">
                  <div className="px-4 py-2 bg-green-50 rounded-lg">
                    <span className="text-gray-600 font-semibold">Paid: </span>
                    <span className="font-black text-[#10B981]">
                      {bookings.filter((b) => b.paymentStatus === 'paid').length}
                    </span>
                  </div>
                  <div className="px-4 py-2 bg-yellow-50 rounded-lg">
                    <span className="text-gray-600 font-semibold">Pending: </span>
                    <span className="font-black text-yellow-700">
                      {bookings.filter((b) => b.paymentStatus === 'pending').length}
                    </span>
                  </div>
                </div>
              </div>

              {loadingBookings ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10B981] mx-auto"></div>
                  <p className="text-[14px] text-gray-500 font-semibold mt-4">Loading bookings...</p>
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="mx-auto text-gray-300 mb-4" size={48} />
                  <h3 className="text-lg font-black text-[#001A33] mb-2">No bookings yet</h3>
                  <p className="text-[14px] text-gray-500 font-semibold">
                    Bookings will appear here once customers start booking tours.
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
                      day: 'numeric',
                    });

                    return (
                      <div
                        key={booking.id}
                        className={`border-2 rounded-xl p-5 transition-all ${
                          booking.paymentStatus === 'paid'
                            ? 'border-[#10B981] bg-[#10B981]/5'
                            : 'border-yellow-200 bg-yellow-50'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-black text-[#001A33]">{booking.tour?.title || 'Tour'}</h3>
                              <span
                                className={`px-3 py-1 rounded-full text-[11px] font-black ${
                                  booking.paymentStatus === 'paid' ? 'bg-[#10B981] text-white' : 'bg-yellow-500 text-white'
                                }`}
                              >
                                {booking.paymentStatus === 'paid' ? 'PAID' : 'PENDING'}
                              </span>
                              <span
                                className={`px-3 py-1 rounded-full text-[11px] font-black ${
                                  booking.status === 'confirmed'
                                    ? 'bg-blue-500/10 text-blue-700 border border-blue-500/20'
                                    : booking.status === 'completed'
                                      ? 'bg-green-500/10 text-green-700 border border-green-500/20'
                                      : 'bg-gray-500/10 text-gray-700 border border-gray-500/20'
                                }`}
                              >
                                {booking.status?.toUpperCase() || 'PENDING'}
                              </span>
                            </div>
                            {booking.bookingReference && (
                              <p className="text-[12px] text-gray-500 font-semibold mb-3">
                                Booking Reference: <span className="font-black text-[#001A33]">{booking.bookingReference}</span>
                              </p>
                            )}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[14px] mb-4">
                              <div>
                                <p className="text-gray-500 font-semibold mb-1">Date</p>
                                <p className="font-black text-[#001A33]">{formattedDate}</p>
                              </div>
                              <div>
                                <p className="text-gray-500 font-semibold mb-1">Guests</p>
                                <p className="font-black text-[#001A33]">
                                  {booking.numberOfGuests} {booking.numberOfGuests === 1 ? 'person' : 'people'}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-500 font-semibold mb-1">Customer</p>
                                <p className="font-black text-[#001A33]">{booking.customerName}</p>
                                <p className="text-[12px] text-gray-500">{booking.customerEmail}</p>
                              </div>
                              <div>
                                <p className="text-gray-500 font-semibold mb-1">Amount</p>
                                <p
                                  className={`font-black text-lg ${
                                    booking.paymentStatus === 'paid' ? 'text-[#10B981]' : 'text-[#001A33]'
                                  }`}
                                >
                                  {booking.currency === 'INR' ? '\u20B9' : '$'}
                                  {booking.totalAmount.toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-[14px]">
                              <div>
                                <p className="text-gray-500 font-semibold mb-1">Supplier/Guide</p>
                                <p className="font-black text-[#001A33]">
                                  {booking.supplier?.fullName || booking.supplier?.companyName || 'Unknown'}
                                </p>
                                <p className="text-[12px] text-gray-500">{booking.supplier?.email}</p>
                              </div>
                              <div>
                                <p className="text-gray-500 font-semibold mb-1">Location</p>
                                <p className="font-black text-[#001A33]">
                                  {booking.tour?.city}, {booking.tour?.country}
                                </p>
                              </div>
                            </div>
                            {booking.razorpayPaymentId && (
                              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                <p className="text-[12px] text-gray-500 font-semibold mb-1">Payment ID:</p>
                                <p className="text-[12px] font-mono text-[#001A33]">{booking.razorpayPaymentId}</p>
                              </div>
                            )}
                            {booking.specialRequests && (
                              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                <p className="text-[12px] text-gray-500 font-semibold mb-1">Special Requests:</p>
                                <p className="text-[14px] text-[#001A33]">{booking.specialRequests}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* License Document Modal */}
      {showLicenseModal && licenseUrl && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[100]"
          onClick={() => setShowLicenseModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-black text-[#001A33]">Guiding License Document</h3>
              <button
                onClick={() => {
                  setShowLicenseModal(false);
                  setLicenseUrl(null);
                }}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            <div className="mt-4">
              {licenseUrl.startsWith('data:image/') ? (
                <img
                  src={licenseUrl}
                  alt="License Document"
                  className="w-full h-auto rounded-lg border-2 border-gray-200"
                  onError={() => {
                    showNotification('Failed to load image. The document may be corrupted or in an unsupported format.', 'error');
                  }}
                />
              ) : licenseUrl.startsWith('data:application/pdf') ? (
                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <p className="text-[14px] text-yellow-800 font-semibold">
                      PDF documents are displayed in a new window. Click the button below to view.
                    </p>
                  </div>
                  <a
                    href={licenseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-[#0071EB] hover:bg-[#0056b3] text-white font-black py-3 px-6 rounded-xl transition-colors"
                  >
                    Open PDF in New Window
                  </a>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <p className="text-[14px] text-gray-700 font-semibold mb-3">Document Preview</p>
                    <img
                      src={licenseUrl}
                      alt="License Document"
                      className="w-full h-auto rounded-lg border-2 border-gray-200"
                      onError={() => {
                        window.open(licenseUrl, '_blank');
                      }}
                    />
                  </div>
                  <a
                    href={licenseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-[#0071EB] hover:bg-[#0056b3] text-white font-black py-3 px-6 rounded-xl transition-colors"
                  >
                    Open in New Window
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
