import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus, 
  ArrowRight, 
  Lightbulb, 
  Wallet, 
  TrendingUp, 
  PiggyBank, 
  MessageSquare,
  ChevronRight,
  ReceiptText,
  BarChart2,
  LogIn
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from 'recharts';

export const DashboardView = ({ openAddTxModal, setCurrentView, openAuthModal }) => {
  const { user, currency, isAuthenticated, demoLogin } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showChart, setShowChart] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/analytics/dashboard');
      setData(res.data);
    } catch (err) {
      setError('Could not load your financial summary. Please ensure the backend server is reachable.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = user?.fullName ? ` ${user.fullName.split(' ')[0]}` : '';
    if (hour < 12) return `Good morning${name}`;
    if (hour < 17) return `Good afternoon${name}`;
    return `Good evening${name}`;
  };

  if (!isAuthenticated) {
    return (
      <div className="py-16 max-w-xl mx-auto px-4 text-center">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#E8F3FF] border border-[#BBD9F5] flex items-center justify-center text-[#477EAD] shadow-sm">
          <Wallet className="w-7 h-7 stroke-[2]" />
        </div>
        <h2 className="text-2xl font-bold text-[#24364B] tracking-tight mb-2">
          Your money, a little more manageable.
        </h2>
        <p className="text-sm text-[#687789] mb-6 leading-relaxed">
          Pennywise helps you keep track of daily expenses, manage category budgets, and understand where your money stands without confusing financial jargon.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={openAuthModal}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#477EAD] hover:bg-[#396992] text-white font-semibold text-xs tracking-wide transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In to Your Account</span>
          </button>
          <button
            onClick={demoLogin}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#E8F3FF] hover:bg-[#D4E8FC] text-[#477EAD] border border-[#BBD9F5] font-semibold text-xs transition-all flex items-center justify-center gap-2"
          >
            <span>Try 1-Click Demo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3">
        <div className="w-7 h-7 border-2 border-[#477EAD] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-[#687789]">Loading your money overview...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 max-w-lg mx-auto text-center">
        <div className="p-4 rounded-xl bg-[#FDE8E8] border border-[#F8B4B4] text-[#9B2C2C] text-xs mb-4">
          {error}
        </div>
        <button
          onClick={fetchDashboardData}
          className="px-4 py-2 text-xs font-semibold text-[#477EAD] bg-white border border-[#E6E8EC] rounded-lg hover:bg-[#FAF9F5]"
        >
          Try loading again
        </button>
      </div>
    );
  }

  const {
    totalIncome = 0,
    totalExpenses = 0,
    netBalance = 0,
    savingsRate = 0,
    categoryBreakdown = [],
    monthlyTrends = [],
    recentTransactions = [],
    quickInsight = ''
  } = data || {};

  // Formatted data-backed insight
  const getUsefulInsight = () => {
    if (quickInsight) return quickInsight;
    if (categoryBreakdown && categoryBreakdown.length > 0) {
      const top = categoryBreakdown[0];
      return `Your highest spending category this month is ${top.category} at ${currency}${Number(top.amount).toLocaleString()} (${top.percentage}% of all expenses).`;
    }
    if (totalIncome > 0 && totalExpenses > 0) {
      return `Your savings rate is currently ${savingsRate}% of your recorded monthly income.`;
    }
    return "Record your first expense or income entry to see practical spending insights.";
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* ================================================================= */}
      {/* A. Welcome section */}
      {/* ================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#24364B]">
            {getGreeting()}
          </h1>
          <p className="text-sm text-[#687789] mt-0.5">
            Let's see where your money stands.
          </p>
        </div>
        <button
          onClick={openAddTxModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#477EAD] hover:bg-[#396992] text-white transition-all shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.2]" />
          <span>Add expense</span>
        </button>
      </div>

      {/* ================================================================= */}
      {/* B. Main available-money card */}
      {/* ================================================================= */}
      <div className="penny-card p-6 bg-gradient-to-br from-white via-white to-[#FAF9F5] relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#687789]">
                Available to spend
              </span>
              <span className="text-[10px] bg-[#E8F3FF] text-[#477EAD] px-2 py-0.5 rounded-full font-medium">
                Current month
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#24364B] font-mono">
                {currency}{Number(netBalance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <p className="text-xs text-[#687789] mt-2 max-w-md leading-relaxed">
              Calculated from your recorded income minus total expenses this month.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-[#E6E8EC]">
            <button
              onClick={() => setCurrentView('budgets')}
              className="px-3.5 py-2 rounded-xl text-xs font-medium text-[#477EAD] bg-[#E8F3FF] hover:bg-[#D4E8FC] border border-[#BBD9F5] transition-colors flex items-center justify-center gap-1.5"
            >
              <PiggyBank className="w-3.5 h-3.5" />
              <span>View budget progress</span>
            </button>
            <button
              onClick={() => setCurrentView('transactions')}
              className="px-3.5 py-2 rounded-xl text-xs font-medium text-[#24364B] bg-white hover:bg-[#FAF9F5] border border-[#E6E8EC] transition-colors flex items-center justify-center gap-1.5"
            >
              <ReceiptText className="w-3.5 h-3.5 text-[#687789]" />
              <span>Spending breakdown</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* C. Income and expenses (Two compact, visually balanced cards) */}
      {/* ================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Income Card */}
        <div className="penny-card p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#687789]">Total income</span>
            <div className="w-7 h-7 rounded-lg bg-[#DDEFE4] text-[#2B6A43] flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4 stroke-[2.2]" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold tracking-tight text-[#24364B] font-mono">
            {currency}{Number(totalIncome).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-[#687789] mt-1.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2B6A43]" />
            <span>Recorded salaries and inflows</span>
          </div>
        </div>

        {/* Expenses Card */}
        <div className="penny-card p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#687789]">Total expenses</span>
            <div className="w-7 h-7 rounded-lg bg-[#FDE8E8] text-[#9B2C2C] flex items-center justify-center">
              <ArrowDownRight className="w-4 h-4 stroke-[2.2]" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold tracking-tight text-[#24364B] font-mono">
            {currency}{Number(totalExpenses).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-[#687789] mt-1.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9B2C2C]" />
            <span>Essential bills and everyday spending</span>
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* E. Useful financial insight (One concise, data-backed card) */}
      {/* ================================================================= */}
      <div className="p-4 rounded-2xl bg-[#E8F3FF] border border-[#BBD9F5] flex items-start sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-white border border-[#BBD9F5] text-[#477EAD] flex items-center justify-center shrink-0 shadow-xs">
            <Lightbulb className="w-4 h-4 stroke-[2]" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-[#477EAD]">
              Helpful insight
            </span>
            <p className="text-xs sm:text-sm text-[#24364B] font-medium mt-0.5">
              {getUsefulInsight()}
            </p>
          </div>
        </div>
        <button
          onClick={() => setCurrentView('insights')}
          className="text-xs font-semibold text-[#477EAD] hover:text-[#396992] flex items-center gap-1 shrink-0 bg-white/80 hover:bg-white px-3 py-1.5 rounded-lg border border-[#BBD9F5] transition-colors"
        >
          <span>More insights</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ================================================================= */}
      {/* D. Recent transactions */}
      {/* ================================================================= */}
      <div className="penny-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-[#24364B] tracking-tight">Recent transactions</h2>
            <p className="text-xs text-[#687789]">Your latest expenses and income</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={openAddTxModal}
              className="text-xs font-medium text-[#477EAD] bg-[#E8F3FF] hover:bg-[#D4E8FC] px-2.5 py-1 rounded-lg border border-[#BBD9F5] transition-colors flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>Add</span>
            </button>
            <button
              onClick={() => setCurrentView('transactions')}
              className="text-xs font-semibold text-[#687789] hover:text-[#24364B] flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-[#FAF9F5] transition-colors"
            >
              <span>View all</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {recentTransactions.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#687789]">
              No transactions recorded yet. Tap "Add" to enter your first expense.
            </div>
          ) : (
            recentTransactions.slice(0, 5).map((tx) => {
              const isExpense = tx.type === 'EXPENSE';
              return (
                <div 
                  key={tx.id} 
                  className="flex items-center justify-between p-3 rounded-xl bg-[#FAF9F5] hover:bg-[#F3F0E6]/50 border border-[#E6E8EC] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                      isExpense ? 'bg-[#FDE8E8] text-[#9B2C2C]' : 'bg-[#DDEFE4] text-[#2B6A43]'
                    }`}>
                      {isExpense ? '-' : '+'}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-[#24364B] truncate">
                        {tx.title}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-[#687789] mt-0.5">
                        <span className="bg-white px-1.5 py-0.2 rounded border border-[#E6E8EC] text-[10px]">
                          {tx.category}
                        </span>
                        <span>•</span>
                        <span>{tx.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className={`font-mono text-xs font-bold shrink-0 pl-3 ${
                    isExpense ? 'text-[#24364B]' : 'text-[#2B6A43]'
                  }`}>
                    {isExpense ? '-' : '+'}{currency}{Number(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ================================================================= */}
      {/* F. Quick actions */}
      {/* ================================================================= */}
      <div>
        <div className="mb-3">
          <h2 className="text-sm font-bold text-[#24364B] tracking-tight">Quick actions</h2>
          <p className="text-xs text-[#687789]">Common financial tasks at a glance</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Action 1: Add Expense */}
          <button
            onClick={openAddTxModal}
            className="penny-card p-4 text-left hover:border-[#BBD9F5] hover:bg-[#E8F3FF]/30 transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#E8F3FF] text-[#477EAD] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Plus className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div className="text-xs font-bold text-[#24364B]">Add expense</div>
            <p className="text-[11px] text-[#687789] mt-0.5">Record a new purchase</p>
          </button>

          {/* Action 2: View Budget */}
          <button
            onClick={() => setCurrentView('budgets')}
            className="penny-card p-4 text-left hover:border-[#BBD9F5] hover:bg-[#E8F3FF]/30 transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#DDEFE4] text-[#2B6A43] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <PiggyBank className="w-4 h-4 stroke-[2]" />
            </div>
            <div className="text-xs font-bold text-[#24364B]">View budget</div>
            <p className="text-[11px] text-[#687789] mt-0.5">Check category limits</p>
          </button>

          {/* Action 3: View Analytics */}
          <button
            onClick={() => setCurrentView('insights')}
            className="penny-card p-4 text-left hover:border-[#BBD9F5] hover:bg-[#E8F3FF]/30 transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#E9E5F8] text-[#5B4897] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-4 h-4 stroke-[2]" />
            </div>
            <div className="text-xs font-bold text-[#24364B]">View analytics</div>
            <p className="text-[11px] text-[#687789] mt-0.5">Spending trends & estimates</p>
          </button>

          {/* Action 4: Ask Pennywise */}
          <button
            onClick={() => setCurrentView('assistant')}
            className="penny-card p-4 text-left hover:border-[#E6D480] hover:bg-[#FDF8E2]/50 transition-all group border-l-4 border-l-[#F8E7A1]"
          >
            <div className="w-8 h-8 rounded-lg bg-[#F8E7A1] text-[#24364B] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <MessageSquare className="w-4 h-4 stroke-[2]" />
            </div>
            <div className="text-xs font-bold text-[#24364B]">Ask Pennywise</div>
            <p className="text-[11px] text-[#687789] mt-0.5">Ask questions about money</p>
          </button>
        </div>
      </div>

      {/* Optional: Clean Uncluttered Trend Overview (Toggleable) */}
      <div className="pt-2">
        <button
          onClick={() => setShowChart(!showChart)}
          className="text-xs font-medium text-[#687789] hover:text-[#24364B] flex items-center gap-1.5 transition-colors"
        >
          <BarChart2 className="w-3.5 h-3.5 text-[#477EAD]" />
          <span>{showChart ? 'Hide monthly trend chart' : 'Show 6-month cashflow trend'}</span>
        </button>

        {showChart && monthlyTrends.length > 0 && (
          <div className="penny-card p-5 mt-3 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xs font-bold text-[#24364B]">Income vs. Expenses (Past 6 Months)</h3>
                <p className="text-[11px] text-[#687789]">Historical pattern over time</p>
              </div>
            </div>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyTrends} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <XAxis dataKey="label" stroke="#687789" fontSize={11} tickLine={false} />
                  <YAxis stroke="#687789" fontSize={11} tickLine={false} tickFormatter={(val) => `${currency}${val / 1000}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E6E8EC', borderRadius: '12px', fontSize: '12px', color: '#24364B', boxShadow: '0 4px 12px rgba(36,54,75,0.08)' }}
                    formatter={(val) => [`${currency}${Number(val).toLocaleString()}`, '']}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="income" name="Income" fill="#477EAD" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expense" name="Expenses" fill="#BBD9F5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
