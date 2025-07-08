import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { ButtonSpinner } from '../../components/ui';
import { Eye, EyeOff, Mail, Lock, User, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import useTitle from '../../hooks/useTitle';

const Register = () => {
  useTitle('Register');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false
  });
  const [showRequirements, setShowRequirements] = useState(false);
  
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const validatePasswordRequirements = (password) => {
    return {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Validate password requirements in real-time
    if (name === 'password') {
      const requirements = validatePasswordRequirements(value);
      setPasswordRequirements(requirements);
      setShowRequirements(value.length > 0);
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Please enter your name');
      return false;
    }
    
    if (!formData.email) {
      toast.error('Please enter your email');
      return false;
    }
    
    // Check all password requirements
    const requirements = validatePasswordRequirements(formData.password);
    const allRequirementsMet = Object.values(requirements).every(req => req);
    
    if (!allRequirementsMet) {
      toast.error('Password does not meet all requirements');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      await register(formData.email, formData.password, formData.name);
      navigate('/');
    } catch (error) {
      // Error is already handled in AuthContext with user-friendly message
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      setIsGoogleLoading(true);
      await loginWithGoogle();
      navigate('/');
    } catch (error) {
      // Error is already handled in AuthContext with user-friendly message
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Join SportNex
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Create your account to start booking courts
          </p>
        </div>

        {/* Register Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-sm md:text-base"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-sm md:text-base"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-sm md:text-base"
                  placeholder="Create a strong password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              
              {/* Password Requirements */}
              {showRequirements && (
                <div className="mt-3 space-y-2">
                  <p className="text-sm font-medium text-gray-700">Password must contain:</p>
                  <div className="space-y-1">
                    <div className={`flex items-center text-sm ${
                      passwordRequirements.minLength ? 'text-green-600' : 'text-red-500'
                    }`}>
                      {passwordRequirements.minLength ? (
                        <Check className="h-4 w-4 mr-2" />
                      ) : (
                        <X className="h-4 w-4 mr-2" />
                      )}
                      At least 8 characters
                    </div>
                    <div className={`flex items-center text-sm ${
                      passwordRequirements.hasUppercase ? 'text-green-600' : 'text-red-500'
                    }`}>
                      {passwordRequirements.hasUppercase ? (
                        <Check className="h-4 w-4 mr-2" />
                      ) : (
                        <X className="h-4 w-4 mr-2" />
                      )}
                      One uppercase letter (A-Z)
                    </div>
                    <div className={`flex items-center text-sm ${
                      passwordRequirements.hasLowercase ? 'text-green-600' : 'text-red-500'
                    }`}>
                      {passwordRequirements.hasLowercase ? (
                        <Check className="h-4 w-4 mr-2" />
                      ) : (
                        <X className="h-4 w-4 mr-2" />
                      )}
                      One lowercase letter (a-z)
                    </div>
                    <div className={`flex items-center text-sm ${
                      passwordRequirements.hasNumber ? 'text-green-600' : 'text-red-500'
                    }`}>
                      {passwordRequirements.hasNumber ? (
                        <Check className="h-4 w-4 mr-2" />
                      ) : (
                        <X className="h-4 w-4 mr-2" />
                      )}
                      One number (0-9)
                    </div>
                    <div className={`flex items-center text-sm ${
                      passwordRequirements.hasSpecialChar ? 'text-green-600' : 'text-red-500'
                    }`}>
                      {passwordRequirements.hasSpecialChar ? (
                        <Check className="h-4 w-4 mr-2" />
                      ) : (
                        <X className="h-4 w-4 mr-2" />
                      )}
                      One special character (!@#$%^&*)
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-sm md:text-base"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Register Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-sm md:text-base font-medium transition-colors"
            >
              {isLoading ? (
                <ButtonSpinner text="Creating account..." />
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>
          </div>

          {/* Google Registration */}
          <Button
            type="button"
            onClick={handleGoogleRegister}
            disabled={isGoogleLoading}
            variant="outline"
            className="w-full py-3 text-sm md:text-base font-medium"
          >
            {isGoogleLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                <span>Signing up with Google...</span>
              </>
            ) : (
              <>
                <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign up with Google
              </>
            )}
          </Button>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-green-600 hover:text-green-500 transition-colors"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;