import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Lock, Mail, User, ShieldCheck, Sparkles, AlertCircle, Eye, EyeOff } from 'lucide-react';

export const AuthModal = ({ isOpen, onClose }) => {
  const { login, register, demoLogin, error: authError } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    currency: '₹',
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    try {
      if (isRegister) {
        await register(formData);
      } else {
        await login(formData.username || formData.email, formData.password);
      }
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAccess = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      await demoLogin();
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white border border-[#E6E8EC] rounded-2xl shadow-xl p-6 sm:p-7 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#687789] hover:text-[#24364B] p-1.5 rounded-lg hover:bg-[#FAF9F5] transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-[#E8F3FF] border border-[#BBD9F5] text-[#477EAD] mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-[#24364B] tracking-tight">
            {isRegister ? 'Create your Pennywise account' : 'Welcome back to Pennywise'}
          </h2>
          <p className="text-xs text-[#687789] mt-1">
            {isRegister
              ? 'Start tracking spending with simple, clear financial insights'
              : 'Sign in to access your dashboard, budgets, and transactions'}
          </p>
        </div>

        {/* 1-Click Demo Login Banner */}
        <div className="mb-5 bg-[#FAF9F5] border border-[#E6E8EC] rounded-xl p-3.5 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-[#24364B] mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#477EAD]" />
            <span>Sample Evaluation Account</span>
          </div>
          <p className="text-[11px] text-[#687789] mb-2.5">
            Explore with preloaded realistic transactions, category budgets, and spending insights.
          </p>
          <button
            type="button"
            disabled={loading}
            onClick={handleDemoAccess}
            className="w-full py-2 px-3 rounded-xl bg-[#E8F3FF] hover:bg-[#dbeeff] text-[#477EAD] border border-[#BBD9F5] font-semibold text-xs tracking-wide transition-all shadow-sm flex items-center justify-center gap-1.5"
          >
            <span>Try 1-Click Demo Login (demo)</span>
          </button>
        </div>

        {/* Separator */}
        <div className="relative flex items-center justify-center mb-4">
          <div className="border-t border-[#E6E8EC] w-full" />
          <span className="bg-white px-3 text-[11px] font-medium text-[#687789]">
            or continue with credentials
          </span>
          <div className="border-t border-[#E6E8EC] w-full" />
        </div>

        {/* Error notification */}
        {(errorMessage || authError) && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage || authError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {isRegister && (
            <>
              <div>
                <label className="block text-xs font-medium text-[#24364B] mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-[#8C9AA8]" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Alex Morgan"
                    required
                    className="w-full bg-[#FAF9F5] border border-[#E6E8EC] rounded-xl pl-9 pr-3 py-2 text-xs text-[#24364B] placeholder-[#8C9AA8] focus:outline-none focus:border-[#477EAD] focus:ring-1 focus:ring-[#477EAD] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#24364B] mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-[#8C9AA8]" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="alex@example.com"
                    required
                    className="w-full bg-[#FAF9F5] border border-[#E6E8EC] rounded-xl pl-9 pr-3 py-2 text-xs text-[#24364B] placeholder-[#8C9AA8] focus:outline-none focus:border-[#477EAD] focus:ring-1 focus:ring-[#477EAD] transition-colors"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-medium text-[#24364B] mb-1">
              {isRegister ? 'Username' : 'Username or Email'}
            </label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 w-4 h-4 text-[#8C9AA8]" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder={isRegister ? 'choose_username' : 'demo or your username'}
                required
                className="w-full bg-[#FAF9F5] border border-[#E6E8EC] rounded-xl pl-9 pr-3 py-2 text-xs text-[#24364B] placeholder-[#8C9AA8] focus:outline-none focus:border-[#477EAD] focus:ring-1 focus:ring-[#477EAD] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#24364B] mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-[#8C9AA8]" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full bg-[#FAF9F5] border border-[#E6E8EC] rounded-xl pl-9 pr-10 py-2 text-xs text-[#24364B] placeholder-[#8C9AA8] focus:outline-none focus:border-[#477EAD] focus:ring-1 focus:ring-[#477EAD] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-[#8C9AA8] hover:text-[#24364B] transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-[#477EAD] hover:bg-[#396992] text-white font-semibold text-xs tracking-wide transition-all shadow-sm disabled:opacity-50"
          >
            {loading ? 'Signing in...' : (isRegister ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-5 text-center text-xs text-[#687789]">
          {isRegister ? (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => { setIsRegister(false); setErrorMessage(''); }}
                className="text-[#477EAD] hover:underline font-semibold"
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => { setIsRegister(true); setErrorMessage(''); }}
                className="text-[#477EAD] hover:underline font-semibold"
              >
                Create Account
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
