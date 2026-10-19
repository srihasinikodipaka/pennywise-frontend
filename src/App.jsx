import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { TransactionsView } from './components/TransactionsView';
import { BudgetsView } from './components/BudgetsView';
import { InsightsView } from './components/InsightsView';
import { AssistantView } from './components/AssistantView';
import { SettingsView } from './components/SettingsView';
import { AuthModal } from './components/AuthModal';
import { TransactionModal } from './components/TransactionModal';
import { BudgetModal } from './components/BudgetModal';
import { Database, Cpu, Sparkles } from 'lucide-react';

function MainLayout() {
  const { isAuthenticated, logout } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [budgetTargetMonth, setBudgetTargetMonth] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // When unauthenticated, ensure user cannot remain on protected views
  useEffect(() => {
    if (!isAuthenticated && currentView !== 'dashboard') {
      setCurrentView('dashboard');
    }
  }, [isAuthenticated, currentView]);

  // Handle explicit sign-out action
  const handleLogout = () => {
    logout();
    setCurrentView('dashboard');
    setIsAuthModalOpen(true);
  };

  // Listen for global logout or auth expiration events
  useEffect(() => {
    const handleGlobalLogout = () => {
      setCurrentView('dashboard');
      setIsAuthModalOpen(true);
    };

    window.addEventListener('pennywise:logout', handleGlobalLogout);
    window.addEventListener('pennywise:unauthorized', handleGlobalLogout);

    return () => {
      window.removeEventListener('pennywise:logout', handleGlobalLogout);
      window.removeEventListener('pennywise:unauthorized', handleGlobalLogout);
    };
  }, []);

  const openAddTxModal = () => {
    setEditingTransaction(null);
    setIsTxModalOpen(true);
  };

  const openEditTxModal = (tx) => {
    setEditingTransaction(tx);
    setIsTxModalOpen(true);
  };

  const openBudgetModal = (month) => {
    setBudgetTargetMonth(month || '');
    setIsBudgetModalOpen(true);
  };

  const handleDataSaved = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#24364B] flex flex-col font-sans antialiased selection:bg-[#BBD9F5] selection:text-[#24364B]">
      {/* Navigation Bar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        openAuthModal={() => setIsAuthModalOpen(true)}
        openAddTxModal={openAddTxModal}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentView === 'dashboard' && (
          <DashboardView
            key={`dash-${refreshTrigger}`}
            openAddTxModal={openAddTxModal}
            openAuthModal={() => setIsAuthModalOpen(true)}
            setCurrentView={setCurrentView}
          />
        )}
        {isAuthenticated && currentView === 'transactions' && (
          <TransactionsView
            key={`tx-${refreshTrigger}`}
            openAddTxModal={openAddTxModal}
            openEditTxModal={openEditTxModal}
          />
        )}
        {isAuthenticated && currentView === 'budgets' && (
          <BudgetsView
            key={`bgt-${refreshTrigger}`}
            openBudgetModal={openBudgetModal}
          />
        )}
        {isAuthenticated && currentView === 'insights' && (
          <InsightsView key={`ins-${refreshTrigger}`} />
        )}
        {isAuthenticated && currentView === 'assistant' && (
          <AssistantView key={`asst-${refreshTrigger}`} />
        )}
        {isAuthenticated && currentView === 'settings' && (
          <SettingsView 
            key={`set-${refreshTrigger}`}
            onSignOut={handleLogout}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E6E8EC] bg-white py-6 mt-12 text-xs text-[#687789]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#24364B] tracking-tight">
              Penny<span className="text-[#477EAD]">wise</span>
            </span>
            <span>—</span>
            <span className="italic text-[#687789]">“Your money, a little more manageable.”</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-[#687789]">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#477EAD]" /> Spring Boot 3 + Java 21
            </span>
            <span className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-[#477EAD]" /> MySQL 8.0
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#477EAD]" /> React 18 + Vite
            </span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <TransactionModal
        isOpen={isTxModalOpen}
        onClose={() => setIsTxModalOpen(false)}
        onSave={handleDataSaved}
        editingTransaction={editingTransaction}
      />

      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        onSave={handleDataSaved}
        currentMonth={budgetTargetMonth}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}
