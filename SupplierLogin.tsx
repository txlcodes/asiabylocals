import React, { useState } from 'react';
import { 
  Mail,
  Lock,
  X,
  Loader2,
  Globe,
  Eye,
  EyeOff
} from 'lucide-react';

interface SupplierLoginProps {
  onClose: () => void;
  onLoginSuccess: () => void;
  onCreateAccount?: () => void;
}

const SupplierLogin: React.FC<SupplierLoginProps> = ({ onClose, onLoginSuccess, onCreateAccount }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showVerificationSuccess, setShowVerificationSuccess] = useState(false);

  // Check if coming from email verification
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const verified = urlParams.get('verified');
    const verifiedEmail = sessionStorage.getItem('verifiedEmail');
    
    if (verified === 'true' || verifiedEmail) {
      setShowVerificationSuccess(true);
      if (verifiedEmail) {
        setEmail(verifiedEmail);
        sessionStorage.removeItem('verifiedEmail');
      }
      // Clear URL params
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      alert('Please enter both email and password');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // Use relative URL for unified deployment, or fallback to env var for separate deployment
      const API_URL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001');
      const loginUrl = `${API_URL}/api/suppliers/login`;
      
      console.log('🔐 Supplier login attempt:');
      console.log('   API URL:', loginUrl);
      console.log('   Email:', email);
      
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      console.log('   Response status:', response.status);
      console.log('   Response OK:', response.ok);

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        setErrorMessage('Server error. Please try again later.');
        setIsSubmitting(false);
        return;
      }

      if (!response.ok) {
        // Handle HTTP error status codes
        setErrorMessage(data.message || data.error || 'Login failed. Please check your credentials.');
        setIsSubmitting(false);
        return;
      }

      if (data.success) {
        // Store supplier info in localStorage or context
        localStorage.setItem('supplier', JSON.stringify(data.supplier));
        onLoginSuccess();
      } else {
        setErrorMessage(data.error || data.message || 'Login failed. Please check your credentials.');
        setIsSubmitting(false);
      }
    } catch (error: any) {
      console.error('❌ Login error:', error);
      console.error('   Error message:', error.message);
      console.error('   Error type:', error.name);
      
      if (error.message?.includes('fetch') || error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
        const apiUrl = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001');
        setErrorMessage(`Cannot connect to server at ${apiUrl}. Please check your connection and try again.`);
      } else {
        setErrorMessage('Failed to login. Please check your connection and try again.');
      }
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Login Header */}
      <header className="bg-[#001A33] text-white py-6 px-8 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.svg?v=4" 
              alt="AsiaByLocals" 
              className="h-10 w-10 object-contain"
            />
            <span className="font-black tracking-tight text-lg">Partner Login</span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-8 bg-[#F8FAFC]">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-10 md:p-14 border border-gray-100">
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-black text-[#001A33] mb-2">Welcome back</h3>
              <p className="text-[14px] text-gray-400 font-semibold">Sign in to your partner account</p>
            </div>

            {showVerificationSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl text-sm font-semibold">
                ✅ Email verified successfully! Please log in to access your supplier dashboard.
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Business Email"
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 font-bold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#0071EB] transition-all outline-none"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type={showPassword ? "text" : "password"}
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
              
              <div className="flex items-center justify-between text-[13px]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-300 text-[#0071EB] focus:ring-[#0071EB]" />
                  <span className="font-semibold text-[#001A33]">Remember me</span>
                </label>
                <button type="button" className="font-semibold text-[#0071EB] hover:underline">
                  Forgot password?
                </button>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#0071EB] hover:bg-[#005bb8] text-white font-black py-5 rounded-full shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 text-[14px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-[13px]">
                <span className="px-4 bg-white text-gray-400 font-semibold">Don't have an account?</span>
              </div>
            </div>

            <button 
              onClick={() => {
                if (onCreateAccount) {
                  onCreateAccount();
                } else {
                  onClose();
                }
              }}
              className="w-full border-2 border-[#001A33] text-[#001A33] font-black py-5 rounded-full hover:bg-[#001A33] hover:text-white transition-all text-[14px]"
            >
              Create New Account
            </button>
          </div>
        </div>
      </main>

      <footer className="py-8 text-center text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 border-t border-gray-100 bg-white">
        © 2025 AsiaByLocals Singapore Pte. Ltd. • Professional Partner Program
      </footer>
    </div>
  );
};

export default SupplierLogin;

