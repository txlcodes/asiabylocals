import React, { useState } from 'react';
import { 
  Lock,
  X,
  Loader2,
  Eye,
  EyeOff,
  Shield
} from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
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
      // Use relative URL for unified deployment, or fallback to env var for separate deployment
      const API_URL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001');
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
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
        // Store admin session
        localStorage.setItem('admin', JSON.stringify({ 
          authenticated: true,
          username: data.username,
          loginTime: new Date().toISOString()
        }));
        onLoginSuccess();
      } else {
        setErrorMessage(data.error || data.message || 'Login failed. Please check your credentials.');
        setIsSubmitting(false);
      }
    } catch (error: any) {
      console.error('Login error:', error);
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
          {/* Logo and Header */}
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
            <p className="text-xs text-center text-gray-400 font-semibold">
              🔒 Secure Admin Access
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

