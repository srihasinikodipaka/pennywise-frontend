import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Home, 
  ArrowLeftRight, 
  PiggyBank, 
  TrendingUp, 
  MessageSquare, 
  Settings,
  LogOut, 
  LogIn, 
  User as UserIcon,
  CircleDollarSign,
  Plus
} from 'lucide-react';

export const Navbar = ({ currentView, setCurrentView, openAuthModal, openAddTxModal }) => {
  const { user, isAuthenticated, logout, currency, updateCurrency, demoLogin } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
    { id: 'budgets', label: 'Budgets', icon: PiggyBank },
    { id: 'insights', label: 'Insights', icon: TrendingUp },
    { id: 'assistant', label: 'Ask Pennywise', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const currencies = ['₹', '$', '€', '£'];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E6E8EC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tagline */}
          <div 
            className="flex items-center gap-3 cursor-pointer select-none" 
            onClick={() => setCurrentView('dashboard')}
            title="Go to Home"
          >
            <div className="w-9 h-9 rounded-xl bg-[#E8F3FF] border border-[#BBD9F5] flex items-center justify-center text-[#477EAD] shadow-sm">
              <CircleDollarSign className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-[#24364B] font-sans">
                  penny<span className="text-[#477EAD]">wise</span>
                </span>
              </div>
              <p className="text-[11px] text-[#687789] -mt-0.5 hidden sm:block">
                Your money, a little more manageable.
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 bg-[#FAF9F5] p-1 rounded-xl border border-[#E6E8EC]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-[#E8F3FF] text-[#477EAD] font-semibold border border-[#BBD9F5] shadow-xs'
                      : 'text-[#687789] hover:text-[#24364B] hover:bg-white/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#477EAD]' : 'text-[#687789]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Currency Selector */}
            <div className="hidden sm:flex items-center bg-[#FAF9F5] border border-[#E6E8EC] rounded-lg p-0.5 text-xs">
              {currencies.map((curr) => (
                <button
                  key={curr}
                  onClick={() => updateCurrency(curr)}
                  className={`px-2 py-0.5 rounded font-mono font-medium transition-colors ${
                    currency === curr
                      ? 'bg-[#477EAD] text-white shadow-xs'
                      : 'text-[#687789] hover:text-[#24364B]'
                  }`}
                  title={`Switch currency to ${curr}`}
                >
                  {curr}
                </button>
              ))}
            </div>

            {/* Quick Add Expense Action */}
            {isAuthenticated && (
              <button
                onClick={openAddTxModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#477EAD] hover:bg-[#396992] text-white transition-all shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Add expense</span>
              </button>
            )}

            {/* User Profile / Auth Action */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2 pl-2 border-l border-[#E6E8EC]">
                <div 
                  onClick={() => setCurrentView('settings')}
                  className="flex items-center gap-2 bg-[#FAF9F5] hover:bg-[#E8F3FF] px-2.5 py-1 rounded-lg border border-[#E6E8EC] cursor-pointer transition-colors"
                  title="Account Settings"
                >
                  <div className="w-6 h-6 rounded-full bg-[#E8F3FF] text-[#477EAD] border border-[#BBD9F5] flex items-center justify-center text-[11px] font-bold">
                    {user?.fullName ? user.fullName[0].toUpperCase() : 'U'}
                  </div>
                  <span className="text-xs text-[#24364B] font-medium hidden lg:inline max-w-[110px] truncate">
                    {user?.fullName || user?.username}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="p-1.5 text-[#687789] hover:text-[#9B2C2C] hover:bg-[#FDE8E8] rounded-lg transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={demoLogin}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-[#F8E7A1] text-[#24364B] border border-[#E6D480] hover:bg-[#F3DE86] transition-all"
                  title="Explore with sample transactions"
                >
                  Try Demo
                </button>
                <button
                  onClick={openAuthModal}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#477EAD] hover:bg-[#396992] text-white transition-all shadow-xs"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-[#E6E8EC]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[10px] font-medium transition-colors ${
                  isActive 
                    ? 'text-[#477EAD] bg-[#E8F3FF] font-semibold' 
                    : 'text-[#687789] hover:text-[#24364B]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
