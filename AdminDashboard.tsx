import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Clock, Eye, MapPin, Star, Calendar, Phone, MessageCircle, Mail, Info, User, Building2, X, LogOut } from 'lucide-react';
import AdminLogin from './AdminLogin';

const AdminDashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'tours' | 'suppliers' | 'bookings'>('suppliers');
  const [pendingTours, setPendingTours] = useState<any[]>([]);
  const [pendingSuppliers, setPendingSuppliers] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [selectedTour, setSelectedTour] = useState<any>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showLicenseModal, setShowLicenseModal] = useState(false);
  const [licenseUrl, setLicenseUrl] = useState<string | null>(null);

  // Check authentication on mount
  useEffect(() => {
    const adminData = localStorage.getItem('admin');
    if (adminData) {
      try {
        const admin = JSON.parse(adminData);
        if (admin.authenticated) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error parsing admin data:', error);
        localStorage.removeItem('admin');
      }
    }
  }, []);

  // Admin auth headers for API requests
  const getAuthHeaders = () => {
    return {
      'Content-Type': 'application/json',
      'x-admin-auth': 'authenticated'
    };
  };

  const handleLogout = () => {
    localStorage.removeItem('admin');
    setIsAuthenticated(false);
  };

  const fetchPendingTours = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/admin/tours/pending', {
        headers: getAuthHeaders()
      });
      console.log('Admin Dashboard - Response status:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Admin Dashboard - API Response:', data);
      console.log('Admin Dashboard - Tours array:', data.tours);
      console.log('Admin Dashboard - Tours count:', data.tours?.length);
      if (data.success && Array.isArray(data.tours)) {
        console.log('Admin Dashboard - Setting tours:', data.tours);
        setPendingTours(data.tours);
      } else {
        console.error('Admin Dashboard - Invalid response:', data);
        setPendingTours([]);
      }
    } catch (error) {
      console.error('Error fetching pending tours:', error);
      alert('Failed to load pending tours');
      setPendingTours([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    setLoadingBookings(true);
    try {
      const response = await fetch('http://localhost:3001/api/admin/bookings', {
        headers: getAuthHeaders()
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success && Array.isArray(data.bookings)) {
        setBookings(data.bookings);
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookings([]);
    } finally {
      setLoadingBookings(false);
    }
  };

  const fetchPendingSuppliers = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/admin/suppliers/pending', {
        headers: getAuthHeaders()
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success && Array.isArray(data.suppliers)) {
        setPendingSuppliers(data.suppliers);
      } else {
        setPendingSuppliers([]);
      }
    } catch (error) {
      console.error('Error fetching pending suppliers:', error);
      alert('Failed to load pending suppliers');
      setPendingSuppliers([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when authenticated and tab changes
  useEffect(() => {
    if (isAuthenticated) {
      if (activeTab === 'tours') {
        fetchPendingTours();
      } else if (activeTab === 'suppliers') {
        fetchPendingSuppliers();
      } else if (activeTab === 'bookings') {
        fetchBookings();
      }
    }
  }, [activeTab, isAuthenticated]);

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  const handleApprove = async (tourId: string) => {
    if (!confirm('Are you sure you want to approve this tour? It will go live on the site.')) {
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch(`http://localhost:3001/api/admin/tours/${tourId}/approve`, {
        method: 'POST',
        headers: getAuthHeaders()
      });

      const data = await response.json();
      if (data.success) {
        alert('Tour approved successfully! It is now live on the site.');
        fetchPendingTours(); // Refresh list
        setSelectedTour(null);
      } else {
        alert(data.message || 'Failed to approve tour');
      }
    } catch (error) {
      console.error('Error approving tour:', error);
      alert('Failed to approve tour. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApproveSupplier = async (supplierId: string) => {
    if (!confirm('Are you sure you want to approve this supplier? They will be able to create tours.')) {
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch(`http://localhost:3001/api/admin/suppliers/${supplierId}/approve`, {
        method: 'POST',
        headers: getAuthHeaders()
      });

      const data = await response.json();
      if (data.success) {
        alert('Supplier approved successfully! They can now create tours.');
        fetchPendingSuppliers();
        setSelectedSupplier(null);
      } else {
        alert(data.message || 'Failed to approve supplier');
      }
    } catch (error) {
      console.error('Error approving supplier:', error);
      alert('Failed to approve supplier. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectSupplier = async (supplierId: string) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    if (!confirm('Are you sure you want to reject this supplier?')) {
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch(`http://localhost:3001/api/admin/suppliers/${supplierId}/reject`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ rejectionReason })
      });

      const data = await response.json();
      if (data.success) {
        alert('Supplier rejected successfully.');
        fetchPendingSuppliers();
        setSelectedSupplier(null);
        setRejectionReason('');
      } else {
        alert(data.message || 'Failed to reject supplier');
      }
    } catch (error) {
      console.error('Error rejecting supplier:', error);
      alert('Failed to reject supplier. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (tourId: string) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    if (!confirm('Are you sure you want to reject this tour?')) {
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch(`http://localhost:3001/api/admin/tours/${tourId}/reject`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ rejectionReason })
      });

      const data = await response.json();
      if (data.success) {
        alert('Tour rejected successfully. The guide will be notified.');
        fetchPendingTours(); // Refresh list
        setSelectedTour(null);
        setRejectionReason('');
      } else {
        alert(data.message || 'Failed to reject tour');
      }
    } catch (error) {
      console.error('Error rejecting tour:', error);
      alert('Failed to reject tour. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10B981]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-black text-[#001A33]">Admin Dashboard</h1>
              <p className="text-[14px] text-gray-500 font-semibold mt-1">
                Review & Approve Suppliers & Tours
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-[#10B981] text-white px-4 py-2 rounded-full text-[14px] font-black">
                {activeTab === 'tours' ? pendingTours.length : pendingSuppliers.length} Pending Review
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-lg transition-colors text-sm"
              >
                <LogOut size={18} />
                Logout
              </button>
              <a
                href="/"
                className="text-[#001A33] font-semibold hover:text-[#10B981] text-[14px] transition-colors"
              >
                Back to Home
              </a>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-2 border-b border-gray-200">
            <button
              onClick={() => {
                setActiveTab('suppliers');
                setSelectedTour(null);
                setSelectedSupplier(null);
              }}
              className={`px-6 py-3 font-black text-[14px] border-b-2 transition-colors ${
                activeTab === 'suppliers'
                  ? 'border-[#10B981] text-[#10B981]'
                  : 'border-transparent text-gray-500 hover:text-[#001A33]'
              }`}
            >
              Suppliers ({pendingSuppliers.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('tours');
                setSelectedTour(null);
                setSelectedSupplier(null);
              }}
              className={`px-6 py-3 font-black text-[14px] border-b-2 transition-colors ${
                activeTab === 'tours'
                  ? 'border-[#10B981] text-[#10B981]'
                  : 'border-transparent text-gray-500 hover:text-[#001A33]'
              }`}
            >
              Tours ({pendingTours.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('bookings');
                setSelectedTour(null);
                setSelectedSupplier(null);
              }}
              className={`px-6 py-3 font-black text-[14px] border-b-2 transition-colors ${
                activeTab === 'bookings'
                  ? 'border-[#10B981] text-[#10B981]'
                  : 'border-transparent text-gray-500 hover:text-[#001A33]'
              }`}
            >
              Bookings ({bookings.filter(b => b.paymentStatus === 'paid').length})
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'suppliers' ? (
          // Suppliers Tab
          pendingSuppliers.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
              <CheckCircle2 className="mx-auto text-gray-300 mb-4" size={64} />
              <h2 className="text-2xl font-black text-[#001A33] mb-2">All caught up!</h2>
              <p className="text-[14px] text-gray-500 font-semibold">
                No suppliers pending review at the moment.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Suppliers List */}
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-xl font-black text-[#001A33] mb-4">
                  Pending Suppliers ({pendingSuppliers.length})
                </h2>
                {pendingSuppliers.map((supplier) => (
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
                        <h3 className="text-lg font-black text-[#001A33] mb-2">
                          {supplier.fullName}
                          {supplier.companyName && ` - ${supplier.companyName}`}
                        </h3>
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
                      <div className="flex items-center gap-2 bg-yellow-50 px-3 py-2 rounded-full">
                        <Clock className="text-yellow-600" size={18} />
                        <span className="text-[12px] font-black text-yellow-700">Pending</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Supplier Details & Actions */}
              <div className="lg:col-span-1">
                {selectedSupplier ? (
                  <div className="bg-white rounded-2xl p-6 border border-gray-200 sticky top-24">
                    <h3 className="text-xl font-black text-[#001A33] mb-4">Supplier Details</h3>
                    
                    <div className="space-y-3 mb-6">
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
                          Verified: {selectedSupplier.emailVerified ? '✅ Yes' : '❌ No'}
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
                      <div>
                        <div className="text-[11px] font-bold text-gray-500 uppercase mb-1">Registration Date</div>
                        <div className="text-[14px] font-semibold text-[#001A33]">
                          {new Date(selectedSupplier.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
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
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl p-6 border border-gray-200 text-center">
                    <Eye className="mx-auto text-gray-300 mb-4" size={48} />
                    <p className="text-[14px] text-gray-500 font-semibold">
                      Select a supplier to review
                    </p>
                  </div>
                )}
              </div>
            </div>
          )
        ) : activeTab === 'tours' ? (
          // Tours Tab
          pendingTours.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
            <CheckCircle2 className="mx-auto text-gray-300 mb-4" size={64} />
            <h2 className="text-2xl font-black text-[#001A33] mb-2">All caught up!</h2>
            <p className="text-[14px] text-gray-500 font-semibold">
              No tours pending review at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tours List */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-xl font-black text-[#001A33] mb-4">
                Pending Tours ({pendingTours.length})
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
                      <img
                        src={tour.images[0]}
                        alt={tour.title}
                        className="w-24 h-24 object-cover rounded-xl"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-black text-[#001A33] mb-2">{tour.title}</h3>
                      <div className="flex items-center gap-4 text-[12px] text-gray-500 font-semibold mb-2">
                        <div className="flex items-center gap-1">
                          <MapPin size={14} />
                          <span>{tour.city}, {tour.country}</span>
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
                          {tour.currency} {tour.pricePerPerson}/person
                        </span>
                      </div>
                      <div className="text-[12px] text-gray-500 font-semibold">
                        By: {tour.supplier?.fullName || tour.supplier?.companyName || 'Unknown'}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-yellow-50 px-3 py-2 rounded-full">
                      <Clock className="text-yellow-600" size={18} />
                      <span className="text-[12px] font-black text-yellow-700">Pending</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tour Details & Actions */}
            <div className="lg:col-span-1">
              {selectedTour ? (
                <div className="bg-white rounded-2xl p-6 border border-gray-200 sticky top-24">
                  <h3 className="text-xl font-black text-[#001A33] mb-4">Tour Details</h3>
                  
                  {/* Images Gallery */}
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
                        {selectedTour.currency} {selectedTour.pricePerPerson} per person
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-gray-500 uppercase mb-1">Duration</div>
                      <div className="text-[14px] font-bold text-[#001A33]">{selectedTour.duration}</div>
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
                              <span className="text-[#10B981] font-black mt-1">•</span>
                              <span className="text-[14px] font-semibold text-[#001A33]">{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {selectedTour.shortDescription && (
                      <div>
                        <div className="text-[11px] font-bold text-gray-500 uppercase mb-1">Description</div>
                        <div className="text-[14px] text-gray-700 font-semibold">
                          {selectedTour.shortDescription}
                        </div>
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
                          <div className="text-[12px] text-yellow-600 font-semibold">
                            ⚠️ No phone/WhatsApp provided
                          </div>
                        )}
                        <div className="text-[12px] text-gray-600 font-semibold">
                          <span className="font-bold">Email Verified:</span> {selectedTour.supplier?.emailVerified ? '✅ Yes' : '❌ No'}
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
                          <div className="text-[12px] text-yellow-600 font-semibold">
                            ⚠️ No license/document uploaded
                          </div>
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
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-6 border border-gray-200 text-center">
                  <Eye className="mx-auto text-gray-300 mb-4" size={48} />
                  <p className="text-[14px] text-gray-500 font-semibold">
                    Select a tour to review
                  </p>
                </div>
              )}
            </div>
          </div>
          )
        ) : activeTab === 'bookings' ? (
          // Bookings Tab
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-[#001A33]">All Bookings</h2>
                <div className="flex items-center gap-4 text-[14px]">
                  <div className="px-4 py-2 bg-green-50 rounded-lg">
                    <span className="text-gray-600 font-semibold">Paid: </span>
                    <span className="font-black text-[#10B981]">{bookings.filter(b => b.paymentStatus === 'paid').length}</span>
                  </div>
                  <div className="px-4 py-2 bg-yellow-50 rounded-lg">
                    <span className="text-gray-600 font-semibold">Pending: </span>
                    <span className="font-black text-yellow-700">{bookings.filter(b => b.paymentStatus === 'pending').length}</span>
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
                      day: 'numeric' 
                    });
                    
                    return (
                      <div key={booking.id} className={`border-2 rounded-xl p-5 transition-all ${
                        booking.paymentStatus === 'paid' 
                          ? 'border-[#10B981] bg-[#10B981]/5' 
                          : 'border-yellow-200 bg-yellow-50'
                      }`}>
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-black text-[#001A33]">{booking.tour?.title || 'Tour'}</h3>
                              <span className={`px-3 py-1 rounded-full text-[11px] font-black ${
                                booking.paymentStatus === 'paid' 
                                  ? 'bg-[#10B981] text-white' 
                                  : 'bg-yellow-500 text-white'
                              }`}>
                                {booking.paymentStatus === 'paid' ? '✅ PAID' : '⏳ PENDING'}
                              </span>
                              <span className={`px-3 py-1 rounded-full text-[11px] font-black ${
                                booking.status === 'confirmed' ? 'bg-blue-500/10 text-blue-700 border border-blue-500/20' :
                                booking.status === 'completed' ? 'bg-green-500/10 text-green-700 border border-green-500/20' :
                                'bg-gray-500/10 text-gray-700 border border-gray-500/20'
                              }`}>
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
                                <p className="font-black text-[#001A33]">{booking.numberOfGuests} {booking.numberOfGuests === 1 ? 'person' : 'people'}</p>
                              </div>
                              <div>
                                <p className="text-gray-500 font-semibold mb-1">Customer</p>
                                <p className="font-black text-[#001A33]">{booking.customerName}</p>
                                <p className="text-[12px] text-gray-500">{booking.customerEmail}</p>
                              </div>
                              <div>
                                <p className="text-gray-500 font-semibold mb-1">Amount</p>
                                <p className={`font-black text-lg ${
                                  booking.paymentStatus === 'paid' ? 'text-[#10B981]' : 'text-[#001A33]'
                                }`}>
                                  {booking.currency === 'INR' ? '₹' : '$'}{booking.totalAmount.toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-[14px]">
                              <div>
                                <p className="text-gray-500 font-semibold mb-1">Supplier/Guide</p>
                                <p className="font-black text-[#001A33]">{booking.supplier?.fullName || booking.supplier?.companyName || 'Unknown'}</p>
                                <p className="text-[12px] text-gray-500">{booking.supplier?.email}</p>
                              </div>
                              <div>
                                <p className="text-gray-500 font-semibold mb-1">Location</p>
                                <p className="font-black text-[#001A33]">{booking.tour?.city}, {booking.tour?.country}</p>
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
        ) : null}
      </div>

      {/* License Document Modal */}
      {showLicenseModal && licenseUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[100]" onClick={() => setShowLicenseModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
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
                  onError={(e) => {
                    console.error('Error loading image:', e);
                    alert('Failed to load image. The document may be corrupted or in an unsupported format.');
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
                    <p className="text-[14px] text-gray-700 font-semibold mb-3">
                      Document Preview
                    </p>
                    <img
                      src={licenseUrl}
                      alt="License Document"
                      className="w-full h-auto rounded-lg border-2 border-gray-200"
                      onError={(e) => {
                        console.error('Error loading document:', e);
                        // Try as PDF if image fails
                        const link = document.createElement('a');
                        link.href = licenseUrl;
                        link.target = '_blank';
                        link.click();
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
};

export default AdminDashboard;

