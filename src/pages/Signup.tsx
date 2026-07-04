import { useState } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from '@/lib/context';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import type { UserRole } from '@/lib/types';

/* -------------------------------------------------------------------------- */
/*  Constants                                                                  */
/* -------------------------------------------------------------------------- */

interface RoleOption {
  value: UserRole;
  label: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

const roleOptions: RoleOption[] = [
  {
    value: 'student',
    label: 'Student',
    description: 'Prepare for UPSC and competitive exams with courses, tests, and mentorship from top providers.',
    icon: 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-300 ring-blue-200',
  },
  {
    value: 'institute',
    label: 'Institute',
    description: 'List your coaching courses, test series, and resources. Reach thousands of aspirants across India.',
    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-300 ring-purple-200',
  },
  {
    value: 'educator',
    label: 'Educator',
    description: 'Share your expertise through courses, live classes, and one-on-one mentorship sessions.',
    icon: 'M15.75 6.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z',
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-300 ring-green-200',
  },
  {
    value: 'publisher',
    label: 'Publisher',
    description: 'Distribute your books, eBooks, magazines, and study materials to a wide audience of aspirants.',
    icon: 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25',
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-300 ring-orange-200',
  },
  {
    value: 'admin',
    label: 'Admin',
    description: 'Manage the platform, review content submissions, handle support, and oversee operations.',
    icon: 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-300 ring-red-200',
  },
];

const examOptions = [
  'UPSC CSE',
  'UPSC IFS',
  'UPSC CDS',
  'UPSC NDA',
  'UPSC CAPF',
  'State PCS',
  'SSC CGL',
  'SSC CHSL',
  'Banking PO',
  'Banking Clerk',
  'RBI Grade B',
  'NABARD',
];

const stageOptions = [
  { value: 'prelims', label: 'Prelims' },
  { value: 'mains', label: 'Mains' },
  { value: 'interview', label: 'Interview' },
  { value: 'all', label: 'All Stages' },
];

const languageOptions = [
  'English',
  'Hindi',
  'Tamil',
  'Telugu',
  'Kannada',
  'Malayalam',
  'Marathi',
  'Bengali',
  'Gujarati',
  'Odia',
];

const optionalSubjects = [
  'Anthropology',
  'Geography',
  'History',
  'Mathematics',
  'Philosophy',
  'Political Science',
  'Psychology',
  'Public Administration',
  'Sociology',
  'Commerce & Accountancy',
  'Economics',
  'Law',
  'Literature (various)',
  'Medical Science',
  'Management',
];

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

export default function SignupPage() {
  const auth = useAuth();
  const navigate = useNavigate();

  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  // Step 1 - Role
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  // Step 2 - Basic info
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Step 3 - Student fields
  const [targetExam, setTargetExam] = useState('');
  const [stage, setStage] = useState('');
  const [optionalSubject, setOptionalSubject] = useState('');
  const [language, setLanguage] = useState('English');

  // Step 3 - Institute fields
  const [instituteName, setInstituteName] = useState('');
  const [instituteDescription, setInstituteDescription] = useState('');
  const [instituteAddress, setInstituteAddress] = useState('');

  // Step 3 - Educator fields
  const [bio, setBio] = useState('');
  const [specializations, setSpecializations] = useState('');
  const [experience, setExperience] = useState('');

  // Step 3 - Publisher fields
  const [publisherName, setPublisherName] = useState('');
  const [publisherDescription, setPublisherDescription] = useState('');

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [agreeTerms, setAgreeTerms] = useState(false);

  /* -------- Validation -------- */

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Full name is required.';
    if (!email.trim()) newErrors.email = 'Email address is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Enter a valid email address.';
    if (!phone.trim()) newErrors.phone = 'Phone number is required.';
    else if (!/^\d{10}$/.test(phone.replace(/\D/g, ''))) newErrors.phone = 'Enter a valid 10-digit phone number.';
    if (!password.trim()) newErrors.password = 'Password is required.';
    else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters.';
    if (!city.trim()) newErrors.city = 'City is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (selectedRole === 'student') {
      if (!targetExam) newErrors.targetExam = 'Please select your target exam.';
      if (!stage) newErrors.stage = 'Please select your preparation stage.';
    } else if (selectedRole === 'institute') {
      if (!instituteName.trim()) newErrors.instituteName = 'Institute name is required.';
      if (!instituteDescription.trim()) newErrors.instituteDescription = 'A brief description is required.';
      if (!instituteAddress.trim()) newErrors.instituteAddress = 'Address is required.';
    } else if (selectedRole === 'educator') {
      if (!bio.trim()) newErrors.bio = 'A short bio is required.';
      if (!specializations.trim()) newErrors.specializations = 'Please enter your specializations.';
      if (!experience.trim()) newErrors.experience = 'Years of experience is required.';
      else if (isNaN(Number(experience)) || Number(experience) < 0) newErrors.experience = 'Enter a valid number.';
    } else if (selectedRole === 'publisher') {
      if (!publisherName.trim()) newErrors.publisherName = 'Publisher / company name is required.';
      if (!publisherDescription.trim()) newErrors.publisherDescription = 'A brief description is required.';
    }
    // admin has no extra required fields
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* -------- Navigation -------- */

  const handleNext = () => {
    if (currentStep === 1) {
      if (!selectedRole) return;
      setErrors({});
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (validateStep2()) {
        setCurrentStep(3);
      }
    }
  };

  const handleBack = () => {
    setErrors({});
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  /* -------- Submit -------- */

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;
    if (!validateStep3()) return;
    if (!agreeTerms) {
      setErrors({ terms: 'You must agree to the terms and conditions.' });
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    auth.login(email, password, selectedRole);
    navigate(`/${selectedRole}`);
  };

  /* -------- Helpers -------- */

  const stepLabel = (step: number) => {
    if (step === 1) return 'Choose Role';
    if (step === 2) return 'Basic Info';
    return 'Details';
  };

  const selectedRoleOption = roleOptions.find((r) => r.value === selectedRole);

  /* -------- Render -------- */

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-10 sm:py-16">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="mt-2 text-sm text-gray-500">
            Join ExamPrep and start your journey in just a few steps.
          </p>
        </div>

        {/* Step Indicators */}
        <div className="mb-10">
          <div className="flex items-center justify-between max-w-md mx-auto">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
              <div key={step} className="flex items-center flex-1 last:flex-none">
                {/* Circle */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                      step < currentStep
                        ? 'bg-indigo-600 text-white'
                        : step === currentStep
                        ? 'bg-indigo-600 text-white ring-4 ring-indigo-100'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {step < currentStep ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      step
                    )}
                  </div>
                  <span className={`mt-2 text-xs font-medium ${
                    step <= currentStep ? 'text-indigo-600' : 'text-gray-400'
                  }`}>
                    {stepLabel(step)}
                  </span>
                </div>
                {/* Connector */}
                {step < totalSteps && (
                  <div className="flex-1 mx-3 mt-[-1.25rem]">
                    <div className={`h-0.5 rounded-full transition-all ${
                      step < currentStep ? 'bg-indigo-600' : 'bg-gray-200'
                    }`} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">

          {/* ====== STEP 1 : Choose Role ====== */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">How would you like to use ExamPrep?</h2>
              <p className="text-sm text-gray-500 mb-6">Select your role. You can always change this later from settings.</p>

              <div className="space-y-3">
                {roleOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSelectedRole(opt.value)}
                    className={`w-full text-left px-4 py-4 rounded-xl border-2 transition-all ${
                      selectedRole === opt.value
                        ? `${opt.borderColor} ${opt.bgColor} ring-1`
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        selectedRole === opt.value ? opt.bgColor : 'bg-gray-100'
                      }`}>
                        <svg className={`w-5 h-5 ${selectedRole === opt.value ? opt.color : 'text-gray-500'}`} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d={opt.icon} />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-semibold ${selectedRole === opt.value ? opt.color : 'text-gray-900'}`}>
                            {opt.label}
                          </span>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            selectedRole === opt.value
                              ? 'border-indigo-600 bg-indigo-600'
                              : 'border-gray-300'
                          }`}>
                            {selectedRole === opt.value && (
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </div>
                        <p className="mt-0.5 text-xs text-gray-500 leading-relaxed">{opt.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleNext}
                disabled={!selectedRole}
                className="mt-8 w-full bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Continue as {selectedRole ? roleOptions.find((r) => r.value === selectedRole)?.label : '...'}
              </button>
            </div>
          )}

          {/* ====== STEP 2 : Basic Info ====== */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Your basic information</h2>
              <p className="text-sm text-gray-500 mb-6">
                Tell us a bit about yourself. This helps us personalize your experience.
              </p>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Full name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className={`w-full px-4 py-2.5 border rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
                      errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className={`w-full px-4 py-2.5 border rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
                      errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Phone number <span className="text-red-500">*</span>
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50 text-sm text-gray-500">
                      +91
                    </span>
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="10-digit mobile number"
                      className={`w-full px-4 py-2.5 border rounded-r-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
                        errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      autoComplete="new-password"
                      className={`w-full px-4 py-2.5 border rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition pr-10 ${
                        errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
                  {password.length > 0 && (
                    <div className="mt-2 flex gap-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-all ${
                            password.length >= i * 3
                              ? password.length >= 12
                                ? 'bg-green-500'
                                : password.length >= 8
                                ? 'bg-yellow-500'
                                : 'bg-red-400'
                              : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* City */}
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1.5">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="city"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Your city"
                    className={`w-full px-4 py-2.5 border rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
                      errors.city ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city}</p>}
                </div>
              </div>

              {/* Navigation */}
              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50 transition"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-[2] bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* ====== STEP 3 : Role-specific details ====== */}
          {currentStep === 3 && (
            <form onSubmit={handleSubmit}>
              {/* Role badge */}
              {selectedRoleOption && (
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium mb-4 ${selectedRoleOption.bgColor} ${selectedRoleOption.color}`}>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={selectedRoleOption.icon} />
                  </svg>
                  {selectedRoleOption.label}
                </div>
              )}

              {/* ---------- Student ---------- */}
              {selectedRole === 'student' && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">Exam preferences</h2>
                  <p className="text-sm text-gray-500 mb-6">Help us tailor your dashboard and recommendations.</p>

                  <div className="space-y-4">
                    {/* Target Exam */}
                    <div>
                      <label htmlFor="targetExam" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Target exam <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="targetExam"
                        value={targetExam}
                        onChange={(e) => setTargetExam(e.target.value)}
                        className={`w-full px-4 py-2.5 border rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition appearance-none cursor-pointer ${
                          errors.targetExam ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                          backgroundPosition: 'right 0.5rem center',
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: '1.5em 1.5em',
                        }}
                      >
                        <option value="">Select your target exam</option>
                        {examOptions.map((exam) => (
                          <option key={exam} value={exam}>{exam}</option>
                        ))}
                      </select>
                      {errors.targetExam && <p className="mt-1 text-xs text-red-600">{errors.targetExam}</p>}
                    </div>

                    {/* Stage */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preparation stage <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {stageOptions.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setStage(opt.value)}
                            className={`px-4 py-2.5 rounded-lg border-2 text-sm font-medium transition-all ${
                              stage === opt.value
                                ? 'border-indigo-500 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200'
                                : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                      {errors.stage && <p className="mt-1 text-xs text-red-600">{errors.stage}</p>}
                    </div>

                    {/* Optional Subject */}
                    <div>
                      <label htmlFor="optionalSubject" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Optional subject <span className="text-gray-400 font-normal">(if applicable)</span>
                      </label>
                      <select
                        id="optionalSubject"
                        value={optionalSubject}
                        onChange={(e) => setOptionalSubject(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition appearance-none cursor-pointer"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                          backgroundPosition: 'right 0.5rem center',
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: '1.5em 1.5em',
                        }}
                      >
                        <option value="">Select optional subject</option>
                        {optionalSubjects.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    {/* Language */}
                    <div>
                      <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Preferred language
                      </label>
                      <select
                        id="language"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition appearance-none cursor-pointer"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                          backgroundPosition: 'right 0.5rem center',
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: '1.5em 1.5em',
                        }}
                      >
                        {languageOptions.map((l) => (
                          <option key={l} value={l}>{l}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* ---------- Institute ---------- */}
              {selectedRole === 'institute' && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">Institute details</h2>
                  <p className="text-sm text-gray-500 mb-6">Tell us about your coaching institute so we can verify and list you.</p>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="instituteName" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Institute name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="instituteName"
                        type="text"
                        value={instituteName}
                        onChange={(e) => setInstituteName(e.target.value)}
                        placeholder="e.g. Vision IAS, Vajiram & Ravi"
                        className={`w-full px-4 py-2.5 border rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
                          errors.instituteName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      {errors.instituteName && <p className="mt-1 text-xs text-red-600">{errors.instituteName}</p>}
                    </div>

                    <div>
                      <label htmlFor="instituteDescription" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="instituteDescription"
                        rows={3}
                        value={instituteDescription}
                        onChange={(e) => setInstituteDescription(e.target.value)}
                        placeholder="Brief description of your institute, courses offered, and achievements"
                        className={`w-full px-4 py-2.5 border rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none ${
                          errors.instituteDescription ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      {errors.instituteDescription && <p className="mt-1 text-xs text-red-600">{errors.instituteDescription}</p>}
                    </div>

                    <div>
                      <label htmlFor="instituteAddress" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Address <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="instituteAddress"
                        rows={2}
                        value={instituteAddress}
                        onChange={(e) => setInstituteAddress(e.target.value)}
                        placeholder="Full address of your institute"
                        className={`w-full px-4 py-2.5 border rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none ${
                          errors.instituteAddress ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      {errors.instituteAddress && <p className="mt-1 text-xs text-red-600">{errors.instituteAddress}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* ---------- Educator ---------- */}
              {selectedRole === 'educator' && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">Educator profile</h2>
                  <p className="text-sm text-gray-500 mb-6">Share your teaching background so students can discover you.</p>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Short bio <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="bio"
                        rows={3}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell students about your teaching style, qualifications, and background"
                        className={`w-full px-4 py-2.5 border rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none ${
                          errors.bio ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      {errors.bio && <p className="mt-1 text-xs text-red-600">{errors.bio}</p>}
                    </div>

                    <div>
                      <label htmlFor="specializations" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Specializations <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="specializations"
                        type="text"
                        value={specializations}
                        onChange={(e) => setSpecializations(e.target.value)}
                        placeholder="e.g. History, Geography, Indian Polity (comma-separated)"
                        className={`w-full px-4 py-2.5 border rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
                          errors.specializations ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      {errors.specializations && <p className="mt-1 text-xs text-red-600">{errors.specializations}</p>}
                    </div>

                    <div>
                      <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Years of experience <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="experience"
                        type="number"
                        min="0"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        placeholder="e.g. 5"
                        className={`w-full px-4 py-2.5 border rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
                          errors.experience ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      {errors.experience && <p className="mt-1 text-xs text-red-600">{errors.experience}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* ---------- Publisher ---------- */}
              {selectedRole === 'publisher' && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">Publisher details</h2>
                  <p className="text-sm text-gray-500 mb-6">Tell us about your publication house or brand.</p>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="publisherName" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Publisher / company name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="publisherName"
                        type="text"
                        value={publisherName}
                        onChange={(e) => setPublisherName(e.target.value)}
                        placeholder="e.g. Tata McGraw Hill, Oxford University Press"
                        className={`w-full px-4 py-2.5 border rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
                          errors.publisherName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      {errors.publisherName && <p className="mt-1 text-xs text-red-600">{errors.publisherName}</p>}
                    </div>

                    <div>
                      <label htmlFor="publisherDescription" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="publisherDescription"
                        rows={3}
                        value={publisherDescription}
                        onChange={(e) => setPublisherDescription(e.target.value)}
                        placeholder="Describe your publications, specialties, and catalogue"
                        className={`w-full px-4 py-2.5 border rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none ${
                          errors.publisherDescription ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      {errors.publisherDescription && <p className="mt-1 text-xs text-red-600">{errors.publisherDescription}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* ---------- Admin ---------- */}
              {selectedRole === 'admin' && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">Admin registration</h2>
                  <p className="text-sm text-gray-500 mb-6">
                    Admin accounts require approval. Your request will be reviewed by the platform team.
                  </p>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex gap-3">
                      <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <div>
                        <h4 className="text-sm font-semibold text-amber-800">Restricted access</h4>
                        <p className="mt-1 text-xs text-amber-700 leading-relaxed">
                          Admin privileges grant full platform management access including content moderation, user management, and financial oversight. Your registration will be subject to identity verification and team approval.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Terms & Conditions */}
              <div className="mt-6 flex items-start gap-2">
                <input
                  id="terms"
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
                  I agree to the{' '}
                  <Link to="#" className="text-indigo-600 hover:text-indigo-700 font-medium">Terms of Service</Link>
                  {' '}and{' '}
                  <Link to="#" className="text-indigo-600 hover:text-indigo-700 font-medium">Privacy Policy</Link>
                </label>
              </div>
              {errors.terms && <p className="mt-1 text-xs text-red-600">{errors.terms}</p>}

              {/* Navigation */}
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50 transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-[2] bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Creating account...
                    </>
                  ) : (
                    'Create account'
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Already have an account */}
          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

