import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Settings, User, Shield, Coins, LogOut, Check } from 'lucide-react';

export const SettingsView = ({ onSignOut }) => {
  const { user, currency, updateCurrency, logout } = useAuth();

  const currencies = [
    { symbol: '₹', name: 'Indian Rupee (INR)' },
    { symbol: '$', name: 'US Dollar (USD)' },
    { symbol: '€', name: 'Euro (EUR)' },
    { symbol: '£', name: 'British Pound (GBP)' },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-[#24364B]">Settings</h1>
        <p className="text-xs text-[#687789] mt-0.5">
          Manage your currency preferences and account information
        </p>
      </div>

      {/* Currency Preference */}
      <div className="penny-card p-6 bg-white space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-[#E6E8EC]">
          <Coins className="w-4 h-4 text-[#477EAD]" />
          <div>
            <h2 className="text-sm font-bold text-[#24364B]">Currency preference</h2>
            <p className="text-xs text-[#687789]">Choose the default symbol for your dashboard and charts</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {currencies.map((c) => {
            const isSelected = currency === c.symbol;
            return (
              <button
                key={c.symbol}
                onClick={() => updateCurrency(c.symbol)}
                className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                  isSelected
                    ? 'border-[#477EAD] bg-[#E8F3FF] text-[#24364B]'
                    : 'border-[#E6E8EC] bg-[#FAF9F5] hover:bg-[#FAF9F5]/70 text-[#24364B]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-white border border-[#E6E8EC] flex items-center justify-center font-mono font-bold text-sm text-[#477EAD]">
                    {c.symbol}
                  </span>
                  <span className="text-xs font-medium">{c.name}</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-[#477EAD]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Account Information */}
      <div className="penny-card p-6 bg-white space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-[#E6E8EC]">
          <User className="w-4 h-4 text-[#477EAD]" />
          <div>
            <h2 className="text-sm font-bold text-[#24364B]">Account details</h2>
            <p className="text-xs text-[#687789]">Current signed in profile</p>
          </div>
        </div>

        <div className="space-y-3 pt-1 text-xs">
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF9F5] border border-[#E6E8EC]">
            <span className="text-[#687789]">Full name</span>
            <span className="font-semibold text-[#24364B]">{user?.fullName || 'Not provided'}</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF9F5] border border-[#E6E8EC]">
            <span className="text-[#687789]">Username</span>
            <span className="font-mono font-medium text-[#24364B]">{user?.username}</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF9F5] border border-[#E6E8EC]">
            <span className="text-[#687789]">Email address</span>
            <span className="font-mono text-[#24364B]">{user?.email || 'N/A'}</span>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={onSignOut || logout}
            className="px-4 py-2 text-xs font-semibold text-[#9B2C2C] bg-[#FDE8E8] hover:bg-[#FCDADA] border border-[#F8B4B4] rounded-xl transition-colors flex items-center gap-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign out of account</span>
          </button>
        </div>
      </div>

      {/* Security & Data Privacy Notice */}
      <div className="penny-card p-5 bg-[#FAF9F5] border border-[#E6E8EC] flex items-start gap-3">
        <Shield className="w-4 h-4 text-[#477EAD] shrink-0 mt-0.5" />
        <div className="text-xs text-[#687789] leading-relaxed">
          <span className="font-bold text-[#24364B] block mb-0.5">Privacy & Security</span>
          Pennywise stores your transactions in your local database with BCrypt-hashed credentials and stateless JWT session tokens. Your financial figures are never broadcast or sold.
        </div>
      </div>
    </div>
  );
};
