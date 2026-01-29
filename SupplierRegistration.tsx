import React, { useState, useEffect, useRef } from 'react';
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
  Loader2,
  Users,
  FileText,
  Info,
  Eye,
  EyeOff,
  RefreshCw
} from 'lucide-react';
import { API_URL } from '@/src/config';
import { getTranslation, Language, translations } from './src/translations/supplier';

interface SupplierRegistrationProps {
  language?: Language;
  onClose: () => void;
}

const SupplierRegistration: React.FC<SupplierRegistrationProps> = ({ language = 'en', onClose }) => {
  const t = (key: keyof typeof translations.en) => getTranslation(language, key);
  
  const BUSINESS_TYPES = [
    {
      id: 'company',
      title: t('asRegisteredCompany'),
      description: t('companyDesc'),
      icon: Building2
    },
    {
      id: 'individual',
      title: t('asRegisteredIndividual'),
      description: t('individualDesc'),
      icon: Users
    },
    {
      id: 'other',
      title: t('otherBusinessType'),
      description: t('otherDesc'),
      icon: FileText
    }
  ];
  const [step, setStep] = useState(1);
  const [selectedBusinessType, setSelectedBusinessType] = useState<string>('');
  const [companyEmployees, setCompanyEmployees] = useState<string>('');
  const [companyActivities, setCompanyActivities] = useState<string>('');
  const [individualActivities, setIndividualActivities] = useState<string>('');
  const [otherActivities, setOtherActivities] = useState<string>('');
  
  // Account form fields (GetYourGuide-style)
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [companyBrandName, setCompanyBrandName] = useState<string>('');
  const [website, setWebsite] = useState<string>('');
  const [companyRegisteredCountry, setCompanyRegisteredCountry] = useState<string>('');
  const [preferredCurrency, setPreferredCurrency] = useState<string>('');
  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  
  // Business details form fields
  const [companyName, setCompanyName] = useState<string>('');
  const [mainHub, setMainHub] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [tourLanguages, setTourLanguages] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [whatsapp, setWhatsapp] = useState<string>('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [isCheckingVerification, setIsCheckingVerification] = useState(false);
  const [supplierId, setSupplierId] = useState<string | null>(null);
  const [verificationDocument, setVerificationDocument] = useState<File | null>(null);
  const [documentPreview, setDocumentPreview] = useState<string | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Updated flow: License upload (step 4) BEFORE account creation (step 5)
  const maxSteps = (selectedBusinessType === 'company' || selectedBusinessType === 'individual' || selectedBusinessType === 'other') ? 6 : 5;
  const nextStep = () => setStep(prev => Math.min(prev + 1, maxSteps));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      // Business type selection - require selection before proceeding
      if (selectedBusinessType) {
        nextStep();
      }
    } else if (step === 2 && selectedBusinessType === 'company') {
      // Company details step - require employees and activities only
      if (companyEmployees && companyActivities) {
        nextStep();
      }
    } else if (step === 2 && selectedBusinessType === 'individual') {
      // Individual details step - require activities only
      if (individualActivities) {
        nextStep();
      }
    } else if (step === 2 && selectedBusinessType === 'other') {
      // Other business type details step - require activities only
      if (otherActivities) {
        nextStep();
      }
    } else if (step === ((selectedBusinessType === 'company' || selectedBusinessType === 'individual' || selectedBusinessType === 'other') ? 3 : 2)) {
      // Business details step - validate required fields
      // Company name is only required for companies, optional for individuals
      const isCompanyNameRequired = selectedBusinessType === 'company';
      if ((!isCompanyNameRequired || companyName) && mainHub && city && tourLanguages && phone && whatsapp) {
        nextStep();
      }
    } else if (step === ((selectedBusinessType === 'company' || selectedBusinessType === 'individual' || selectedBusinessType === 'other') ? 4 : 3)) {
      // License upload step - validate document is uploaded before proceeding
      if (verificationDocument) {
        nextStep();
      } else {
        alert('Please upload your license/verification document to continue.');
      }
    } else if (step === ((selectedBusinessType === 'company' || selectedBusinessType === 'individual' || selectedBusinessType === 'other') ? 5 : 4)) {
      // Account creation step - submit registration with license document and wait for email verification
      const fullName = `${firstName} ${lastName}`.trim();
      // Password validation - allow common special characters
      const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
      const isValidPassword = password.length >= 8 && 
        password.length <= 30 &&
        /[A-Z]/.test(password) && 
        /[a-z]/.test(password) && 
        /[0-9]/.test(password) && 
        hasSpecialChar &&
        !password.includes(' ') &&
        !email.toLowerCase().split('@')[0].split('.').some(part => part.length > 2 && password.toLowerCase().includes(part));
      
      if (firstName && lastName && email && isValidPassword && acceptedTerms) {
        // Submit registration at this step
        setIsSubmitting(true);
        submitRegistration();
      }
    } else if (step < maxSteps) {
      nextStep();
    } else {
      // Final step - submit license document only (registration already done)
      setIsSubmitting(true);
      
      // Upload license document and update supplier
      if (verificationDocument && supplierId) {
        console.log('📄 Uploading document:', verificationDocument.name, 'Size:', verificationDocument.size);
        
        const reader = new FileReader();
        reader.onloadend = async () => {
          try {
            const documentUrl = reader.result as string;
            
            // Check if base64 data is too large (warn if > 5MB)
            if (documentUrl.length > 5 * 1024 * 1024) {
              console.warn('⚠️ Document is large:', documentUrl.length, 'bytes');
            }
            
            console.log('📤 Sending document to server...');
            
            // Update supplier with license document
            const response = await fetch(`${API_URL}/api/suppliers/${supplierId}/update-document`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ verificationDocumentUrl: documentUrl }),
            });
            
            const data = await response.json();
            console.log('📥 Server response:', data);
            
            setIsSubmitting(false);
            
            if (data.success) {
              console.log('✅ Document uploaded successfully!');
              setIsSuccess(true);
            } else {
              console.error('❌ Upload failed:', data);
              alert(data.error || data.message || 'Failed to upload document. Please try again.');
            }
          } catch (error) {
            console.error('❌ Document upload error:', error);
            setIsSubmitting(false);
            alert('Failed to upload document. Please check your connection and try again.');
          }
        };
        
        reader.onerror = () => {
          console.error('❌ FileReader error');
          setIsSubmitting(false);
          alert('Failed to read document. Please try again.');
        };
        
        reader.readAsDataURL(verificationDocument);
      } else {
        // No document, just mark as complete
        console.log('⚠️ No document provided, marking as complete');
        setIsSubmitting(false);
        setIsSuccess(true);
      }
    }
  };

  // Function to submit registration (called from step 5 - account creation)
  const submitRegistration = async () => {
    // Validate all required fields before submission
    const fullName = `${firstName} ${lastName}`.trim();
    
    if (!selectedBusinessType) {
      alert('Please select a business type.');
      setIsSubmitting(false);
      return;
    }
    
    if (!fullName || !firstName || !lastName) {
      alert('Please enter your full name.');
      setIsSubmitting(false);
      return;
    }
    
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address.');
      setIsSubmitting(false);
      return;
    }
    
    if (!password || password.length < 8) {
      alert('Please enter a valid password (at least 8 characters).');
      setIsSubmitting(false);
      return;
    }
    
    if (!acceptedTerms) {
      alert('Please accept the Terms and Conditions to continue.');
      setIsSubmitting(false);
      return;
    }
    
    // Validate license document is uploaded
    if (!verificationDocument) {
      alert('Please upload your license/verification document before creating your account.');
      setIsSubmitting(false);
      return;
    }
    
    // Convert license document to base64
    let documentBase64 = null;
    try {
      documentBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(verificationDocument);
      });
    } catch (error) {
      console.error('Error reading document:', error);
      alert('Failed to read license document. Please try again.');
      setIsSubmitting(false);
      return;
    }
    
    const registrationData = {
      businessType: selectedBusinessType,
      companyEmployees: selectedBusinessType === 'company' ? companyEmployees : null,
      companyActivities: selectedBusinessType === 'company' ? companyActivities : null,
      individualActivities: selectedBusinessType === 'individual' ? individualActivities : null,
      otherActivities: selectedBusinessType === 'other' ? otherActivities : null,
      fullName: fullName,
      email: email.trim().toLowerCase(),
      password,
      companyName: companyName || null,
      mainHub: mainHub || null,
      city: city || null,
      tourLanguages: tourLanguages || null,
      phone: phone || null,
      whatsapp: whatsapp || null,
      verificationDocumentUrl: documentBase64, // Include license document in registration
      language: language // Include language preference for email
    };

    // Log registration data (without password)
    console.log('📤 Submitting registration:');
    console.log('   API URL:', `${API_URL}/api/suppliers/register`);
    console.log('   Email:', email);
    console.log('   Full Name:', `${firstName} ${lastName}`.trim());
    console.log('   Business Type:', selectedBusinessType);
    console.log('   Registration Data:', { ...registrationData, password: '***HIDDEN***' });

    // Call API with timeout and retry logic
    const makeRequest = async (retryCount = 0): Promise<Response> => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      try {
        const response = await fetch(`${API_URL}/api/suppliers/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(registrationData),
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        return response;
      } catch (error) {
        clearTimeout(timeoutId);
        if (error instanceof Error && error.name === 'AbortError') {
          throw new Error('Request timeout. Please check your internet connection and try again.');
        }
        // Retry on network errors (up to 2 retries)
        if (retryCount < 2 && (error instanceof TypeError || error.message?.includes('fetch'))) {
          console.log(`   ⚠️ Network error, retrying... (${retryCount + 1}/2)`);
          await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1))); // Exponential backoff
          return makeRequest(retryCount + 1);
        }
        throw error;
      }
    };

    makeRequest()
    .then(async response => {
      console.log('📥 Registration API response:', response.status, response.statusText);
      
      // Get response text first to see what we're dealing with
      const responseText = await response.text();
      console.log('   Response body:', responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('   Failed to parse JSON response:', e);
        throw new Error('Invalid server response. Please try again.');
      }
      
      // Handle both 200 (existing account) and 201 (new account) as success
      if (response.status === 200 || response.status === 201) {
        return data;
      } else {
        console.error('   Registration failed:', data);
        throw new Error(data.error || data.message || 'Registration failed');
      }
    })
    .then(data => {
      setIsSubmitting(false);
      if (data.success) {
        console.log('✅ Registration successful:', data);
        console.log('   Email verified:', data.supplier.emailVerified);
        console.log('   Supplier ID:', data.supplier.id);
        
        setSupplierId(data.supplier.id);
        // Store supplier ID and email in localStorage for verification redirect
        localStorage.setItem('pendingSupplierId', data.supplier.id);
        localStorage.setItem('pendingSupplierEmail', email);
        
        // ALWAYS redirect to email verification waiting page
        // Even if account exists and is verified, we should still verify email matches
        // Only skip if this is an existing account AND email is verified AND we're coming from email verification
        const isExistingAccount = data.existingAccount === true;
        const isEmailVerified = data.supplier.emailVerified === true;
        const isFromVerification = new URLSearchParams(window.location.search).get('verified') === 'true';
        
        console.log('   Registration response details:');
        console.log('   - Existing account:', isExistingAccount);
        console.log('   - Email verified:', isEmailVerified);
        console.log('   - From verification:', isFromVerification);
        console.log('   - Email entered:', email);
        console.log('   - Email in response:', data.supplier.email);
        
        // Only skip verification if:
        // 1. Account exists AND
        // 2. Email is verified AND  
        // 3. We're coming from email verification page (user just verified)
        if (isExistingAccount && isEmailVerified && isFromVerification) {
          console.log('   ✅ Email already verified and coming from verification, going directly to step 5');
          setEmailVerified(true);
          setIsCheckingVerification(false);
          // Email already verified, registration complete
          setIsSuccess(true);
        } else {
          // Always redirect to verification waiting page
          console.log('   📧 Redirecting to email verification waiting page...');
          console.log('   Reason: Email not verified or not coming from verification');
          console.log('   Redirect URL:', `/email-verification-waiting?email=${encodeURIComponent(email)}&supplierId=${data.supplier.id}`);
          // IMPORTANT: Use window.location.replace to ensure redirect happens
          window.location.replace(`/email-verification-waiting?email=${encodeURIComponent(email)}&supplierId=${data.supplier.id}`);
        }
      } else {
        alert(data.error || data.message || 'Registration failed. Please try again.');
      }
    })
    .catch(error => {
      console.error('❌ Registration error:', error);
      console.error('   Error message:', error.message);
      console.error('   Error stack:', error.stack);
      setIsSubmitting(false);
      
      // Better error message based on error type
      let errorMessage = 'Failed to submit registration. ';
      
      // Handle Prisma errors
      if (error.message?.includes('PrismaClientKnownRequestError') || error.message?.includes('P2002')) {
        if (error.message?.includes('email') || error.message?.includes('Email')) {
          errorMessage = 'An account with this email already exists. Please use a different email or log in.';
        } else {
          errorMessage = 'Registration failed due to a database error. Please try again.';
        }
      }
      // Network errors
      else if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError') || error.message?.includes('Network request failed')) {
        errorMessage += 'Cannot connect to server. Please check your internet connection and try again.';
      }
      // Server errors
      else if (error.message?.includes('Registration failed') || error.message?.includes('Internal server error')) {
        errorMessage += 'Server error occurred. Please try again in a few moments.';
      }
      // Other errors
      else {
        // Extract user-friendly message from error
        const cleanMessage = error.message
          .replace('PrismaClientKnownRequestError: ', '')
          .replace('Error: ', '');
        errorMessage += cleanMessage || 'Please check your connection and try again.';
      }
      
      console.error('   Showing error to user:', errorMessage);
      alert(errorMessage);
    });
  };

    // Poll for email verification status
  const startVerificationPolling = (supplierId: string) => {
    const checkVerification = async () => {
      try {
        const response = await fetch(`${API_URL}/api/suppliers/${supplierId}/verification-status`);
        const data = await response.json();
        
        if (data.success && data.emailVerified) {
          setEmailVerified(true);
          setIsCheckingVerification(false);
          // Clear polling
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }
          // Email verified, registration complete
          setIsSuccess(true);
        }
      } catch (error) {
        console.error('Verification check error:', error);
      }
    };

    // Check immediately
    checkVerification();
    
    // Then check every 3 seconds
    pollingIntervalRef.current = setInterval(() => {
      checkVerification();
    }, 3000);
  };

  // Check if returning from email verification - THIS MUST RUN FIRST
  useEffect(() => {
    // Check URL parameters first (from redirect)
    const urlParams = new URLSearchParams(window.location.search);
    const urlVerified = urlParams.get('verified');
    const urlSupplierId = urlParams.get('supplierId');
    
    // PRIORITY: If coming from email verification redirect, proceed immediately
    if (urlVerified === 'true' && urlSupplierId) {
      console.log('✅ Email verified via URL, proceeding directly to PDF upload');
      console.log('   Supplier ID:', urlSupplierId);
      
      // Immediately set state - don't wait for server check
      setSupplierId(String(urlSupplierId));
      setEmailVerified(true);
      setIsCheckingVerification(false);
      
      // Clear polling if running
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      
      // Store in localStorage for persistence
      localStorage.setItem('pendingSupplierId', String(urlSupplierId));
      localStorage.setItem('emailVerified', 'true');
      
      // Email verified, registration should be complete
      setIsSuccess(true);
      
      // Clean up URL immediately
      window.history.replaceState({}, '', window.location.pathname);
      
      // Optional: Verify with server in background (non-blocking)
      fetch(`${API_URL}/api/suppliers/${urlSupplierId}/verification-status`)
        .then(res => res.json())
        .then(data => {
          console.log('   Server verification check:', data);
          if (!data.success || !data.emailVerified) {
            console.warn('⚠️ Server says not verified, but trusting URL param');
          }
        })
        .catch(error => {
          console.error('Error checking verification status (non-blocking):', error);
        });
      
      return; // Exit early, don't check anything else
    }
    
    // Check localStorage for verified email (fallback)
    const emailVerifiedFlag = localStorage.getItem('emailVerified');
    const verifiedSupplierId = localStorage.getItem('verifiedSupplierId');
    const pendingSupplierId = localStorage.getItem('pendingSupplierId');
    
    // If verified via localStorage (but not URL)
    if (emailVerifiedFlag === 'true' && verifiedSupplierId && !urlVerified) {
      const finalSupplierId = verifiedSupplierId || pendingSupplierId;
      
      if (finalSupplierId) {
        // Verify with server
        fetch(`${API_URL}/api/suppliers/${finalSupplierId}/verification-status`)
          .then(res => {
            if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
          })
          .then(data => {
            if (data.success && data.emailVerified) {
              setSupplierId(String(finalSupplierId));
              setEmailVerified(true);
              setIsCheckingVerification(false);
              if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
                pollingIntervalRef.current = null;
              }
              const targetStep = (selectedBusinessType === 'company' || selectedBusinessType === 'individual' || selectedBusinessType === 'other') ? 5 : 4;
              setStep(targetStep);
              localStorage.removeItem('emailVerified');
              localStorage.removeItem('verifiedSupplierId');
            }
          })
          .catch(error => {
            console.error('Error verifying supplier ID:', error);
          });
      }
    }
    
    // Also check if we have a pending registration on mount (for polling)
    // BUT ONLY if we're NOT coming from a verification redirect
    if (pendingSupplierId && !emailVerified && !urlVerified && urlVerified !== 'true') {
      const pendingEmail = localStorage.getItem('pendingSupplierEmail');
      if (!supplierId) {
        setSupplierId(pendingSupplierId);
      }
      if (email && email === pendingEmail && !isCheckingVerification) {
        // Check verification status
        setIsCheckingVerification(true);
        startVerificationPolling(pendingSupplierId);
      }
    }
  }, [email, selectedBusinessType, supplierId, emailVerified, isCheckingVerification]);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full">
          <div className="w-24 h-24 bg-[#10B981]/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="text-[#10B981]" size={48} />
          </div>
          <h2 className="text-3xl font-black text-[#001A33] mb-6">Registration Successful!</h2>
          <p className="text-gray-600 font-semibold mb-4 leading-relaxed text-[14px]">
            Thank you for joining AsiaByLocals! We've sent a verification email to your registered email address.
          </p>
          <p className="text-gray-600 font-semibold mb-10 leading-relaxed text-[14px]">
            Please check your inbox and click the verification link to activate your account. Our partner success team will review your business details and contact you within 48 hours.
          </p>
          <button 
            onClick={onClose}
            className="w-full bg-[#001A33] hover:bg-black text-white font-black py-5 rounded-full transition-all text-[14px]"
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
              src="/logo.svg?v=4" 
              alt="AsiaByLocals" 
              className="h-10 w-10 object-contain"
            />
            <span className="font-black tracking-tight text-lg">{t('createSupplierAccount')}</span>
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
          {((selectedBusinessType === 'company' || selectedBusinessType === 'individual' || selectedBusinessType === 'other') ? [1, 2, 3, 4, 5] : [1, 2, 3, 4]).map((s) => {
            const totalSteps = (selectedBusinessType === 'company' || selectedBusinessType === 'individual' || selectedBusinessType === 'other') ? 5 : 4;
            const getStepLabel = (stepNum: number) => {
              if (selectedBusinessType === 'company') {
                return stepNum === 1 ? 'Business Type' : stepNum === 2 ? 'Company Details' : stepNum === 3 ? 'Business' : stepNum === 4 ? 'Account' : 'Verification';
              } else if (selectedBusinessType === 'individual') {
                return stepNum === 1 ? 'Business Type' : stepNum === 2 ? 'Individual Details' : stepNum === 3 ? 'Business' : stepNum === 4 ? 'Account' : 'Verification';
              } else if (selectedBusinessType === 'other') {
                return stepNum === 1 ? 'Business Type' : stepNum === 2 ? 'Business Details' : stepNum === 3 ? 'Business' : stepNum === 4 ? 'Account' : 'Verification';
              } else {
                return stepNum === 1 ? 'Business Type' : stepNum === 2 ? 'Business' : stepNum === 3 ? 'Account' : 'Verification';
              }
            };
            return (
              <React.Fragment key={s}>
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-colors ${step >= s ? 'bg-[#10B981] text-white' : 'bg-gray-100 text-gray-400'}`}>
                    {step > s ? <Check size={14} /> : s}
                  </div>
                  <span className={`text-[11px] font-black uppercase tracking-widest hidden sm:block ${step >= s ? 'text-[#001A33]' : 'text-gray-300'}`}>
                    {getStepLabel(s)}
                  </span>
                </div>
                {s < totalSteps && <div className={`flex-1 h-px ${step > s ? 'bg-[#10B981]' : 'bg-gray-100'}`} />}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <main className="flex-1 flex items-center justify-center p-8 bg-[#F8FAFC]">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-10 md:p-14 border border-gray-100">
          {/* Step Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-[#001A33]">Join us as a supply partner</h2>
            <span className="text-sm font-bold text-gray-500">Step {step} of {maxSteps}</span>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-black text-[#001A33] mb-2 flex items-center gap-2">
                    How do you run your business?
                    <div className="relative group">
                      <Info size={18} className="text-gray-400 cursor-help" />
                    </div>
                  </h3>
                </div>
                
                <div className="grid gap-4">
                  {BUSINESS_TYPES.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setSelectedBusinessType(type.id)}
                        className={`p-6 rounded-2xl border-2 text-left transition-all ${
                          selectedBusinessType === type.id
                            ? 'border-[#10B981] bg-[#10B981]/5'
                            : 'border-gray-100 hover:border-gray-200 bg-white'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-xl ${
                            selectedBusinessType === type.id
                              ? 'bg-[#10B981] text-white'
                              : 'bg-gray-100 text-gray-400'
                          }`}>
                            <Icon size={24} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-black text-[#001A33] mb-2 text-[16px]">{type.title}</h4>
                            <p className="text-[13px] text-gray-500 font-medium leading-relaxed">{type.description}</p>
                          </div>
                          {selectedBusinessType === type.id && (
                            <div className="w-6 h-6 rounded-full bg-[#10B981] flex items-center justify-center">
                              <Check size={14} className="text-white" />
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 2 && selectedBusinessType === 'company' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-black text-[#001A33] mb-2">{t('companyDetails')}</h3>
                  <p className="text-[14px] text-gray-400 font-semibold">{language === 'ja' ? '会社について詳しく教えてください。' : 'Tell us more about your company.'}</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-[14px] font-black text-[#001A33] mb-3">{t('howManyEmployees')}</label>
                    <div className="grid grid-cols-5 gap-2">
                      {['Up to 2', '3 - 10', '11 - 20', '21 - 50', '+50'].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setCompanyEmployees(option)}
                          className={`py-3 px-2 rounded-xl text-[12px] font-bold transition-all ${
                            companyEmployees === option
                              ? 'bg-[#10B981] text-white'
                              : 'bg-gray-50 text-[#001A33] hover:bg-gray-100 border border-gray-100'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[14px] font-black text-[#001A33] mb-3">How many activities of any type do you offer?</label>
                    <div className="grid grid-cols-5 gap-2">
                      {['Up to 2', '3 - 6', '7 - 15', '16 - 35', '+35'].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setCompanyActivities(option)}
                          className={`py-3 px-2 rounded-xl text-[12px] font-bold transition-all ${
                            companyActivities === option
                              ? 'bg-[#10B981] text-white'
                              : 'bg-gray-50 text-[#001A33] hover:bg-gray-100 border border-gray-100'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && selectedBusinessType === 'individual' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-black text-[#001A33] mb-2">Individual Information</h3>
                  <p className="text-[14px] text-gray-400 font-semibold">Tell us more about your business.</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-[14px] font-black text-[#001A33] mb-3">How many activities of any type do you offer?</label>
                    <div className="grid grid-cols-5 gap-2">
                      {['Up to 2', '3 - 6', '7 - 15', '16 - 35', '+35'].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setIndividualActivities(option)}
                          className={`py-3 px-2 rounded-xl text-[12px] font-bold transition-all ${
                            individualActivities === option
                              ? 'bg-[#10B981] text-white'
                              : 'bg-gray-50 text-[#001A33] hover:bg-gray-100 border border-gray-100'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && selectedBusinessType === 'other' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-black text-[#001A33] mb-2">{t('individualDetails')}</h3>
                  <p className="text-[14px] text-gray-400 font-semibold">{language === 'ja' ? 'あなたのビジネスについて詳しく教えてください。' : 'Tell us more about your business.'}</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-[14px] font-black text-[#001A33] mb-3">{t('howManyActivitiesIndividual')}</label>
                    <div className="grid grid-cols-5 gap-2">
                      {['Up to 2', '3 - 6', '7 - 15', '16 - 35', '+35'].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setOtherActivities(option)}
                          className={`py-3 px-2 rounded-xl text-[12px] font-bold transition-all ${
                            otherActivities === option
                              ? 'bg-[#10B981] text-white'
                              : 'bg-gray-50 text-[#001A33] hover:bg-gray-100 border border-gray-100'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === ((selectedBusinessType === 'company' || selectedBusinessType === 'individual' || selectedBusinessType === 'other') ? 3 : 2) && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-black text-[#001A33] mb-2">{t('businessInformation')}</h3>
                  <p className="text-[14px] text-gray-400 font-semibold">{language === 'ja' ? '営業場所について教えてください。' : 'Tell us about where you operate.'}</p>
                </div>
                
                <div className="space-y-4">
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      required={selectedBusinessType === 'company'}
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder={selectedBusinessType === 'individual' ? (language === 'ja' ? 'ビジネス名（任意）' : 'Business Name (Optional)') : t('companyNamePlaceholder')}
                      className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 font-bold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] transition-all outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <select 
                      value={mainHub}
                      onChange={(e) => {
                        setMainHub(e.target.value);
                        setCity(''); // Reset city when country changes
                      }}
                      required
                      className="bg-gray-50 border-none rounded-2xl py-4 px-4 font-bold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] outline-none cursor-pointer"
                    >
                      <option value="">{language === 'ja' ? '国を選択' : 'Select Country'}</option>
                      <option value="India">India</option>
                      <option value="Japan">Japan</option>
                      <option value="Thailand">Thailand</option>
                      <option value="Vietnam">Vietnam</option>
                      <option value="Indonesia">Indonesia</option>
                      <option value="Singapore">Singapore</option>
                      <option value="Malaysia">Malaysia</option>
                      <option value="South Korea">South Korea</option>
                      <option value="Philippines">Philippines</option>
                      <option value="China">China</option>
                      <option value="Taiwan">Taiwan</option>
                      <option value="Hong Kong">Hong Kong</option>
                    </select>
                    {mainHub === 'India' ? (
                      <select 
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                        className="bg-gray-50 border-none rounded-2xl py-4 px-4 font-bold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] outline-none cursor-pointer"
                      >
                        <option value="">{t('city')}</option>
                        <option value="Agra">Agra</option>
                        <option value="Jaipur">Jaipur</option>
                        <option value="Udaipur">Udaipur</option>
                        <option value="Varanasi">Varanasi</option>
                        <option value="Goa">Goa</option>
                        <option value="Kochi">Kochi</option>
                        <option value="Darjeeling">Darjeeling</option>
                        <option value="Rishikesh">Rishikesh</option>
                        <option value="Mysore">Mysore</option>
                        <option value="Amritsar">Amritsar</option>
                      </select>
                    ) : mainHub === 'Japan' ? (
                      <select 
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                        className="bg-gray-50 border-none rounded-2xl py-4 px-4 font-bold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] outline-none cursor-pointer"
                      >
                        <option value="">{t('city')}</option>
                        <option value="Tokyo">Tokyo</option>
                        <option value="Kyoto">Kyoto</option>
                        <option value="Osaka">Osaka</option>
                        <option value="Hiroshima">Hiroshima</option>
                        <option value="Nara">Nara</option>
                        <option value="Sapporo">Sapporo</option>
                        <option value="Yokohama">Yokohama</option>
                        <option value="Fukuoka">Fukuoka</option>
                        <option value="Nagoya">Nagoya</option>
                        <option value="Okinawa">Okinawa</option>
                      </select>
                    ) : (
                      <input 
                        type="text" 
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder={t('cityPlaceholder')}
                        className="bg-gray-50 border-none rounded-2xl py-4 px-4 font-bold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] outline-none"
                      />
                    )}
                  </div>
                  <input 
                    type="text" 
                    required
                    value={tourLanguages}
                    onChange={(e) => setTourLanguages(e.target.value)}
                    placeholder="Tour Languages (e.g. English, Hindi)"
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 font-bold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] outline-none"
                  />
                  
                  {/* Contact Information */}
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="text-[16px] font-black text-[#001A33] mb-4">Contact Information</h4>
                    <p className="text-[12px] text-gray-500 font-semibold mb-4">
                      This information will be shared with customers when they book your tours. Make sure your WhatsApp number is linked to your WhatsApp account.
                    </p>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[14px] font-black text-[#001A33] mb-2">
                          Phone Number *
                        </label>
                        <input 
                          type="tel" 
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 9876543210"
                          className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 font-bold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] outline-none"
                        />
                        <p className="text-[11px] text-gray-400 mt-1">
                          This phone number will be shared with customers for bookings.
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-[14px] font-black text-[#001A33] mb-2">
                          WhatsApp Number * <span className="text-[12px] font-normal text-gray-500">(Must be linked to WhatsApp)</span>
                        </label>
                        <input 
                          type="tel" 
                          required
                          value={whatsapp}
                          onChange={(e) => setWhatsapp(e.target.value)}
                          placeholder="+91 9876543210"
                          className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 font-bold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] outline-none"
                        />
                        <p className="text-[11px] text-gray-400 mt-1">
                          Make sure this number is linked to your WhatsApp account. Customers will contact you via WhatsApp.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* License Upload Step - Step 4 (BEFORE account creation) */}
            {step === ((selectedBusinessType === 'company' || selectedBusinessType === 'individual' || selectedBusinessType === 'other') ? 4 : 3) && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-[#10B981] mb-2">
                  <ShieldCheck size={24} />
                  <h3 className="text-2xl font-black text-[#001A33]">License & Verification</h3>
                </div>
                <p className="text-[14px] text-gray-400 font-semibold leading-relaxed">
                  To protect our marketplace, we require proof of business registration or a valid tour guide license. <span className="text-red-500 font-black">This is mandatory.</span>
                </p>
                <p className="text-[12px] text-gray-500 font-semibold mt-2">
                  Your application will be reviewed by our admin team. You will receive an email notification once your account is approved, and then you can start creating tours.
                </p>
                
                <div className="block">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // Check file size (10MB max)
                        if (file.size > 10 * 1024 * 1024) {
                          alert('File size must be less than 10MB');
                          return;
                        }
                        // Check file type
                        const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
                        if (!validTypes.includes(file.type)) {
                          alert('Please upload a PDF, JPG, or PNG file');
                          return;
                        }
                        setVerificationDocument(file);
                        // Create preview for images
                        if (file.type.startsWith('image/')) {
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            setDocumentPreview(e.target?.result as string);
                          };
                          reader.readAsDataURL(file);
                        } else {
                          setDocumentPreview(null);
                        }
                      }
                    }}
                    className="hidden"
                    id="license-upload"
                  />
                  <label
                    htmlFor="license-upload"
                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    {verificationDocument ? (
                      <div className="flex flex-col items-center gap-2 p-4">
                        <CheckCircle2 className="text-[#10B981]" size={32} />
                        <span className="text-[14px] font-bold text-[#001A33]">{verificationDocument.name}</span>
                        <span className="text-[12px] text-gray-500">Click to change file</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 p-4">
                        <Upload className="text-gray-400" size={32} />
                        <span className="text-[14px] font-bold text-[#001A33]">Click to upload license document</span>
                        <span className="text-[12px] text-gray-500">PDF, JPG, or PNG (max 10MB)</span>
                      </div>
                    )}
                  </label>
                </div>
                
                {documentPreview && (
                  <div className="mt-4">
                    <p className="text-[14px] font-bold text-[#001A33] mb-2">Preview:</p>
                    <img src={documentPreview} alt="Document preview" className="max-w-full h-auto rounded-lg border-2 border-gray-200" />
                  </div>
                )}
              </div>
            )}

            {/* Account Creation Step - Step 5 (AFTER license upload) */}
            {step === ((selectedBusinessType === 'company' || selectedBusinessType === 'individual' || selectedBusinessType === 'other') ? 5 : 4) && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-black text-[#001A33] mb-2">{t('accountCreation')}</h3>
                  <p className="text-[14px] text-gray-400 font-semibold">{language === 'ja' ? 'ビジネスメールを使用すると、確認が速くなります。' : 'Use your business email for faster verification.'}</p>
                </div>

                {/* Company Information Section */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-[14px] font-black text-[#001A33] mb-2">Company's brand/public name</label>
                    <input 
                      type="text" 
                      value={companyBrandName}
                      onChange={(e) => setCompanyBrandName(e.target.value)}
                      placeholder="Company's brand/public name"
                      className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 font-bold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[14px] font-black text-[#001A33] mb-2">
                      Website <span className="text-gray-400 font-normal text-[12px]">(Optional)</span>
                    </label>
                    <p className="text-[12px] text-gray-500 mb-2">
                      You can add a website where your business has already been rated (e.g., Google Maps, or your own website)
                    </p>
                    <input 
                      type="text" 
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="www.website.com or website.com"
                      className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 font-bold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] outline-none"
                    />
                    <p className="text-[11px] text-gray-400 mt-1">
                      We may use this website for verification of your business activities.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[14px] font-black text-[#001A33] mb-2">Where's the company registered?</label>
                      <select 
                        value={companyRegisteredCountry}
                        onChange={(e) => setCompanyRegisteredCountry(e.target.value)}
                        className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 font-bold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] outline-none cursor-pointer"
                      >
                        <option value="">Country</option>
                        <option value="India">India</option>
                        <option value="Japan">Japan</option>
                        <option value="Thailand">Thailand</option>
                        <option value="Vietnam">Vietnam</option>
                        <option value="Indonesia">Indonesia</option>
                        <option value="Singapore">Singapore</option>
                        <option value="Malaysia">Malaysia</option>
                        <option value="South Korea">South Korea</option>
                        <option value="Philippines">Philippines</option>
                        <option value="China">China</option>
                        <option value="Taiwan">Taiwan</option>
                        <option value="Hong Kong">Hong Kong</option>
                        <option value="United Arab Emirates">United Arab Emirates</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[14px] font-black text-[#001A33] mb-2">Preferred currency to be paid in</label>
                      <select 
                        value={preferredCurrency}
                        onChange={(e) => setPreferredCurrency(e.target.value)}
                        className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 font-bold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] outline-none cursor-pointer"
                      >
                        <option value="">Select one</option>
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="GBP">GBP - British Pound</option>
                        <option value="INR">INR - Indian Rupee</option>
                        <option value="JPY">JPY - Japanese Yen</option>
                        <option value="THB">THB - Thai Baht</option>
                        <option value="SGD">SGD - Singapore Dollar</option>
                        <option value="MYR">MYR - Malaysian Ringgit</option>
                        <option value="CNY">CNY - Chinese Yuan</option>
                        <option value="HKD">HKD - Hong Kong Dollar</option>
                        <option value="AED">AED - UAE Dirham</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Personal Information Section */}
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        type="text" 
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder={t('firstNamePlaceholder')}
                        className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 font-bold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] transition-all outline-none"
                      />
                    </div>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        type="text" 
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder={t('lastNamePlaceholder')}
                        className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 font-bold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] transition-all outline-none"
                      />
                    </div>
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('emailPlaceholder')}
                      className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 font-bold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] transition-all outline-none"
                    />
                    <p className="text-[11px] text-gray-400 mt-1 ml-4">
                      You will use this to log in to your account.
                    </p>
                  </div>
                </div>

                {/* Password Section */}
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t('passwordPlaceholder')}
                      className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-12 font-bold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] transition-all outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#10B981] transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  
                  {/* Password Requirements */}
                  <div className="space-y-2 pl-4">
                    {[
                      { text: 'Between 8 and 30 characters', check: password.length >= 8 && password.length <= 30 },
                      { text: 'Include a number (1234) and one special character (!@#$%^&*)', check: /[0-9]/.test(password) && /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) },
                      { text: 'Uppercase (ABC) and lowercase (abc) letters', check: /[A-Z]/.test(password) && /[a-z]/.test(password) },
                      { text: 'It cannot contain any part of your email address', check: !email || !email.toLowerCase().split('@')[0].split('.').some(part => part.length > 2 && password.toLowerCase().includes(part)) },
                      { text: 'No blank spaces', check: !password.includes(' ') }
                    ].map((req, idx) => {
                      const isValid = req.check;
                      return (
                        <div key={idx} className="flex items-center gap-2 text-[12px]">
                          {isValid ? (
                            <CheckCircle2 size={14} className="text-green-500 shrink-0" />
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-300 shrink-0" />
                          )}
                          <span className={isValid ? 'text-gray-600' : 'text-gray-400'}>{req.text}</span>
                        </div>
                      );
                    })}
                  </div>
                  
                </div>

                {/* Terms and Conditions */}
                <div className="pt-4 border-t border-gray-100">
                  <label className={`flex items-start gap-3 cursor-pointer ${!acceptedTerms ? 'opacity-60' : ''}`}>
                    <input 
                      type="checkbox" 
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="mt-1 w-5 h-5 rounded border-gray-300 text-[#10B981] focus:ring-[#10B981] cursor-pointer"
                    />
                    <span className="text-[13px] text-gray-700">
                      I have read and agree to the{' '}
                      <a href="#" className="text-[#10B981] underline font-semibold">Supplier Terms and Conditions</a>
                      {' '}and the{' '}
                      <a href="#" className="text-[#10B981] underline font-semibold">Privacy Policy</a>.
                      {!acceptedTerms && <span className="text-red-500 ml-2">* Required</span>}
                    </span>
                  </label>
                </div>

                {/* Information Banner */}
                <div className="bg-blue-50 rounded-xl p-4 flex gap-3">
                  <Info className="text-blue-500 shrink-0 mt-0.5" size={18} />
                  <p className="text-[13px] text-gray-700">
                    You'll receive an email to verify your account after registering.
                  </p>
                </div>

                {/* reCAPTCHA Placeholder */}
                <div className="border border-gray-200 rounded-lg p-4 flex items-center gap-3 bg-gray-50">
                  <input type="checkbox" className="w-5 h-5 rounded border-gray-300 cursor-pointer" />
                  <span className="text-[13px] text-gray-700">I'm not a robot</span>
                  <div className="ml-auto flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                      <span className="text-white text-[10px] font-bold">re</span>
                    </div>
                    <span className="text-[10px] text-gray-500">reCAPTCHA</span>
                    <span className="text-[10px] text-gray-400">Privacy - Terms</span>
                  </div>
                </div>
              </div>
            )}

            {/* Email Verification Waiting Step - REMOVED - Now on separate page at /email-verification-waiting */}

            {/* License Upload Step - Only shown after email verification */}
            {emailVerified && step === ((selectedBusinessType === 'company' || selectedBusinessType === 'individual' || selectedBusinessType === 'other') ? 5 : 4) && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-[#10B981] mb-2">
                  <ShieldCheck size={24} />
                  <h3 className="text-2xl font-black text-[#001A33]">Verification</h3>
                </div>
                <p className="text-[14px] text-gray-400 font-semibold leading-relaxed">
                  To protect our marketplace, we require proof of business registration or a valid tour guide license. <span className="text-red-500 font-black">This is mandatory.</span>
                </p>
                <p className="text-[12px] text-gray-500 font-semibold mt-2">
                  Your application will be reviewed by our admin team. You will receive an email notification once your account is approved, and then you can start creating tours.
                </p>
                
                <div className="block">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // Check file size (10MB max)
                        if (file.size > 10 * 1024 * 1024) {
                          alert('File size must be less than 10MB');
                          return;
                        }
                        // Check file type
                        const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
                        if (!validTypes.includes(file.type)) {
                          alert('Please upload a PDF, JPG, or PNG file');
                          return;
                        }
                        setVerificationDocument(file);
                        // Create preview for images
                        if (file.type.startsWith('image/')) {
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            setDocumentPreview(e.target?.result as string);
                          };
                          reader.readAsDataURL(file);
                        } else {
                          setDocumentPreview(null);
                        }
                      }
                    }}
                    className="hidden"
                    id="document-upload"
                  />
                  {verificationDocument ? (
                    <div className="border-2 border-dashed border-[#10B981] rounded-2xl p-12 text-center bg-green-50/50">
                      <div className="space-y-2">
                        <div className="font-black text-[#10B981] text-[14px] flex items-center justify-center gap-2">
                          <CheckCircle2 size={16} className="text-[#10B981]" />
                          {verificationDocument.name}
                        </div>
                        <div className="text-[11px] text-gray-400 font-semibold">
                          {(verificationDocument.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                        {documentPreview && (
                          <img src={documentPreview} alt="Preview" className="max-w-full max-h-48 mx-auto mt-4 rounded-lg" />
                        )}
                        <div className="flex items-center justify-center gap-4 mt-4">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              document.getElementById('document-upload')?.click();
                            }}
                            className="text-[#10B981] text-[12px] font-semibold underline hover:text-[#059669]"
                          >
                            Change file
                          </button>
                          <span className="text-gray-300">|</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setVerificationDocument(null);
                              setDocumentPreview(null);
                              const input = document.getElementById('document-upload') as HTMLInputElement;
                              if (input) input.value = '';
                            }}
                            className="text-red-500 text-[12px] font-semibold underline hover:text-red-600"
                          >
                            Remove file
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <label htmlFor="document-upload" className="block cursor-pointer">
                      <div className="border-2 border-dashed border-gray-100 rounded-2xl p-12 text-center group hover:border-[#10B981] transition-colors cursor-pointer bg-gray-50/50">
                        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                          <Upload className="text-[#10B981]" size={24} />
                        </div>
                        <div className="font-black text-[#001A33] text-[14px] mb-1">Upload License / ID</div>
                        <div className="text-[11px] text-gray-400 font-semibold uppercase">PDF, JPG, or PNG (Max 10MB)</div>
                        <div className="text-[12px] text-gray-500 font-semibold mt-2">Click to browse files</div>
                      </div>
                    </label>
                  )}
                </div>

                <div className="bg-green-50/50 rounded-2xl p-4 flex gap-3">
                  <div className="bg-green-500/10 p-2 rounded-lg h-fit text-[#10B981]">
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
                  {t('previous')}
                </button>
              )}
              <button 
                type="submit"
                disabled={
                  isSubmitting || 
                  (step === 1 && !selectedBusinessType) || 
                  (step === 2 && selectedBusinessType === 'company' && (!companyEmployees || !companyActivities)) || 
                  (step === 2 && selectedBusinessType === 'individual' && !individualActivities) || 
                  (step === 2 && selectedBusinessType === 'other' && !otherActivities) ||
                  (step === ((selectedBusinessType === 'company' || selectedBusinessType === 'individual' || selectedBusinessType === 'other') ? 3 : 2) && ((selectedBusinessType === 'company' && !companyName) || !mainHub || !city || !tourLanguages || !phone || !whatsapp)) ||
                  (step === ((selectedBusinessType === 'company' || selectedBusinessType === 'individual' || selectedBusinessType === 'other') ? 4 : 3) && !verificationDocument) ||
                  (step === ((selectedBusinessType === 'company' || selectedBusinessType === 'individual' || selectedBusinessType === 'other') ? 5 : 4) && (
                    !firstName || !lastName || !email || !password || !acceptedTerms ||
                    password.length < 8 || password.length > 30 ||
                    !/[A-Z]/.test(password) || !/[a-z]/.test(password) ||
                    !/[0-9]/.test(password) || !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ||
                    password.includes(' ') ||
                    email.toLowerCase().split('@')[0].split('.').some(part => part.length > 2 && password.toLowerCase().includes(part))
                  ))
                }
                className="flex-1 bg-[#10B981] hover:bg-[#059669] text-white font-black py-5 rounded-full shadow-lg shadow-green-200 transition-all active:scale-95 flex items-center justify-center gap-2 group disabled:opacity-50 text-[14px]"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    {step === maxSteps ? t('submitRegistration') : t('next')}
                    {step < maxSteps && <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />}
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

