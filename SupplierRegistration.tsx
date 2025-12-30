import React, { useState } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Upload, 
  ShieldCheck, 
  Globe, 
  Building2,
  Lock,
  Mail,
  User,
  CheckCircle2,
  X,
  Loader2
} from 'lucide-react';

interface SupplierRegistrationProps {
  onClose: () => void;
}

const SupplierRegistration: React.FC<SupplierRegistrationProps> = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      nextStep();
    } else {
      setIsSubmitting(true);
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
      }, 1500);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="text-green-500" size={48} />
          </div>
          <h2 className="text-3xl font-black text-[#001A33] mb-4">Application Received</h2>
          <p className="text-gray-500 font-semibold mb-10 leading-relaxed text-[14px]">
            Thank you for joining AsiaByLocals. Our partner success team will review your business details and contact you within 48 hours to activate your account.
          </p>
          <button 
            onClick={onClose}
            className="w-full bg-[#001A33] text-white font-black py-5 rounded-full hover:bg-black transition-all text-[14px]"
          >
            Back to Hub
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Registration Header */}
      <header className="bg-[#001A33] text-white py-6 px-8 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="AsiaByLocals" 
              className="h-8 w-8 object-contain"
            />
            <span className="font-black tracking-tight text-lg">Partner Registration</span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-8 py-4 flex items-center gap-4">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-colors ${step >= s ? 'bg-[#FF5A00] text-white' : 'bg-gray-100 text-gray-400'}`}>
                  {step > s ? <Check size={14} /> : s}
                </div>
                <span className={`text-[11px] font-black uppercase tracking-widest hidden sm:block ${step >= s ? 'text-[#001A33]' : 'text-gray-300'}`}>
                  {s === 1 ? 'Account' : s === 2 ? 'Business' : 'Verification'}
                </span>
              </div>
              {s < 3 && <div className={`flex-1 h-px ${step > s ? 'bg-[#FF5A00]' : 'bg-gray-100'}`} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <main className="flex-1 flex items-center justify-center p-8 bg-[#F8FAFC]">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-10 md:p-14 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-black text-[#001A33] mb-2">Create your account</h3>
                  <p className="text-[14px] text-gray-400 font-semibold">Use your business email for faster verification.</p>
                </div>
                
                <div className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text" required
                      placeholder="Full Name"
                      className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 font-bold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#0071EB] transition-all outline-none"
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="email" required
                      placeholder="Business Email"
                      className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 font-bold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#0071EB] transition-all outline-none"
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="password" required
                      placeholder="Create Password"
                      className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 font-bold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#0071EB] transition-all outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-black text-[#001A33] mb-2">Business details</h3>
                  <p className="text-[14px] text-gray-400 font-semibold">Tell us about where you operate.</p>
                </div>
                
                <div className="space-y-4">
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text" required
                      placeholder="Company Name (or Legal Name)"
                      className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 font-bold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#0071EB] transition-all outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <select className="bg-gray-50 border-none rounded-2xl py-4 px-4 font-bold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#0071EB] outline-none cursor-pointer">
                      <option value="">Main Hub</option>
                      <option>India</option>
                      <option>Japan</option>
                      <option>Thailand</option>
                      <option>Vietnam</option>
                      <option>Indonesia</option>
                    </select>
                    <input 
                      type="text" placeholder="City" required
                      className="bg-gray-50 border-none rounded-2xl py-4 px-4 font-bold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#0071EB] outline-none"
                    />
                  </div>
                  <input 
                    type="text" placeholder="Tour Languages (e.g. English, Hindi)" required
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 font-bold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#0071EB] outline-none"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-[#FF5A00] mb-2">
                  <ShieldCheck size={24} />
                  <h3 className="text-2xl font-black text-[#001A33]">Verification</h3>
                </div>
                <p className="text-[14px] text-gray-400 font-semibold leading-relaxed">
                  To protect our marketplace, we require proof of business registration or a valid tour guide license.
                </p>
                
                <div className="border-2 border-dashed border-gray-100 rounded-2xl p-12 text-center group hover:border-[#0071EB] transition-colors cursor-pointer bg-gray-50/50">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Upload className="text-[#0071EB]" size={24} />
                  </div>
                  <div className="font-black text-[#001A33] text-[14px] mb-1">Upload License / ID</div>
                  <div className="text-[11px] text-gray-400 font-semibold uppercase">PDF, JPG, or PNG (Max 10MB)</div>
                </div>

                <div className="bg-blue-50/50 rounded-2xl p-4 flex gap-3">
                  <div className="bg-blue-500/10 p-2 rounded-lg h-fit text-[#0071EB]">
                    <ShieldCheck size={16} />
                  </div>
                  <p className="text-[13px] font-semibold text-[#001A33] opacity-60 leading-relaxed">
                    All documents are encrypted and only accessible by our internal compliance team for verification purposes.
                  </p>
                </div>
              </div>
            )}

            <div className="pt-6 flex gap-4">
              {step > 1 && (
                <button 
                  type="button"
                  onClick={prevStep}
                  className="px-8 py-5 rounded-full border border-gray-100 font-black text-[#001A33] text-[14px] hover:bg-gray-50 transition-all flex items-center gap-2"
                >
                  <ChevronLeft size={18} />
                </button>
              )}
              <button 
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-[#0071EB] hover:bg-[#005bb8] text-white font-black py-5 rounded-full shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-2 group disabled:opacity-50 text-[14px]"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    {step === 3 ? 'Submit Application' : 'Continue'}
                    {step < 3 && <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>

      <footer className="py-8 text-center text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 border-t border-gray-100 bg-white">
        © 2025 AsiaByLocals Singapore Pte. Ltd. • Professional Partner Program
      </footer>
    </div>
  );
};

export default SupplierRegistration;

