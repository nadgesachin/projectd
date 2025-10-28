import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Eye, EyeOff, Mail, Lock, User, Building, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import mockApiService from '../mocks/mockApiService';
import { toast } from 'react-toastify';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Account Info, 2: Role Selection, 3: Success
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    agreeTerms: false,
  });

  const roles = [
    {
      id: 'entrepreneur',
      title: 'Entrepreneur',
      icon: '🚀',
      description: 'Building the next big thing',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'mentor',
      title: 'Mentor',
      icon: '🎯',
      description: 'Share expertise and guide others',
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'investor',
      title: 'Investor',
      icon: '💼',
      description: 'Find and fund great ideas',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRoleSelect = (roleId) => {
    setFormData(prev => ({ ...prev, role: roleId }));
  };

  const validateStep1 = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error('Please fill in all fields');
      return false;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    if (!formData.agreeTerms) {
      toast.error('Please agree to the terms and conditions');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.role) {
      toast.error('Please select your role');
      return;
    }

    setLoading(true);

    try {
      const response = await mockApiService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      // Store authentication data
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('isAuthenticated', 'true');

      setStep(3);
      
      setTimeout(() => {
        toast.success('Account created successfully! 🎉');
        // Reload to update auth state
        window.location.href = '/';
      }, 2000);
    } catch (error) {
      toast.error(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
                  step >= s 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step > s ? <CheckCircle className="w-6 h-6" /> : s}
                </div>
                {s < 3 && (
                  <div className={`w-16 h-1 mx-2 ${step > s ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-8 mt-2">
            <span className={`text-sm ${step >= 1 ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}>Account</span>
            <span className={`text-sm ${step >= 2 ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}>Role</span>
            <span className={`text-sm ${step >= 3 ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}>Done</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-10">
          
          {/* Step 1: Account Information */}
          {step === 1 && (
            <>
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h2>
                <p className="text-gray-600">Join ThriveUnity and start growing</p>
              </div>

              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Demo Mode:</strong> Use any details to create an account
                </p>
              </div>

              <form className="space-y-5">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Terms & Conditions */}
                <div className="flex items-start">
                  <input
                    id="agreeTerms"
                    name="agreeTerms"
                    type="checkbox"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className="h-4 w-4 mt-1 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="agreeTerms" className="ml-2 block text-sm text-gray-700">
                    I agree to the{' '}
                    <Link to="/terms" className="text-blue-600 hover:text-blue-700 font-medium">
                      Terms and Conditions
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-blue-600 hover:text-blue-700 font-medium">
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                {/* Next Button */}
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition shadow-lg"
                >
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            </>
          )}

          {/* Step 2: Role Selection */}
          {step === 2 && (
            <>
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Role</h2>
                <p className="text-gray-600">How do you want to join ThriveUnity?</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => handleRoleSelect(role.id)}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      formData.role === role.id
                        ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                        : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                    }`}
                  >
                    <div className={`w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r ${role.color} flex items-center justify-center text-3xl`}>
                      {role.icon}
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{role.title}</h3>
                    <p className="text-sm text-gray-600">{role.description}</p>
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading || !formData.role}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <div className="text-center py-8">
              <div className="w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to ThriveUnity!</h2>
              <p className="text-gray-600 mb-4">Your account has been created successfully</p>
              <p className="text-sm text-gray-500">Redirecting you to your dashboard...</p>
            </div>
          )}

          {/* Sign In Link */}
          {step < 3 && (
            <p className="mt-8 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">
                Sign in
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
