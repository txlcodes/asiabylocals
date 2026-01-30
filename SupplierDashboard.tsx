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
  RefreshCw
} from 'lucide-react';
import TourCreationForm from './TourCreationForm';

interface SupplierDashboardProps {
  supplier: {
    id: string;
    email: string;
    fullName: string;
    status: string;
    emailVerified: boolean;
    phone?: string;
    whatsapp?: string;
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

  // Fetch latest supplier data to check for status updates
  const fetchSupplierStatus = async () => {
    if (!supplier?.id) return;
    
    try {
      const API_URL = (import.meta as any).env?.VITE_API_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001');
      const response = await fetch(`${API_URL}/api/suppliers/${supplier.id}`);
      const data = await response.json();
      // Handle both response formats: { supplier } or { success: true, supplier }
      const supplierData = data.supplier || data;
      if (supplierData && supplierData.id) {
        const updatedSupplier = { 
          ...supplierData, 
          id: String(supplierData.id),
          emailVerified: supplierData.emailVerified !== undefined ? supplierData.emailVerified : currentSupplier?.emailVerified
        };
        // Only update if status actually changed to avoid unnecessary re-renders
        if (updatedSupplier.status !== currentSupplier?.status) {
          // Update localStorage
          localStorage.setItem('supplier', JSON.stringify(updatedSupplier));
          // Update state
          setCurrentSupplier(updatedSupplier);
        }
      }
    } catch (error) {
      console.error('Error fetching supplier status:', error);
    }
  };

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
          phone: profileData.phone,
          whatsapp: profileData.whatsapp
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
      const response = await fetch(`${API_URL}/api/tours/${tourId}/submit`, {
        method: 'POST'
      });
      const data = await response.json();
      if (data.success) {
        fetchTours();
        alert('Tour submitted for review! We\'ll review it within 24-48 hours.');
      } else {
        alert(data.message || 'Failed to submit tour');
      }
    } catch (error) {
      console.error('Error submitting tour:', error);
      alert('Failed to submit tour. Please try again.');
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
          alert('Please add your phone number and WhatsApp number in your profile before creating a tour. This information will be shared with customers when they book your tours.');
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
            <div className="flex items-center flex-1">
              <img src="/logo.svg?v=4" alt="AsiaByLocals" className="h-24 md:h-32 w-auto object-contain" style={{ display: 'block', border: 'none', background: 'transparent' }} />
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
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-[14px] transition-all ${
                  activeTab === tab.id
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
                  className={`mt-4 text-[13px] font-bold flex items-center gap-1 ${
                    currentSupplier?.status === 'approved'
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
                  className={`font-black py-3 px-6 rounded-full text-[14px] flex items-center gap-2 transition-colors ${
                    currentSupplier?.status === 'approved'
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
                  className={`px-4 py-2 rounded-full text-[13px] font-bold transition-all ${
                    filterStatus === 'all'
                      ? 'bg-[#10B981] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All ({stats.total})
                </button>
                <button
                  onClick={() => setFilterStatus('draft')}
                  className={`px-4 py-2 rounded-full text-[13px] font-bold transition-all ${
                    filterStatus === 'draft'
                      ? 'bg-[#10B981] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Draft ({stats.draft})
                </button>
                <button
                  onClick={() => setFilterStatus('pending')}
                  className={`px-4 py-2 rounded-full text-[13px] font-bold transition-all ${
                    filterStatus === 'pending'
                      ? 'bg-[#10B981] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Pending ({stats.pending})
                </button>
                <button
                  onClick={() => setFilterStatus('approved')}
                  className={`px-4 py-2 rounded-full text-[13px] font-bold transition-all ${
                    filterStatus === 'approved'
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
                      className={`font-black py-3 px-6 rounded-full text-[14px] flex items-center gap-2 mx-auto transition-colors ${
                        currentSupplier?.status === 'approved'
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
                              // Check for group pricing tiers first
                              if (tour.groupPricingTiers && Array.isArray(tour.groupPricingTiers) && tour.groupPricingTiers.length > 0) {
                                // Show lowest tier price for group tours
                                const lowestTier = tour.groupPricingTiers[0];
                                return `${tour.currency === 'INR' ? '₹' : '$'}${parseFloat(lowestTier.price || 0).toLocaleString()} (${lowestTier.minPeople}-${lowestTier.maxPeople} people)`;
                              }
                              // Check for legacy group pricing
                              if (tour.groupPrice && tour.maxGroupSize) {
                                return `${tour.currency === 'INR' ? '₹' : '$'}${parseFloat(tour.groupPrice).toLocaleString()} (up to ${tour.maxGroupSize} people)`;
                              }
                              // Fallback to per person pricing
                              return `${tour.currency === 'INR' ? '₹' : '$'}${parseFloat(tour.pricePerPerson || 0).toLocaleString()}/person`;
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
                            <div className="w-full text-center text-[12px] text-[#10B981] font-bold py-2">
                              ✓ Live on Site
                            </div>
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
                              <span className={`px-3 py-1 rounded-full text-[11px] font-black ${
                                booking.status === 'confirmed' ? 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20' :
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
                              {booking.customerPhone && (
                                <>
                                  <span>•</span>
                                  <span>Phone: <a href={`tel:${booking.customerPhone}`} className="text-[#0071EB] hover:underline">{booking.customerPhone}</a></span>
                                </>
                              )}
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
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h2 className="text-2xl font-black text-[#001A33] mb-6">Earnings</h2>
              <div className="text-center py-12">
                <DollarSign className="mx-auto text-gray-300 mb-4" size={48} />
                <h3 className="text-lg font-black text-[#001A33] mb-2">No earnings yet</h3>
                <p className="text-[14px] text-gray-500 font-semibold">
                  Your earnings will be displayed here once you start receiving bookings.
                </p>
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
                <div>
                  <label className="block text-[14px] font-bold text-[#001A33] mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    placeholder="+91 1234567890"
                    className="w-full bg-white border-2 border-gray-200 rounded-2xl py-4 px-4 font-bold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] outline-none"
                  />
                  <p className="text-[12px] text-gray-500 font-semibold mt-2">
                    This phone number will be shared with customers for tour bookings
                  </p>
                </div>
                <div>
                  <label className="block text-[14px] font-bold text-[#001A33] mb-2">WhatsApp Number *</label>
                  <input
                    type="tel"
                    value={profileData.whatsapp}
                    onChange={(e) => setProfileData({ ...profileData, whatsapp: e.target.value })}
                    placeholder="+91 1234567890"
                    className="w-full bg-white border-2 border-gray-200 rounded-2xl py-4 px-4 font-bold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] outline-none"
                  />
                  <p className="text-[12px] text-gray-500 font-semibold mt-2">
                    This WhatsApp number will be shared with customers for easy communication
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
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupplierDashboard;

