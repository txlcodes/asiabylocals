import React, { useState } from 'react';
import { Mail, Lock, X, Loader2, Eye, EyeOff } from 'lucide-react';

interface TouristLoginProps {
  onClose: () => void;
  onLoginSuccess: (user: any) => void;
  onSwitchToSignup: () => void;
}

const TouristLogin: React.FC<TouristLoginProps> = ({ onClose, onLoginSuccess, onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setErrorMessage('Please enter both email and password');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const API_URL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001');
      const loginUrl = `${API_URL}/api/tourists/login`;
      
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
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
        const userData = {
          id: data.tourist.id,
          name: data.tourist.name,
          email: data.tourist.email,
          type: 'tourist'
        };
        localStorage.setItem('user', JSON.stringify(userData));
        onLoginSuccess(userData);
        onClose();
      } else {
        setErrorMessage(data.error || data.message || 'Login failed. Please check your credentials.');
        setIsSubmitting(false);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.message?.includes('fetch') || error.message?.includes('Failed to fetch')) {
        setErrorMessage('Cannot connect to server. Please check your connection and try again.');
      } else {
        setErrorMessage('Failed to login. Please try again.');
      }
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-black text-[#001A33]">Sign In</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-xl font-black text-[#001A33] mb-2">Welcome back</h3>
            <p className="text-[14px] text-gray-500 font-semibold">Sign in to save tours to your wishlist</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 font-bold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] transition-all outline-none"
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
                className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-12 font-bold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] transition-all outline-none"
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
              className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-black py-5 rounded-full shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-[14px]"
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
            onClick={onSwitchToSignup}
            className="w-full border-2 border-[#001A33] text-[#001A33] font-black py-5 rounded-full hover:bg-[#001A33] hover:text-white transition-all text-[14px]"
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default TouristLogin;
