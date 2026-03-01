import React, { useState } from 'react';
import { Mail, Lock, User, X, Loader2, Eye, EyeOff } from 'lucide-react';

interface TouristSignupProps {
  onClose: () => void;
  onSignupSuccess: (user: any) => void;
  onSwitchToLogin: () => void;
}

const TouristSignup: React.FC<TouristSignupProps> = ({ onClose, onSignupSuccess, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const API_URL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001');
      const signupUrl = `${API_URL}/api/tourists/signup`;
      
      const response = await fetch(signupUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
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
        setErrorMessage(data.message || data.error || 'Signup failed. Please try again.');
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
        onSignupSuccess(userData);
        onClose();
      } else {
        setErrorMessage(data.error || data.message || 'Signup failed. Please try again.');
        setIsSubmitting(false);
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      if (error.message?.includes('fetch') || error.message?.includes('Failed to fetch')) {
        setErrorMessage('Cannot connect to server. Please check your connection and try again.');
      } else {
        setErrorMessage('Failed to create account. Please try again.');
      }
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-black text-[#001A33]">Create Account</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-xl font-black text-[#001A33] mb-2">Join AsiaByLocals</h3>
            <p className="text-[14px] text-gray-500 font-semibold">Create an account to save tours to your wishlist</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 font-bold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] transition-all outline-none"
              />
            </div>

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
                placeholder="Password (min. 6 characters)"
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

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-12 font-bold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] transition-all outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-[13px]">
              <span className="px-4 bg-white text-gray-400 font-semibold">Already have an account?</span>
            </div>
          </div>

          <button 
            onClick={onSwitchToLogin}
            className="w-full border-2 border-[#001A33] text-[#001A33] font-black py-5 rounded-full hover:bg-[#001A33] hover:text-white transition-all text-[14px]"
          >
            Sign In Instead
          </button>
        </div>
      </div>
    </div>
  );
};

export default TouristSignup;
